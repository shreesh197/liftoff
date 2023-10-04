// ** React Imports
import { ReactNode, ReactElement, useEffect } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Hooks Import
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { StoreState } from "../../redux/types";
import { useDispatch } from "react-redux";
import { saveRouteRedirect } from "../../redux/actions/route-redirect-actions";

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactElement | null;
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props;
  const router = useRouter();
  const profile = useSelector((state: StoreState) => state.profile);
  const dispatch = useDispatch();

  // console.log("auth guard", router.asPath);

  useEffect(() => {
    if (router.isReady) {
      if (!profile) {
        if (router.asPath !== "/") {
          dispatch(saveRouteRedirect(router.asPath));
        }
        router.push("/login");
      }
    }
  }, [router.isReady]);

  return profile === null ? fallback : <>{children}</>;
};

export default AuthGuard;
