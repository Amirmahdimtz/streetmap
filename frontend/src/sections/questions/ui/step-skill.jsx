// components/stepper-form/StepSkills.jsx
import { useFormContext } from "react-hook-form";
import { Box, TextField, Typography } from "@mui/material";
import { Code } from "@mui/icons-material";

export default function StepSkills() {
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
        <Code sx={{ color: "#818cf8", fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
            مهارت‌های شما
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            مهارت‌های تخصصی خود را وارد کنید
          </Typography>
        </Box>
      </Box>

      <TextField
        {...register("skills")}
        multiline
        rows={6}
        fullWidth
        placeholder="هدف خود را از پیوستن به سازمان ما توضیح دهید..."
        error={!!errors.skills}
        helperText={errors.skills?.message}
        sx={{
          ...textFieldStyle,
          "& .MuiOutlinedInput-root": {
            ...textFieldStyle["& .MuiOutlinedInput-root"],
            fontFamily: "Vazirmatn, sans-serif",
            lineHeight: 1.8,
          },
          direction: "rtl",
        }}
      />
    </Box>
  );
}

const textFieldStyle = {
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
};
