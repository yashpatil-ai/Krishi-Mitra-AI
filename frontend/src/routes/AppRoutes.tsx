import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import ProtectedRoute from "@/routes/ProtectedRoute"
import PublicRoute from "@/routes/PublicRoute"

import AIAssistant from "@/pages/AIAssistant"
import CropCalendar from "@/pages/CropCalendar"
import CropRecommendation from "@/pages/CropRecommendation"
import Dashboard from "@/pages/Dashboard"
import DiseaseDetection from "@/pages/DiseaseDetection"
import Fertilizer from "@/pages/Fertilizer"
import Irrigation from "@/pages/Irrigation"
import Market from "@/pages/Market"
import MyFarm from "@/pages/MyFarm"
import Notifications from "@/pages/Notifications"
import Profile from "@/pages/Profile"
import Schemes from "@/pages/Schemes"
import Settings from "@/pages/Settings"
import Weather from "@/pages/Weather"

import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected application routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/farm" element={<MyFarm />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/crops" element={<CropRecommendation />} />
            <Route path="/disease" element={<DiseaseDetection />} />
            <Route path="/fertilizer" element={<Fertilizer />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/market" element={<Market />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/calendar" element={<CropCalendar />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes