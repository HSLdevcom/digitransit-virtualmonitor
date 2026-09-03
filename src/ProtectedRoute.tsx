import { FC, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './contexts';

const ProtectedRoute: FC = () => {
  const user = useContext(UserContext);

  return user?.sub ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
