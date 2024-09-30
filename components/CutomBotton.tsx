import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ label }: { label: string }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#81c784",
        borderRadius: "25px",
        padding: "10px 20px",
        "&:hover": {
          backgroundColor: "#66bb6a",
        },
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
