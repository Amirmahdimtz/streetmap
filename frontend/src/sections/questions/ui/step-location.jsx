import { useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { LocationPicker } from "../../../sections/map/ui/location-picker";

export default function StepLocation() {
  const { setValue, watch } = useFormContext();
  const currentLocation = watch("location");

  const handleLocationSelect = (locationData) => {
    setValue("location", {
      lat: locationData.latitude,
      lng: locationData.longitude,
      address: locationData.address,
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "#f1f5f9" }}>
          موقعیت مکانی خود را انتخاب کنید
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
          روی نقشه کلیک کنید
        </Typography>
      </Box>

      <Box sx={{ height: 400 }}>
        <LocationPicker 
          onLocationSelect={handleLocationSelect}
          initialLocation={currentLocation?.lat ? currentLocation : null}
        />
      </Box>
    </Box>
  );
}