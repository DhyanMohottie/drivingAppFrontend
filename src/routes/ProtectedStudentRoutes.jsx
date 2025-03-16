import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedStudentRoutes() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? <Outlet /> : <Navigate to='/user/sign-in' />;
}
