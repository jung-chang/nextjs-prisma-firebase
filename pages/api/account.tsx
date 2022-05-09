import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { AuthUser, verifyIdToken } from "next-firebase-auth";

const getAuthUser = async (req: NextApiRequest): Promise<AuthUser> => {
  const BEARER_PREFIX = "Bearer ";
  if (!req.headers || !req.headers.authorization) {
    throw Error("No authroization in request header.");
  }

  const authHeader = req.headers.authorization;
  if (!authHeader.startsWith(BEARER_PREFIX)) {
    throw Error("Invalid authroization in request header.");
  }

  const token = authHeader.substring(BEARER_PREFIX.length, authHeader.length);
  return verifyIdToken(token);
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const authUser = await getAuthUser(req);
    const user = await prisma.user.findUnique({
      where: {
        email: authUser.email,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: "Unexpected error." });
  }
}
