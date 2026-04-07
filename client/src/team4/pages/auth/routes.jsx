// Member 1 OWNS this file
import { Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const authRoutes = [
  <Route key="login" path="login" element={<Login />} />,
  <Route key="register" path="register" element={<Register />} />,
  <Route key="forgot-password" path="forgot-password" element={<ForgotPassword />} />,
  <Route key="reset-password" path="reset-password" element={<ResetPassword />} />,
];

export default authRoutes;
