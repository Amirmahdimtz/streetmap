// components/stepper-form/StepObjective.jsx
import { useFormContext } from "react-hook-form";
import { Box, TextField, Typography } from "@mui/material";
import { Flag } from "@mui/icons-material";

export default function StepObjective() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const objective = watch("objective");

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
        <Flag sx={{ color: "#34d399", fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
            هدف شما
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            چرا می‌خواهید به سازمان ما بپیوندید؟
          </Typography>
        </Box>
      </Box>

      <TextField
        {...register("objective")}
        multiline
        rows={6}
        fullWidth
        placeholder="هدف خود را از پیوستن به سازمان ما توضیح دهید..."
        error={!!errors.objective}
        helperText={errors.objective?.message}
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

      {/* Character Counter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: "#64748b" }}>
          حداقل ۲۰ کاراکتر
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color:
              objective?.length > 500
                ? "#f87171"
                : objective?.length > 400
                  ? "#fbbf24"
                  : "#64748b",
          }}
        >
          {objective?.length || 0} / ۵۰۰
        </Typography>
      </Box>
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
  "& .MuiFormHelperText-root": {
    color: "#f87171",
    fontFamily: "Vazirmatn, sans-serif",
  },
};
