import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { paths } from "./paths";
import { ProtectedRoutes } from "./ProtectRoutes";
import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";
import Dashboard from "../pages/Dashboard/Dashboard";


export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={paths.home} element={<Navigate to={paths.login} replace />} />
                <Route path={paths.login} element={<Login />} />
                <Route path={paths.register} element={<Registro />} />
                <Route path={paths.dashboard} element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
            </Routes>
        </BrowserRouter>
    )
}   
