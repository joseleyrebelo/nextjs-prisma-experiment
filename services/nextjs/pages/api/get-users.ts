// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../backend/utils/prisma";
import { getUsersData } from "../../prisma/utils";
import { parseIntQuery } from "../../util/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;

  let take = parseIntQuery(query.take) || 10;
  let skip = parseIntQuery(query.skip) || 0;

  if (isNaN(take) || isNaN(skip)) {
    res
      .status(400)
      .send({ message: "Parameter 'take' and 'skip' must be numbers." });
    return true;
  }

  try {
    const feed = await getUsersData(take, skip);
    res.status(200).send({ results: feed, cursor: skip + take });
  } catch {
    res
      .status(400)
      .send({ message: "Sorry an error occured - please try again later." });
  } finally {
    prisma.$disconnect();
  }
}
