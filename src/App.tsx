import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { Dashboard, HelpPage, Medications, Notifications, Schedule, Settings, FourZeroFour, Login, SignUp } from "./pages";
import AuthWrapper from "./Wrapper/AuthWrapper";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={
          <AuthWrapper>
            <MainLayout />
          </AuthWrapper>
        }>
          <Route index element={<Dashboard />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/settings" element={<Settings />} /> 
        </Route>
        {/* AUTH ROUTE */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* 404 */}
        <Route path="*" element={<FourZeroFour />} />
      </Routes>
    </>
  )
}

export default App
