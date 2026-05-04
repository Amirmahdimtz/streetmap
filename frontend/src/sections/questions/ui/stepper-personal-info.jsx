// components/stepper-form/StepPersonalInfo.jsx
import { useFormContext } from "react-hook-form";
import { Box, TextField, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";

export function StepPersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          textAlign: "right",
          gap: 2,
        }}
      >
        <Person sx={{ color: "#38bdf8", fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
            اطلاعات شخصی
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            لطفاً نام و نام خانوادگی خود را وارد کنید
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          fullWidth
          placeholder="نام خود را وارد کنید"
          sx={textFieldStyle}
        />
        <TextField
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          fullWidth
          placeholder="نام خانوادگی خود را وارد کنید"
          sx={textFieldStyle}
        />
      </Box>
    </Box>
  );
}

const textFieldStyle = {
  direction: "rtl",
  "& .MuiOutlinedInput-root": {
    color: "#e2e8f0",
    borderRadius: 2,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    "& fieldset": {
      borderColor: "rgba(148, 163, 184, 0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(148, 163, 184, 0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#38bdf8",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    "&.Mui-focused": {
      color: "#38bdf8",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#f87171",
    fontFamily: "Vazirmatn, sans-serif",
  },
};
