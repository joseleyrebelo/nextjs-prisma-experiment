// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import seed from "../../prisma/seed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { userCount } = req.query;

  if (
    !userCount ||
    typeof userCount !== "string" ||
    isNaN(parseInt(userCount))
  ) {
    res
      .status(400)
      .send({
        message: "Parameter 'userCount' value must be between 1 and 1000000.",
      });
    return true;
  }

  try {
    await seed(parseInt(userCount));
  } catch {
    res
      .status(400)
      .send({ message: "Sorry an error occured - please try again later." });
  }
  res.status(200).send({ message: "Users regenerated." });
}
