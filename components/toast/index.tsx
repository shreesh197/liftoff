import React from "react";
import { toast, ToastOptions } from "react-toastify";
// import { appToastTimeout } from "src/constants";

type Type = "info" | "warning" | "error" | "success" | "default";

const appToast = (message: string, type: Type = "info") => {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
  };
  if (type === "default") {
    toast(
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1, fontSize: 15, padding: "8px 12px" }}>
          {message}
        </div>
      </div>,
      options
    );
  } else {
    toast[type](
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1, fontSize: 15, padding: "8px 12px" }}>
          {message}
        </div>
      </div>,
      options
    );
  }
};

appToast.dismiss = toast.dismiss;

export default appToast;
