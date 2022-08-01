import Layout from "@components/DashboardLayout";
import Login from "@components/Login";
import { PageDefaultProps } from "@types";
import { cookieParser } from "@utils/utils";
import type { NextPage, GetStaticProps, GetServerSideProps } from "next";
import {} from "swr"
import Head from "next/head";
import Image from "next/image";

const DashboardMain: NextPage<PageDefaultProps> = ({auth}) => {
  if(!auth) return <Login/>
  return (
    <>
      <Layout>
        asdasd
      </Layout>
    </>
  );
};

export default DashboardMain;
