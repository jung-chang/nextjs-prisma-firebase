import React from "react";
import { Prisma } from "@prisma/client";
import Layout from "components/Layout";
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";

type Props = {
  user: Prisma.UserSelect;
  authUser: any;
};

const AccountPage: React.FC<Props> = ({
  user,
}: {
  user: Prisma.UserSelect;
}) => {
  return (
    <Layout>
      <div className="page">
        <h1>User</h1>
        <main>{JSON.stringify(user)}</main>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const res = await fetch("http://localhost:3000/api/users");
  const user = await res.json();
  return {
    props: { authUser: AuthUser, user },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AccountPage);
