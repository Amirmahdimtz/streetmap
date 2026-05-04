// pages/MapPage.jsx
import { useState } from "react";
import { Box, Container, Typography, Alert } from "@mui/material";

import { LocationPicker } from "../ui/location-picker";

export default function MapView() {
  const [locationData, setLocationData] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleLocationSelect = async (data) => {
    setLocationData(data);
    setSuccess(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0f172a",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ color: "#f1f5f9", fontWeight: 700, mb: 1 }}
          >
            انتخاب موقعیت روی نقشه
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            روی نقشه کلیک کنید یا آدرس مورد نظر را جستجو کنید
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            موقعیت با موفقیت ثبت شد!
          </Alert>
        )}

        <Box
          sx={{
            height: "70vh",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid rgba(148, 163, 184, 0.1)",
          }}
        >
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </Box>

        {locationData && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              اطلاعات ثبت شده:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#e2e8f0", fontFamily: "monospace" }}
            >
              {JSON.stringify(locationData, null, 2)}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
