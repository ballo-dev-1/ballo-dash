// pages/_app.tsx
import "@assets/scss/custom.scss";
import "@assets/css/global.css";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { RootState, wrapper } from "../toolkit/index";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import type { NextPage } from "next";
import { appWithTranslation } from "next-i18next";
import { CompanyProvider } from "@/app/contexts/CompanyContext";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/app/contexts/UserContext";
import { useRouter } from "next/router";
import Loading from "./pages/loading";
import { useAppDispatch } from "@/toolkit/hooks";
import { fetchMetaPosts, fetchMetaStats } from "@/toolkit/metaData/reducer";
import { fetchCompany } from "@/toolkit/Company/reducer";
import { useSelector } from "react-redux";
import AppInitializer from "@/Common/AppInitializer";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: any;
};

<AppInitializer />;
const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
  ...rest
}: AppPropsWithLayout) => {
  const { store } = wrapper.useWrappedStore(rest);
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Ballo Dashboard</title>
      </Head>
      <SessionProvider session={session}>
        <ReduxProvider store={store}>
          <CompanyProvider>
            <UserProvider>
              <Toaster position="top-center" />
              {loading && <Loading />}
              <AppInitializer />
              {getLayout(<Component {...pageProps} />)}
            </UserProvider>
          </CompanyProvider>
        </ReduxProvider>
      </SessionProvider>
    </>
  );
};

export default appWithTranslation(MyApp);
