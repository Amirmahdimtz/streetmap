import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Fade,
  Alert,
} from "@mui/material";
import { ArrowForward, ArrowBack, Check, Send } from "@mui/icons-material";

import { applicationSchema, stepSchemas } from "../model/questions.schema";
import { StepPersonalInfo } from "./stepper-personal-info";
import StepSkills from "./step-skill";
import StepObjective from "./step-objective";
import StepLocation from "./step-location";
import { profile, locations } from "../../../services/api";
import { useRouter } from "../../../routes/hooks/use-router";

const steps = [
  { label: "اطلاعات شخصی", icon: "👤" },
  { label: "مهارت‌ها", icon: "⚡" },
  { label: "هدف", icon: "🎯" },
  { label: "موقعیت مکانی", icon: "📍" },
];

const stepComponents = [
  StepPersonalInfo,
  StepSkills,
  StepObjective,
  StepLocation,
];

export default function StepperForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(
      activeStep === steps.length ? applicationSchema : stepSchemas[activeStep]
    ),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      skills: "",
      objective: "",
      location: { lat: null, lng: null, address: "" },
    },
  });

  const {
    trigger,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    
    try {
      const token = localStorage.getItem('access_token');
      
      // بررسی وجود توکن
      if (!token) {
        setSubmitError("شما وارد نشده اید. لطفاً دوباره وارد شوید.");
        router.push('/login');
        return;
      }
      
      // 1. ذخیره پروفایل (firstName, lastName, skills, objective)
      await profile.save({
        first_name: data.firstName,
        last_name: data.lastName,
        skills: data.skills,
        objective: data.objective,
      });
      
      // 2. ذخیره موقعیت مکانی (اگر انتخاب شده باشد)
      if (data.location && data.location.lat && data.location.lng) {
        await locations.save({
          latitude: data.location.lat,
          longitude: data.location.lng,
          address: data.location.address || "",
        });
      }
      
      setSubmitSuccess(true);
      console.log("فرم با موفقیت ارسال شد:", data);
      
      // بعد از 2 ثانیه به صفحه نقشه یا صفحه اصلی بروید
      setTimeout(() => {
        router.push('/map');
      }, 2000);
      
    } catch (error) {
      console.error("خطا در ارسال فرم:", error);
      setSubmitError(error.response?.data?.detail || "خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = stepComponents[activeStep];

  // بررسی آیا کاربر توکن دارد
  const hasToken = !!localStorage.getItem('access_token');
  
  if (!hasToken) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          لطفاً ابتدا وارد شوید.
          <Button onClick={() => router.push('/login')} sx={{ ml: 2 }}>ورود</Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          background: "rgba(30, 41, 59, 0.6)",
          backdropFilter: "blur(20px)",
          borderRadius: 4,
          border: "1px solid rgba(148, 163, 184, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 4,
            pb: 2,
            background: "rgba(15, 23, 42, 0.8)",
            borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#f1f5f9",
              fontWeight: 700,
              mb: 3,
              textAlign: "center",
            }}
          >
            فرم درخواست همکاری
          </Typography>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepIcon-root": {
                color: "rgba(148, 163, 184, 0.2)",
                "&.Mui-active": {
                  color: "#38bdf8",
                },
                "&.Mui-completed": {
                  color: "#34d399",
                },
              },
              "& .MuiStepLabel-label": {
                color: "#94a3b8",
                mt: 0.5,
                "&.Mui-active": {
                  color: "#38bdf8",
                  fontWeight: 600,
                },
                "&.Mui-completed": {
                  color: "#34d399",
                },
              },
            }}
          >
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {step.icon}
                    </Typography>
                  }
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ p: 4 }}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Fade in={true} timeout={300} key={activeStep}>
                <Box sx={{ minHeight: 300 }}>
                  {activeStep === steps.length ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      {submitSuccess ? (
                        <>
                          <Check
                            sx={{
                              fontSize: 64,
                              color: "#34d399",
                              mb: 2,
                            }}
                          />
                          <Typography variant="h6" sx={{ color: "#f1f5f9", mb: 1 }}>
                            ✅ اطلاعات با موفقیت ذخیره شد!
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                            در حال انتقال به صفحه نقشه...
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Check
                            sx={{
                              fontSize: 64,
                              color: "#38bdf8",
                              mb: 2,
                            }}
                          />
                          <Typography variant="h6" sx={{ color: "#f1f5f9", mb: 1 }}>
                            آماده ارسال هستید؟
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>
                            لطفاً اطلاعات وارد شده را بررسی و تأیید کنید
                          </Typography>
                          
                          {submitError && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                              {submitError}
                            </Alert>
                          )}
                          
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            endIcon={<Send />}
                            sx={{
                              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                              color: "white",
                              px: 4,
                              py: 1.5,
                              borderRadius: 3,
                              fontSize: "1rem",
                              fontWeight: 600,
                              "&:hover": {
                                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                              },
                              "&:disabled": {
                                background: "rgba(148, 163, 184, 0.2)",
                                color: "#64748b",
                              },
                            }}
                          >
                            {isSubmitting ? "در حال ارسال..." : "ارسال نهایی"}
                          </Button>
                        </>
                      )}
                    </Box>
                  ) : (
                    <CurrentStepComponent />
                  )}
                </Box>
              </Fade>

              {activeStep < steps.length && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
                  }}
                >
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    startIcon={<ArrowBack />}
                    sx={{
                      color: "#94a3b8",
                      "&:hover": {
                        backgroundColor: "rgba(148, 163, 184, 0.05)",
                      },
                      "&:disabled": {
                        color: "rgba(148, 163, 184, 0.2)",
                      },
                    }}
                  >
                    قبلی
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isValid}
                    endIcon={<ArrowForward />}
                    sx={{
                      color: "#38bdf8",
                      "&:hover": {
                        backgroundColor: "rgba(56, 189, 248, 0.05)",
                      },
                      "&:disabled": {
                        color: "rgba(148, 163, 184, 0.2)",
                      },
                    }}
                  >
                    بعدی
                  </Button>
                </Box>
              )}
            </form>
          </FormProvider>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            borderTop: "1px solid rgba(148, 163, 184, 0.05)",
          }}
        >
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {activeStep < steps.length
              ? `قدم ${activeStep + 1} از ${steps.length}`
              : "مرحله نهایی"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}