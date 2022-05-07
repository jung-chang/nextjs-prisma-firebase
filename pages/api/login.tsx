import type { NextApiRequest, NextApiResponse } from "next";
import { setAuthCookies } from "next-firebase-auth";
import prisma from "lib/prisma";
import initAuth from "lib/firebase";
import firebase from "firebase/app";

initAuth();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  try {
    const firebaseUser = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    await setAuthCookies(req, res);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Unexpected error." });
  }
  return res.status(200).json({ status: true });
}
