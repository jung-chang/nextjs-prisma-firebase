import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;
  if (req.method === "GET") {
    const result = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    res.json(result);
  } else {
    res.status(404);
  }
}
