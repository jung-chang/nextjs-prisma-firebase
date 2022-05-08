import type { NextApiRequest, NextApiResponse } from "next";
import { setAuthCookies, unsetAuthCookies } from "next-firebase-auth";
import prisma from "lib/prisma";
import initAuth from "lib/firebase";
import firebase from "firebase/app";

initAuth();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(403);
    return;
  }

  const body = JSON.parse(req.body);
  const { email, password } = body;

  try {
    const firebaseUser = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        throw Error(`Failed to sign into firebase: ${error}`);
      });

    console.log({ firebaseUser });

    const user = await prisma.user
      .findUnique({
        where: { firebaseId: firebaseUser.user.uid },
      })
      .catch((error) => {
        throw Error(`Failed to get user: ${error}`);
      });

    await setAuthCookies(req, res).catch((error) => {
      throw Error(`Failed to set auth cookie: ${error}`);
    });

    return res.status(200).json({ user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Unexpected error." });
  }
}
