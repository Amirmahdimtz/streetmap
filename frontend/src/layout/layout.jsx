// src/components/layout/TabLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Tabs, Tab, Paper, Container } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import QuizIcon from "@mui/icons-material/Quiz";

export default function TabLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // تشخیص تب فعال بر اساس مسیر فعلی
  const getCurrentTab = () => {
    if (location.pathname.includes("/questions")) return 1;
    if (location.pathname.includes("/map")) return 0;
    return 0;
  };

  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/map");
    } else if (newValue === 1) {
      navigate("/questions");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* تب‌ها در بالای محتوا */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={getCurrentTab()}
            onChange={handleChange}
            centered
            variant="fullWidth"
          >
            <Tab icon={<MapIcon />} iconPosition="start" label="نقشه" />
            <Tab icon={<QuizIcon />} iconPosition="start" label="سوالات" />
          </Tabs>
        </Box>

        {/* محتوای هر تب */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Paper>
    </Container>
  );
}
