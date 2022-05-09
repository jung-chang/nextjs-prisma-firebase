import React from "react";
import { Prisma } from "@prisma/client";
import Layout from "components/Layout";
import firebase from "firebase/app";
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";

type Props = {
  user: Prisma.UserSelect;
};

const AccountPage: React.FC<Props> = ({
  user,
}: {
  user: Prisma.UserSelect;
}) => {
  console.log({ user });

  const logout = async () => {
    await firebase.auth().signOut();
  };

  return (
    <Layout>
      <div className="page">
        <h1>Account</h1>
        <main>
          {JSON.stringify(user)}
          <button onClick={logout}>log out</button>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const token = await AuthUser.getIdToken().catch((error) => {
    console.error(error);
  });
  const response = await fetch("http://localhost:3000/api/account", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = await response.json();
  return {
    props: { user },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AccountPage);
