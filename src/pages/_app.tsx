import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider, SignIn } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
  <ClerkProvider {...pageProps}>
    <Head>
      <title>Chirpy</title>
      <meta name="description" content="💭" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Toaster position="bottom-center" />
    <Component {...pageProps} />
  </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
