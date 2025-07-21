import { Routes, Route } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextProvider";
import AuthWrapper from "./Wrapper/AuthWrapper";
import MainLayout from "./layout/MainLayout";
import { Dashboard, HelpPage, Medications, Notifications, Schedule, Settings, FourZeroFour, Login, SignUp, History, Notification, CaregiverInvite, NotAuthorized } from "./pages";
import { ToastContainer, toast } from "react-toastify";
import { ScrollToTop } from "./components/ScrollToTop";
import { messaging } from "./lib/firebase";
import { onMessage } from "firebase/messaging";
import { USER_ROLES } from "./lib/types";
import ProtectedRoute from "./Wrapper/ProtectedRoute";

function App() {

  onMessage(messaging, (payload) => {

    console.log("📥 Foreground FCM:", payload);

    // ✅ Show toast
    if (payload.notification?.title || payload.notification?.body) {
      toast(payload.notification.title ?? payload.notification.body ?? "New notification");
    }

    // ✅ Play alarm sound (looping)
    try {
      const audio = new Audio("https://res.cloudinary.com/dcpbyncni/video/upload/v1752652597/alarm_w8z7u2.mp3");
      audio.loop = true;
      audio.play().catch((e) => {
        console.warn("🔇 Audio playback was blocked by the browser:", e);
      });
    }
    catch (e) {
      console.error("❌ Failed to play alarm sound:", e);
    }

    // ✅ Trigger vibration
    if ("vibrate" in navigator) {
      navigator.vibrate([300, 100, 400]);
    }

  });



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
          {/* Shared Dashboard Route - content is based on userType */}
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* Patient-only Routes - caregivers get blocked */}
          <Route
            path="/help"
            element={
              <ProtectedRoute requiredRole={USER_ROLES.PATIENT}>
                <HelpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medications"
            element={
              <ProtectedRoute requiredRole={USER_ROLES.PATIENT}>
                <Medications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute requiredRole={USER_ROLES.PATIENT}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute requiredRole={USER_ROLES.PATIENT}>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute requiredRole={USER_ROLES.PATIENT}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute requiredRole={USER_ROLES.PATIENT}>
                <Notification />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* AUTH ROUTE */}
        <Route path="/caregiver-invite" element={<CaregiverInvite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* 404 */}
        <Route path="*" element={<FourZeroFour />} />
        {/* RESTRICTED PAGE */}
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
