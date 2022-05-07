import React, { ReactNode } from "react";
import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";

type Props = {
  users: Prisma.UserSelect[];
};

const Home: React.FC<Props> = ({ users }: { users: Prisma.UserSelect[] }) => {
  return (
    <Layout>
      <div className="page">
        <h1>Home</h1>
        <main>{users.map((user) => JSON.stringify(user))}</main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/users");
  const users = await res.json();
  return {
    props: { users },
  };
};

export default Home;
