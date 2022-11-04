// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../backend/utils/prisma";
import { updateUserData } from "../../prisma/utils";
import { parseIntQuery } from "../../util/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;

  let id = parseIntQuery(query.id) || null;
  let color = query.color;

  if (!id || isNaN(id) || !color || typeof color !== "string") {
    res.status(400).send("Error wrong query parameters.");
    return true;
  }

  try {
    await updateUserData(id, { color });
    res.status(200).send({ message: "Color updated." });
  } catch {
    res
      .status(400)
      .send({ message: "Sorry an error occured - please try again later." });
  } finally {
    prisma.$disconnect();
  }
}
