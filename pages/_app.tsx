import "@/styles/globals.css";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { Provider } from "react-redux";
import Head from "next/head";
import { AuthProvider } from "../context/auth";
import WindowWrapper from "../components/window-wrapper";
import AuthGuard from "../components/auth";
import { ReactNode } from "react";
import Spinner from "../components/loader";
import { DeviceProvider } from "app-repo-common-pkg";

function App({ Component, pageProps }: any) {
  type GuardProps = {
    authGuard: boolean;
    children: ReactNode;
  };
  const authGuard = Component?.authGuard;
  const Guard = ({ children, authGuard }: GuardProps) => {
    if (!authGuard) {
      return <>{children}</>;
    } else {
      return (
        <AuthGuard fallback={<Spinner isLogoRequired={true} />}>
          {children}
        </AuthGuard>
      );
    }
  };
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <title>KodNest - Mock Assessment</title>
          <meta
            name="description"
            content={`KodNest – India's Best Job Seekers & Training Platform`}
          />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <AuthProvider>
          <WindowWrapper>
            <DeviceProvider>
              <Guard authGuard={authGuard}>
                <main className="scroll-smooth antialiased [font-feature-settings:'ss01']">
                  <Component {...pageProps} />
                </main>
              </Guard>
            </DeviceProvider>
          </WindowWrapper>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
