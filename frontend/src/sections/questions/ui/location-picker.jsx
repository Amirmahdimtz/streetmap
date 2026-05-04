// components/map/LocationPicker.jsx
import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Popup,
} from "react-leaflet";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import { FiMapPin, FiCrosshair, FiSend } from "react-icons/fi";
import L from "leaflet";
import { locations } from "../../../services/api";
import { useRouter } from "../../../routes/hooks/use-router";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// آیکون سفارشی برای لوکیشن انتخاب شده
const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// کامپوننت برای کلیک روی نقشه
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// کامپوننت برای گرفتن لوکیشن فعلی کاربر
function LocateButton({ onLocationFound }) {
  const map = useMap();

  const handleLocate = () => {
    map.locate();
  };

  useMapEvents({
    locationfound: (e) => {
      onLocationFound(e.latlng);
      map.flyTo(e.latlng, 15);
    },
  });

  return (
    <IconButton
      onClick={handleLocate}
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        backgroundColor: "white",
        boxShadow: 2,
        "&:hover": { backgroundColor: "#f0f0f0" },
      }}
    >
      <FiCrosshair />
    </IconButton>
  );
}

export function LocationPicker({ onLocationSelect, initialLocation }) {
  const [selectedPosition, setSelectedPosition] = useState(
    initialLocation || null,
  );
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const mapRef = useRef();
  const router = useRouter();

  // دریافت آدرس از مختصات
  const getAddressFromCoords = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      const fullAddress = data.display_name || `${lat}, ${lng}`;
      setAddress(fullAddress);
      return fullAddress;
    } catch (error) {
      console.error("خطا در دریافت آدرس:", error);
      setAddress("");
      return "";
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (latlng) => {
    setSelectedPosition(latlng);
    setSaveSuccess(false);
    setSaveError("");
    const fullAddress = await getAddressFromCoords(latlng.lat, latlng.lng);
    
    // به parent ارسال می‌کنیم (برای نمایش در مرور)
    if (onLocationSelect) {
      onLocationSelect({
        latitude: latlng.lat,
        longitude: latlng.lng,
        address: fullAddress,
      });
    }
  };

  const handleLocateUser = async (latlng) => {
    setSelectedPosition(latlng);
    setSaveSuccess(false);
    setSaveError("");
    const fullAddress = await getAddressFromCoords(latlng.lat, latlng.lng);
    
    if (onLocationSelect) {
      onLocationSelect({
        latitude: latlng.lat,
        longitude: latlng.lng,
        address: fullAddress,
      });
    }
  };

  // ذخیره موقعیت در بک‌اند
  const handleSendLocation = async () => {
    if (!selectedPosition) {
      alert("لطفاً ابتدا روی نقشه کلیک کنید");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setSaveError("شما وارد نشده اید. لطفاً دوباره وارد شوید.");
        router.push('/login');
        return;
      }

      await locations.save({
        latitude: selectedPosition.lat,
        longitude: selectedPosition.lng,
        address: address,
      });

      setSaveSuccess(true);
      
      // اطلاع به parent
      if (onLocationSelect) {
        onLocationSelect({
          latitude: selectedPosition.lat,
          longitude: selectedPosition.lng,
          address: address,
          saved: true,
        });
      }
      
      // بعد از 2 ثانیه به صفحه سوالات برمی‌گردد
      setTimeout(() => {
        router.push('/questions');
      }, 2000);
      
    } catch (error) {
      console.error("خطا در ذخیره موقعیت:", error);
      setSaveError(error.response?.data?.detail || "خطا در ذخیره موقعیت");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <MapContainer
        center={[35.6892, 51.389]}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: 12 }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onMapClick={handleMapClick} />
        <LocateButton onLocationFound={handleLocateUser} />

        {selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            icon={selectedIcon}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  موقعیت انتخاب شده
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  عرض: {selectedPosition.lat.toFixed(6)}
                  <br />
                  طول: {selectedPosition.lng.toFixed(6)}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* پنل اطلاعات */}
      {selectedPosition && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
            p: 2,
            borderRadius: 3,
            backgroundColor: "white",
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FiMapPin style={{ color: "#ef4444" }} />
            <Typography variant="subtitle2" fontWeight={600}>
              موقعیت انتخاب شده
            </Typography>
            {loading && <CircularProgress size={16} />}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              maxHeight: 60,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {address || "در حال دریافت آدرس..."}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Chip
              label={`lat: ${selectedPosition.lat.toFixed(4)}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`lng: ${selectedPosition.lng.toFixed(4)}`}
              size="small"
              variant="outlined"
            />
          </Box>

          {saveError && (
            <Typography variant="caption" color="error" sx={{ mb: 1, display: "block" }}>
              {saveError}
            </Typography>
          )}

          {saveSuccess && (
            <Typography variant="caption" color="success.main" sx={{ mb: 1, display: "block" }}>
              ✅ موقعیت با موفقیت ذخیره شد! در حال انتقال...
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <FiSend />}
            onClick={handleSendLocation}
            disabled={saving || saveSuccess}
            sx={{ borderRadius: 2 }}
          >
            {saving ? "در حال ذخیره..." : "ذخیره موقعیت"}
          </Button>
        </Paper>
      )}
    </Box>
  );
}