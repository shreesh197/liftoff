// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Types
import { AuthValuesType, UserDataType } from "./types";
import { checkIfObjectHaveSpaceValues, getResponseHandler } from "../helper";
import { serviceMapping, successResponse } from "../constants";
import { getBatchByBatchId, getUserById } from "../services/user-onboarding";
import { authConfig } from "../constants/auth";
import { useDispatch } from "react-redux";
import { saveProfile } from "../redux/actions/profile-actions";
import { useSelector } from "react-redux";
import { StoreState, UserProfile } from "../redux/types";
import { profileTypeMapping } from "../constants/auth";
import { resetState } from "../redux/actions/reset";
import { saveBatchDetails } from "../redux/actions/batch-actions";
import { saveRoute } from "../redux/actions/route-action";

// import { pageRoutes } from 'src/helper'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const token = useSelector((state: StoreState) => state.token);
  const profile = useSelector((state: StoreState) => state.profile);
  const routeId = useSelector((state: StoreState) => state.route);
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);

  // ** Hooks
  const router = useRouter();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      if (token && profile) {
        const userData: any = { ...profile };
        setLoading(true);
        setUser({ ...userData });
        setLoading(false);
      } else {
        localStorage.removeItem(authConfig.rootStore);
        setUser(null);
        setLoading(false);
        // router.replace("/login");
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (params: any) => {
    const returnUrl = router.query.returnUrl;
    let userData: any = {
      id: params?.sub,
      fullName: params?.name,
      username: params?.name,
      email: params.email,
      // password: params.password,
    };

    const responseData: UserProfile = await getResponseHandler(
      serviceMapping.profile,
      () => getUserById(params?.sub)
    );

    //profile details
    userData = {
      ...userData,
      role:
        responseData?.profile_type === profileTypeMapping.user
          ? "client"
          : profileTypeMapping.admin,
      basic_details: responseData?.basic_details || null,
      academic_details: responseData?.academic_details || null,
      documents_details: responseData?.documents_details || null,
      other_details: responseData?.other_details || null,
      batch_id: responseData?.batch_id,
      batch_type: responseData?.batch_type,
      profile_photo: responseData?.profile_photo,
      is_profile_completed: responseData?.is_profile_completed,
      placement_preference: responseData?.placement_preference,
      course_opted: responseData?.course_opted,
    };

    const obj = checkIfObjectHaveSpaceValues(userData.basic_details);
    userData.basic_details = obj;

    const batchRes = await getBatchByBatchId(responseData?.batch_id);
    const { status_code, data, message } = batchRes;
    if (
      status_code !== +successResponse.ok &&
      message !== successResponse.message
    )
      return;
    const batchDetails = { ...data };

    dispatch(saveBatchDetails({ ...batchDetails }));

    dispatch(saveProfile({ ...userData }));

    setUser({ ...userData });

    const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";

    router.replace(redirectURL as string);
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem(authConfig.rootStore);
    window.localStorage.setItem("routeRedirect", routeId);
    dispatch(resetState());
    dispatch(saveRoute(routeId));
    window.localStorage.removeItem("routeRedirect");
    router.push("/login");
  };

  const values = {
    user,
    loading,
    token,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
