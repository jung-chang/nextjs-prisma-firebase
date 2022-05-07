import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import initAuth from "lib/firebase";
import firebase from "firebase/app";

initAuth();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  try {
    const userCredentials: firebase.auth.UserCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        throw Error(`Failed to create firebase user: ${error}`);
      });
    const user = await prisma.user
      .create({
        data: {
          email: userCredentials.user.email,
          firebaseId: userCredentials.user.uid,
        },
      })
      .catch((error) => {
        throw Error(`Failed to create user: ${error}`);
      });

    // await userCredentials.user
    //   .sendEmailVerification()
    //   .catch((error) =>
    //     console.error(`Failed to send email verification: ${error}`)
    //   );
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
