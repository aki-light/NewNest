import type { NextPage } from "next";
import HomeContents from "../components/home_contents/HomeContents";
import Layout from "../components/layout/Layout";

const Home: NextPage = () => {
  const title: string = "NewNest";

  return (
    <Layout title={title}>
      <HomeContents />
    </Layout>
  );
};

export default Home;
