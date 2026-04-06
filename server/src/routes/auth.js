import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import {
  handleValidationErrors,
  validateLogin,
  validateSignup
} from "../middleware/validate.js";

const router = express.Router();
const dummyPasswordHash =
  "$2a$12$C6UzMDM.H6dfI/f/IKcEe.6StnY6PjRj7rwhhtjfiPgk41IrT9jpK";

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return process.env.JWT_SECRET;
}

function signAuthToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

const safeUserSelect = {
  id: true,
  username: true,
  firstname: true,
  surname: true,
  profileBio: true,
  profileFavoriteAuthors: true,
  profileFavoriteGenres: true,
  profileFavoriteBook: true,
  createdAt: true
};

router.post(
  "/signup",
  validateSignup,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const username = req.body.username.toLowerCase();
      const password = req.body.password;

      const existingUser = await prisma.user.findUnique({
        where: { username },
        select: { id: true }
      });

      if (existingUser) {
        return res.status(409).json({ error: "Username already taken" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          username,
          passwordHash,
          firstname: "",
          surname: "",
          profileBio: "",
          profileFavoriteAuthors: "",
          profileFavoriteGenres: "",
          profileFavoriteBook: ""
        },
        select: {
          id: true,
          username: true
        }
      });

      const token = signAuthToken(user);

      return res.status(201).json({ token, user });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(409).json({ error: "Username already taken" });
      }

      return next(error);
    }
  }
);

router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const username = req.body.username.toLowerCase();
      const password = String(req.body.password ?? "");

      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        await bcrypt.compare(password, dummyPasswordHash);
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = signAuthToken(user);

      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId
      },
      select: safeUserSelect
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.get("/check-username/:username", async (req, res, next) => {
  try {
    const username = String(req.params.username || "")
      .trim()
      .toLowerCase();

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    return res.json({ available: !user });
  } catch (error) {
    return next(error);
  }
});

export default router;
