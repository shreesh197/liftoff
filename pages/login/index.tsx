// ** React Imports
import { ReactNode, useState, MouseEvent, useEffect } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Components
import Button from "@mui/material/Button";

// import Divider from '@mui/material/Divider'
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";

// import Box, { BoxProps } from '@mui/material/Box'
import FormControl from "@mui/material/FormControl";

// import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";

// import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import MuiCard, { CardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import jwt_decode from "jwt-decode";

// ** Config
import { authConfig } from "../../constants/auth";

// ** Icon Imports
import Icon from "../../components/icon";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";

// ** Configs
// import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from "../../components/layout/blank-layout";

// ** Hooks
// import { useAuth } from "src/hooks/useAuth";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { loginUser } from "../../services/auth";
import { apiFetchErrMsg, successResponse } from "../../constants";
import appToast from "../../components/toast";
import { handleWhiteSpaceInString, validateEmail } from "../../helper";
import { handleEmailAtAuth } from "../../helper/auth";
import { useDispatch } from "react-redux";
import { saveToken } from "../../redux/actions/token-action";
import { useSelector } from "react-redux";
import { StoreState } from "../../redux/types";
import { loader } from "../../components/loader";
import HelperText from "../../components/validation";
// import { MixpanelTracking } from "src/services/mixpanel";
import LoadingButton from "@mui/lab/LoadingButton";
import { validations } from "../../constants/validations";
import { useAuth } from "../../hooks/useAuth";
import { saveRouteRedirect } from "../../redux/actions/route-redirect-actions";

interface FormData {
  email: string;
  password: string;
}

interface State {
  password: string;
  showPassword: boolean;
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: 450 },
}));

const LoginPage = () => {
  // ** Hooks
  const dispatch = useDispatch();
  const auth = useAuth();
  const profile = useSelector((store: StoreState) => store.profile);
  // ** States
  const [state, setState] = useState<State>({
    password: "",
    showPassword: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isParamPresent, setIsParamPresent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // MixpanelTracking.getInstance().pageViewed("LOGIN");
  }, []);

  useEffect(() => {
    if (profile !== null) {
      router.push("/");
    }
  }, [router]);

  const { control } = useForm({});

  // console.log("email ======>", email);

  useEffect((): any => {
    if (router.isReady) {
      const email = router.query.email as string;
      if (email) {
        let user_email = email;
        if (handleWhiteSpaceInString(email)) {
          user_email = handleEmailAtAuth(email);
        }
        setIsParamPresent(true);
        setEmail(user_email);
      }
    }
  }, [router.isReady]);

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async () => {
    setIsLoading(true);
    // MixpanelTracking.getInstance().buttonClicked("LOGIN");
    const userObj = {
      email: email,
      password: password,
    };

    try {
      const response: any = await loginUser(userObj);

      const { message, status_code, data }: any = response;
      if (
        message !== successResponse.message &&
        status_code !== `${successResponse.ok}`
      ) {
        // MixpanelTracking.getInstance().errorOccurred("LOGIN", "", response);
        appToast(message, "error");
        setIsLoading(false);
        return;
      }
      // MixpanelTracking.getInstance().loginDone(userObj);

      const { access_token, refresh_token }: any = data;
      const { sub, name }: any = jwt_decode(access_token);

      const tokenData = {
        access_token,
        refresh_token,
      };
      dispatch(saveToken(tokenData));

      auth.login({ email, password, sub, name }, () => {
        setError("email", {
          type: "manual",
          message: "Email or Password is invalid",
        });
      });
      router.push("/");
      setIsLoading(false);
    } catch (e) {
      appToast(apiFetchErrMsg, "error");
      setIsLoading(false);
    }
  };

  // console.log("user email", email);

  return profile === null ? (
    <Box className="content-center custom-bg">
      <div className="page-card card-additional-styles new-card-style md:max-w-[33rem]">
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // mt: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              ml: 2,
              lineHeight: 1,
              fontWeight: 700,
              fontSize: "1.5rem !important",
              marginTop: "26px",
            }}
            className="w-[126px]"
          >
            <img
              className="kodLogo object-contain"
              src={"/logos/kodnest-logo.png"}
              alt="appLogo"
            />
          </Typography>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{ mb: 1.5, fontWeight: 600, letterSpacing: "0.18px" }}
          >
            {`Welcome KodNestian!`}
          </Typography>

          <Typography variant="body2">
            Sign In to KodNest and ignite your learning and placement journey
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <TextField
                name="email"
                value={email}
                disabled={isParamPresent}
                label="Email"
                error={Boolean(
                  (!email && isChecked) || (email && !validateEmail(email))
                )}
                onChange={(e: any) => {
                  onChange(e?.target?.value);
                  setEmail(e?.target?.value);
                }}
                placeholder="Email"
              />
            )}
          />
          {!email && isChecked ? (
            <HelperText type="required" />
          ) : (
            email &&
            !validateEmail(email) && (
              <HelperText custom={validations.email} type="invalid" />
            )
          )}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel
            htmlFor="validation-schema-setPassword"
            error={Boolean(!password && isChecked)}
          >
            Password
          </InputLabel>
          <Controller
            name="setPassword"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <OutlinedInput
                value={value}
                label="Password"
                onChange={(e) => {
                  onChange(e.target.value);
                  setPassword(e.target.value);
                }}
                className="password"
                id="validation-schema-setPassword"
                error={Boolean(!password && isChecked)}
                type={state.showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label="toggle password visibility"
                    >
                      <Icon
                        icon={
                          state.showPassword
                            ? "mdi:eye-outline"
                            : "mdi:eye-off-outline"
                        }
                        color="#000"
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />
          {!password && isChecked ? (
            <HelperText type="required" />
          ) : (
            <></>
            // password &&
            // !validatePassword(password) && (
            //   <HelperText label="Password" type="invalid" />
            // )
          )}
        </FormControl>

        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Link
            href={`https://${
              process.env.NEXT_PUBLIC_API_URL?.includes("staging")
                ? "staging-"
                : ""
            }app.kodnest.com/forgot-password`}
            legacyBehavior
          >
            <a onClick={() => dispatch(saveRouteRedirect(router.asPath))}>
              <Typography
                variant="body2"
                sx={{ color: "primary.main", textDecoration: "none" }}
              >
                Forgot Password?
              </Typography>
            </a>
          </Link>
        </Box>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ mb: 7 }}
          loading={isLoading}
          loadingPosition="center"
          loadingIndicator=""
          onClick={(e) => {
            if (!validateEmail(email) || !password) {
              setIsChecked(true);
            } else {
              onSubmit();
              setIsChecked(false);
            }
          }}
        >
          {!isLoading ? (
            <span className="flex text-[18px]">Login</span>
          ) : (
            <>
              <CircularProgress size={24} style={{ color: "white" }} />
            </>
          )}
        </LoadingButton>
      </div>
    </Box>
  ) : (
    loader()
  );
};
LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
export default LoginPage;
function setError(arg0: string, arg1: { type: string; message: string }) {
  throw new Error("Function not implemented.");
}
