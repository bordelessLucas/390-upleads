import { Navigate } from "react-router-dom";
import { paths } from "./paths";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface ProtectRoutesProps {
    children: ReactNode;
}

export const ProtectedRoutes = ({children} : ProtectRoutesProps) => {
    const { currentUser, loading } = useAuth();

    if(loading) return <div>Loading...</div>;

    if(!currentUser){
        return <Navigate to={paths.login} replace />;
    }

    return <>{children}</>;
}