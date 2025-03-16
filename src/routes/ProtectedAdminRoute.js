import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { isLoading, isAdmin, user } = useSelector((state) => state.auth);

  if (isLoading === false) {
    if (!user) {
      return <Navigate to="/login" replace />;
    } else if(!isAdmin){
      return <Navigate to="/" replace />;
    } else if(isAdmin){
      return children;
    }
    
  }
};

export default ProtectedAdminRoute;
