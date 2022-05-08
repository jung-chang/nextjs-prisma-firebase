import Layout from "components/Layout";
import initAuth from "lib/firebase";

initAuth();

const App = ({ Component, pageProps }) => (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

export default App;