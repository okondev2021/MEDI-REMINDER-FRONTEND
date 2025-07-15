import { Routes, Route } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextProvider";
import AuthWrapper from "./Wrapper/AuthWrapper";
import MainLayout from "./layout/MainLayout";
import { Dashboard, HelpPage, Medications, Notifications, Schedule, Settings, FourZeroFour, Login, SignUp, History, Notification } from "./pages";
import { ToastContainer, toast } from "react-toastify";
import { ScrollToTop } from "./components/ScrollToTop";
import { messaging } from "./lib/firebase";
import { onMessage } from "firebase/messaging";

function App() {

  onMessage(messaging, (payload) => {
    console.log("📥 Foreground FCM:", payload);

    // ✅ Show toast
    if (payload.notification?.title || payload.notification?.body) {
      toast(payload.notification.title ?? payload.notification.body ?? "New notification");
    }

    // ✅ Play alarm sound (looping)
    try {
      const audio = new Audio("/alarm.mp3");
      audio.loop = true;
      audio.play().catch((e) => {
        console.warn("🔇 Audio playback was blocked by the browser:", e);
      });
    } catch (e) {
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
          <Route index element={<Dashboard />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/settings" element={<Settings />} /> 
          <Route path="/history" element={<History />} />
          <Route path="/notification" element={<Notification />} />
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
