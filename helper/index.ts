import appToast from "../components/toast";
import { apiFetchErrMsg, successResponse } from "../constants";

export const convertBinaryAudioToMP3 = (
  binaryData: string
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    try {
      // Decode the base64-encoded binary data
      const decodedData = atob(binaryData);

      // Create an ArrayBuffer from the decoded binary data
      const arrayBuffer = new ArrayBuffer(decodedData.length);
      const view = new Uint8Array(arrayBuffer);

      for (let i = 0; i < decodedData.length; i++) {
        view[i] = decodedData.charCodeAt(i);
      }

      // Create a Blob from the ArrayBuffer
      const blob = new Blob([arrayBuffer], { type: "audio/mp3" });

      // Create a URL for the Blob
      const audioURL = URL.createObjectURL(blob);

      resolve(audioURL);
    } catch (error) {
      reject(error);
    }
  });
};

export const handleWhiteSpaceInString = (label: string) => {
  let areWhiteSpacesPresent = false;
  const regEx = /\s/g;
  if (regEx.test(label)) {
    areWhiteSpacesPresent = true;
  }
  return areWhiteSpacesPresent;
};

export const validateEmail = (email: string): boolean => {
  let isValid = false;
  const mailFormat =
    /^[A-Za-z0-9._%+-]+(\+[0-9]+)?@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (email?.match(mailFormat)) {
    isValid = true;
  }

  return isValid;
};

export const getCapitalizedString = (str: string): string => {
  const splitStr = str?.toLowerCase().split(" ");
  for (let i = 0; i < splitStr?.length; i++) {
    splitStr[i] =
      splitStr[i]?.charAt(0)?.toUpperCase() + splitStr[i]?.substring(1);
  }

  return splitStr?.join(" ");
};

export const getResponseHandler = async (
  type: string,

  // method: string,
  apiCallback: any
): Promise<any> => {
  try {
    const response = await apiCallback();
    // console.log("response", response);

    const { message, data, status_code } = response;

    if (
      message !== successResponse.message &&
      message !== getCapitalizedString(successResponse.message) &&
      status_code != `${type}${successResponse.ok}`
    ) {
      if (message) appToast(message, "error");
      // console.log("going into error block");
      //   MixpanelTracking.getInstance().errorOccurred(type, profile.id, response);
      return;
    }

    return data;
  } catch (e) {
    appToast(apiFetchErrMsg, "error");
  }
};

export const checkIfObjectHaveSpaceValues = (obj: any) => {
  for (var key in obj) {
    if (obj[key] === " ") {
      obj[key] = "";
    }
  }
  return obj;
};
