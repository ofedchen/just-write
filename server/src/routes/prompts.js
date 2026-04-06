import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const prompts = await prisma.prompt.findMany({
      orderBy: {
        id: "asc"
      },
      select: {
        id: true,
        text: true
      }
    });

    return res.json(prompts);
  } catch (error) {
    return next(error);
  }
});

export default router;
