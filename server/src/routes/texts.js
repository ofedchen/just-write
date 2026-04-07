import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import {
  handleValidationErrors,
  validatePublishText
} from "../middleware/validate.js";

const router = express.Router();

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const texts = await prisma.publishedText.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          select: {
            username: true
          }
        },
        likes: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    const mapped = texts.map((item) => {
      const likesList = item.likes.map((like) => like.user.username);
      const likedByMe = req.user ? item.likes.some((like) => like.userId === req.user.userId) : false;

      return {
        id: item.id,
        name: item.author.username,
        prompt: item.prompt,
        text: item.text,
        date: item.date,
        createdAt: item.createdAt,
        likesCount: item._count.likes,
        likedByMe,
        likesList
      };
    });

    return res.json(mapped);
  } catch (error) {
    return next(error);
  }
});

router.post("/", authenticate, validatePublishText, handleValidationErrors, async (req, res, next) => {
  try {
    const createdText = await prisma.publishedText.create({
      data: {
        authorId: req.user.userId,
        prompt: req.body.prompt,
        text: req.body.text,
        date: req.body.date
      }
    });

    return res.status(201).json(createdText);
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/like", authenticate, async (req, res, next) => {
  try {
    const publishedTextId = req.params.id;

    const textExists = await prisma.publishedText.findUnique({
      where: { id: publishedTextId },
      select: { id: true }
    });

    if (!textExists) {
      return res.status(404).json({ error: "Text not found" });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_publishedTextId: {
          userId: req.user.userId,
          publishedTextId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_publishedTextId: {
            userId: req.user.userId,
            publishedTextId
          }
        }
      });
    } else {
      await prisma.like.create({
        data: {
          userId: req.user.userId,
          publishedTextId
        }
      });
    }

    const refreshedText = await prisma.publishedText.findUnique({
      where: {
        id: publishedTextId
      },
      include: {
        likes: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    if (!refreshedText) {
      return res.status(404).json({ error: "Text not found" });
    }

    const likesList = refreshedText.likes.map((like) => like.user.username);

    return res.json({
      likesCount: refreshedText._count.likes,
      likedByMe: refreshedText.likes.some((like) => like.userId === req.user.userId),
      likesList
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const publishedTextId = req.params.id;

    const text = await prisma.publishedText.findUnique({
      where: { id: publishedTextId },
      select: {
        id: true,
        authorId: true
      }
    });

    if (!text) {
      return res.status(404).json({ error: "Text not found" });
    }

    if (text.authorId !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          publishedTextId
        }
      }),
      prisma.publishedText.delete({
        where: {
          id: publishedTextId
        }
      })
    ]);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
