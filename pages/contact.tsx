import type { NextPage } from "next";
import Form from "../components/Form";
import Layout from "../components/layout/Layout";

const Contact: NextPage = () => {
  const title: string = "NewNest";

  return (
    <Layout title={title}>
      <Form></Form>
    </Layout>
  );
};

export default Contact;
