import type { NextApiRequest, NextApiResponse } from "next";
import { unsetAuthCookies } from "next-firebase-auth";
import initAuth from "lib/firebase";

initAuth();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await unsetAuthCookies(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ status: true });
}
