// sections/auth/view/register-view.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { registerSchema } from "../model/auth.schema";
import { useRouter } from "../../../routes/hooks/use-router";
import { auth } from "../../../services/api";

export function RegisterView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      
      // ✅ اتصال به بک‌اند واقعی - فقط username و password فرستاده می‌شود
      const response = await auth.register({
        username: data.username,
        password: data.password,
      });
      
      console.log("ثبت نام موفق:", response.data);
      
      // رفتن به صفحه ورود
      router.push('/login');
      
    } catch (error) {
      console.error("خطا در ثبت نام:", error);
      setServerError(error.response?.data?.detail || "خطا در ثبت نام");
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName]?.message;
  };

  const inputStyle = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      backgroundColor: "rgba(15, 23, 42, 0.6)",
      color: "#e2e8f0",
      fontSize: "0.95rem",
      "& fieldset": {
        borderColor: "rgba(148, 163, 184, 0.2)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(59, 130, 246, 0.5)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3b82f6",
        borderWidth: "1px",
      },
      "&.Mui-error fieldset": {
        borderColor: "#ef4444",
      },
      "& input": {
        textAlign: "right",
        padding: "14px 16px",
        "&::placeholder": {
          color: "#64748b",
          opacity: 1,
        },
      },
    },
    "& .MuiFormHelperText-root": {
      textAlign: "right",
      marginRight: 0,
      color: "#fca5a5",
      fontSize: "0.75rem",
      mt: 0.5,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: "#1e293b",
            border: "1px solid rgba(148, 163, 184, 0.08)",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#f1f5f9",
                mb: 0.5,
              }}
            >
              ایجاد حساب
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              اطلاعات خود را وارد کنید
            </Typography>
          </Box>

          {serverError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                backgroundColor: "rgba(239,68,68,0.1)",
                color: "#fca5a5",
                border: "1px solid rgba(239,68,68,0.2)",
                "& .MuiAlert-icon": { color: "#fca5a5" },
                fontSize: "0.85rem",
                py: 0.5,
              }}
              onClose={() => setServerError("")}
            >
              {serverError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              name="fullName"
              placeholder="نام و نام خانوادگی"
              disabled={isSubmitting}
              error={!!getFieldError("fullName")}
              helperText={getFieldError("fullName")}
              dir="rtl"
              {...register("fullName")}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiUser style={{ color: "#475569", fontSize: "1.1rem" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="ایمیل"
              disabled={isSubmitting}
              error={!!getFieldError("email")}
              helperText={getFieldError("email")}
              dir="ltr"
              {...register("email")}
              sx={{
                ...inputStyle,
                "& .MuiOutlinedInput-root input": {
                  textAlign: "left",
                  padding: "14px 16px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMail style={{ color: "#475569", fontSize: "1.1rem" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="username"
              placeholder="نام کاربری"
              disabled={isSubmitting}
              error={!!getFieldError("username")}
              helperText={getFieldError("username")}
              dir="ltr"
              {...register("username")}
              sx={{
                ...inputStyle,
                "& .MuiOutlinedInput-root input": {
                  textAlign: "left",
                  padding: "14px 16px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiUser style={{ color: "#475569", fontSize: "1.1rem" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="رمز عبور"
              disabled={isSubmitting}
              error={!!getFieldError("password")}
              helperText={getFieldError("password")}
              dir="rtl"
              {...register("password")}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock style={{ color: "#475569", fontSize: "1.1rem" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      tabIndex={-1}
                      sx={{ color: "#475569", padding: 0.5 }}
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="تکرار رمز عبور"
              disabled={isSubmitting}
              error={!!getFieldError("confirmPassword")}
              helperText={getFieldError("confirmPassword")}
              dir="rtl"
              {...register("confirmPassword")}
              sx={{ ...inputStyle, mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock style={{ color: "#475569", fontSize: "1.1rem" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                py: 1.4,
                borderRadius: 3,
                fontSize: "0.95rem",
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
                "&:disabled": {
                  backgroundColor: "#334155",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "ثبت‌نام"
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
              حساب کاربری دارید؟{" "}
              <Typography
                component="a"
                href="/login"
                sx={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                وارد شوید
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}