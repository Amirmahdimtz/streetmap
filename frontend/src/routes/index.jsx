import { createBrowserRouter } from "react-router-dom";
// استفاده از مسیر نسبی به جای alias
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import { MapPage } from "../pages/map/map";
import { QuestionsPage } from "../pages/questions/question";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    index: true,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "map",
    element: <MapPage />,
  },
  {
    path: "questions",
    element: <QuestionsPage />,
  },
]);
