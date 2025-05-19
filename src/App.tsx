import { Routes, Route } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextProvider";
import AuthWrapper from "./Wrapper/AuthWrapper";
import MainLayout from "./layout/MainLayout";
import { Dashboard, HelpPage, Medications, Notifications, Schedule, Settings, FourZeroFour, Login, SignUp } from "./pages";
import { ToastContainer } from "react-toastify";
import { ScrollToTop } from "./components/ScrollToTop";

function App() {

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <AuthContextProvider>
            <AuthWrapper>
              <MainLayout />
            </AuthWrapper>
          </AuthContextProvider>
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
      <ToastContainer />
    </>
  )
}

export default App
