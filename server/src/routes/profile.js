import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { handleValidationErrors, validateProfile } from "../middleware/validate.js";

const router = express.Router();

const profileSelect = {
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

router.get("/", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: profileSelect
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const username = String(req.params.username || "").trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { username },
      select: profileSelect
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.patch("/", authenticate, validateProfile, handleValidationErrors, async (req, res, next) => {
  try {
    const updatableFields = [
      "firstname",
      "surname",
      "profileBio",
      "profileFavoriteAuthors",
      "profileFavoriteGenres",
      "profileFavoriteBook"
    ];

    const data = {};

    for (const field of updatableFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        data[field] = req.body[field];
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId
      },
      data,
      select: profileSelect
    });

    return res.json(updatedUser);
  } catch (error) {
    return next(error);
  }
});

export default router;
