// ** MUI Import
import { useTheme } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { spinnerType } from "../../constants/loader";

// type LoaderType  =

export const loader = (
  additionalText?: string,
  isLogoNotRequired?: boolean,
  customHeight?: boolean,
  isNoResultPresent?: boolean,
  isBackgroundRequired?: boolean,
  height?: string,
  type?: string
) => {
  return (
    <FallbackSpinner
      isLogoRequired={isLogoNotRequired ? false : true}
      additionalText={additionalText}
      customHeight={customHeight}
      isNoResultPresent={isNoResultPresent}
      isBackgroundRequired={isBackgroundRequired}
      height={height}
      type={type}
    />
  );
};

const FallbackSpinner = (
  // { sx }: { sx?: BoxProps['sx'] }
  props: any
) => {
  // ** Hook
  const theme = useTheme();
  // #f5f5f7
  return (
    <Box
      sx={{
        height: props.height ? props.height : "100vh",
        width: "100%",
        background: props.isBackgroundRequired ? "#f5f5f7" : "transparent",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "14px",
        mt: 5,
        ...props.sx,
      }}
    >
      {props.isLogoRequired ? (
        <div className="flex flex-col justify-center items-center w-[126px]">
          <img
            className="kodLogo"
            src={"/logos/kodnest-logo.png"}
            alt="app-logo"
          />
          <CircularProgress disableShrink sx={{ mt: 6 }} />
        </div>
      ) : (
        <>
          {props?.type
            ? getSpinner(props.type)
            : !props.isNoResultPresent && (
                <div className="mb-2">
                  <CircularProgress disableShrink sx={{ mt: 6, mb: 4 }} />
                </div>
              )}
        </>
      )}

      {props.isNoResultPresent ? (
        <div className="flex flex-col justify-center items-center">
          <img className="kodLogo" src={"/svgs/no-result.svg"} alt="app-logo" />
          <div className="additional-text-container">No Result Found</div>
        </div>
      ) : (
        props.additionalText && (
          <div className="additional-text-container">
            {props.additionalText}
          </div>
        )
      )}
    </Box>
  );
};

export default FallbackSpinner;

const getSpinner = (type: string) => {
  switch (type) {
    case spinnerType.assessment:
      return <img className="mb-4 app-loader" src="/gifs/assessment.gif" />;
    case spinnerType.course:
      return <img className="mb-4 app-loader" src="/gifs/course.gif" />;
    case spinnerType.resume:
      return <img className="mb-4 app-loader" src="/gifs/resume.gif" />;
    case spinnerType.profile:
      return <img className="mb-4 app-loader" src="/gifs/profile.gif" />;
    case spinnerType.placement:
      return <img className="mb-4 app-loader" src="/gifs/placement.gif" />;
    // default: return <img className="app-loader" src="/gifs/app-loader.gif" />
  }
};
