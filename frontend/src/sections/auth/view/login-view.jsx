// sections/auth/view/login-view.jsx
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
import { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { loginSchema } from "../model/auth.schema";
import { useRouter } from "../../../routes/hooks/use-router";
import { auth } from "../../../services/api";

export function LoginView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      
      // ✅ اتصال به بک‌اند واقعی
      const response = await auth.login(data);
      const { access_token, user_id, username } = response.data;
      
      // ذخیره توکن در localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);
      
      console.log("ورود موفق:", { user_id, username });
      
      // رفتن به صفحه سوالات
      router.push('/questions');
      
    } catch (error) {
      console.error("خطا در ورود:", error);
      setServerError(error.response?.data?.detail || "نام کاربری یا رمز عبور اشتباه است");
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName]?.message;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        padding: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          top: "-200px",
          right: "-100px",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          bottom: "-150px",
          left: "-80px",
        },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            zIndex: 1,
            padding: { xs: 4, sm: 6 },
            borderRadius: 6,
            background: "rgba(30, 41, 59, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 0 40px rgba(59,130,246,0.3)",
              }}
            >
              <FiLock style={{ fontSize: 36, color: "white" }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#f1f5f9",
                mb: 1,
                fontSize: { xs: "1.8rem", sm: "2.2rem" },
              }}
            >
              ورود به حساب
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                fontSize: "0.95rem",
              }}
            >
              برای ادامه اطلاعات خود را وارد کنید
            </Typography>
          </Box>

          {serverError && (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                mb: 3,
                borderRadius: 3,
                backgroundColor: "rgba(239,68,68,0.15)",
                color: "#fca5a5",
                border: "1px solid rgba(239,68,68,0.3)",
                "& .MuiAlert-icon": {
                  color: "#fca5a5",
                },
              }}
              onClose={() => setServerError("")}
            >
              {serverError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ mb: 2.5 }}>
              <TextField
                fullWidth
                name="username"
                placeholder="نام کاربری خود را بنویسید"
                disabled={isSubmitting}
                error={!!getFieldError("username")}
                helperText={getFieldError("username")}
                dir="rtl"
                {...register("username")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    color: "#e2e8f0",
                    fontSize: "0.95rem",
                    transition: "all 0.3s",
                    "& fieldset": {
                      borderColor: "rgba(148, 163, 184, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(59, 130, 246, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
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
                    marginLeft: 0,
                    color: "#fca5a5",
                    fontSize: "0.8rem",
                    mt: 0.5,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiUser style={{ color: "#64748b", fontSize: "1.2rem" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="رمز عبور خود را بنویسید"
                disabled={isSubmitting}
                error={!!getFieldError("password")}
                helperText={getFieldError("password")}
                dir="rtl"
                {...register("password")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    color: "#e2e8f0",
                    fontSize: "0.95rem",
                    transition: "all 0.3s",
                    "& fieldset": {
                      borderColor: "rgba(148, 163, 184, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(59, 130, 246, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
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
                    marginLeft: 0,
                    color: "#fca5a5",
                    fontSize: "0.8rem",
                    mt: 0.5,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiLock style={{ color: "#64748b", fontSize: "1.2rem" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        tabIndex={-1}
                        sx={{ color: "#64748b" }}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ textAlign: "left", mb: 1 }}>
              <Typography
                component="a"
                href="#"
                sx={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  transition: "color 0.3s",
                  "&:hover": {
                    color: "#60a5fa",
                    textDecoration: "underline",
                  },
                }}
              >
                رمز عبور را فراموش کرده‌اید؟
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                borderRadius: 3,
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                boxShadow: "0 10px 25px -5px rgba(59,130,246,0.4)",
                transition: "all 0.3s",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  boxShadow: "0 15px 30px -5px rgba(59,130,246,0.5)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: "#475569",
                  boxShadow: "none",
                },
              }}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FiLogIn />
                )
              }
            >
              {isSubmitting ? "در حال ورود..." : "ورود به حساب"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                حساب کاربری ندارید؟{" "}
                <Typography
                  onClick={() => router.push("/register")}
                  sx={{
                    color: "#3b82f6",
                    textDecoration: "none",
                    fontWeight: 700,
                    transition: "color 0.3s",
                    "&:hover": {
                      color: "#60a5fa",
                      textDecoration: "underline",
                    },
                  }}
                >
                  همین حالا بسازید
                </Typography>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}