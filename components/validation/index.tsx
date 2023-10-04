import { FormHelperText } from "@mui/material";
import React from "react";
import { boolean } from "yup";

const HelperText = ({
  type,
  label,
  custom,
}: {
  type: string;
  label?: string;
  custom?: string;
}) => {
  const stringType =
    type === "required"
      ? `Please fill out all the required fields.`
      : `Enter valid ${label}`;
  return (
    <FormHelperText
      sx={{ color: "error.main", lineHeight: "1.75", fontWeight: "600" }}
      id="validation-schema-email"
    >
      {Boolean(custom) ? custom : stringType}
    </FormHelperText>
  );
};

export default HelperText;
