import { Prisma } from "@prisma/client";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Unique constraint violation" });
    }

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Resource not found" });
    }
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    console.error(err);
    return res.status(err.statusCode || 500).json({ error: "Internal server error" });
  }

  return res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
    stack: err.stack
  });
}
