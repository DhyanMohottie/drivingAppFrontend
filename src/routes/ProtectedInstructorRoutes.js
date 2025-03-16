import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedInstructorRoutes = ({ children }) => {
  const { isLoading, isInstructor, user } = useSelector((state) => state.auth);

  if (isLoading === false) {
    if (!user) {
      return <Navigate to="/login" replace />;
    } else if(!isInstructor){
      return <Navigate to="/" replace />;
    } else if(isInstructor){
      return children;
    }
    
  }
};

export default ProtectedInstructorRoutes;
