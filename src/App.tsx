import {useEffect} from "react"
import { Routes, Route } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextProvider";
import AuthWrapper from "./Wrapper/AuthWrapper";
import MainLayout from "./layout/MainLayout";
import { Dashboard, HelpPage, Medications, Notifications, Schedule, Settings, FourZeroFour, Login, SignUp, History, Notification, CaregiverInvite, NotAuthorized, CaregiverSignInRedirect } from "./pages";
import { ToastContainer } from "react-toastify";
import { ScrollToTop } from "./components/ScrollToTop";
import { messaging } from "./lib/firebase";
import { onMessage } from "firebase/messaging";
import { USER_ROLES } from "./lib/types";
import ProtectedRoute from "./Wrapper/ProtectedRoute";
import AlarmModal from "./components/Alarm";
import { useState } from "react";
import { getSwRegistration } from "./lib/swRegistration";



const App = () => {

  window.addEventListener('load', () => {
    getSwRegistration();
  });
  

  const [displayAlarm, setDisplayAlarm] = useState(false);


  const [alarmInfo, setAlarmInfo] = useState({
    doseId: "",
    medicationInstruction: "",
    medicationId: "",
    medicationName: ""
  })


  onMessage(messaging, (payload) => {

    if (!displayAlarm) {

      setDisplayAlarm(true);

      setAlarmInfo({
        doseId: payload?.data?.doseId || "",
        medicationInstruction: payload?.data?.medicationInstructions || "",
        medicationId: payload?.data?.medId || "",
        medicationName: payload?.data?.medicationName || ""
      })
    }
  
  });
  

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      console.log("Service Worker is supported");
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log(event)
        if (event.data && event.data.type === "NAVIGATE_TO_ALARM") {
          const { targetUrl } = event.data;
          window.location.href = targetUrl;
        }
      });
    }
  }, []);


  useEffect(() => {
    // Check if the URL has query parameters for alarm
    const searchParams = new URLSearchParams(window.location.search);
    const shouldShowAlarm = searchParams.get("alarm") === "true";

    if (shouldShowAlarm && !displayAlarm) {

      const medId = decodeURIComponent(searchParams.get("medId") || "");
      const doseId = decodeURIComponent(searchParams.get("doseId") || "");
      const medicationName = decodeURIComponent(searchParams.get("medicationName") || "");
      const medicationInstructions = decodeURIComponent(searchParams.get("medicationInstructions") || "");

      setAlarmInfo({
        doseId,
        medicationInstruction: medicationInstructions,
        medicationId: medId,
        medicationName
      });

      setDisplayAlarm(true);

    }

  }, []);


  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={
          <AuthContextProvider>
            <AuthWrapper>
              {displayAlarm && (
                <AlarmModal docId={alarmInfo.doseId} medicationName={alarmInfo.medicationName} medicationId={alarmInfo.medicationId} setDisplayAlarm={setDisplayAlarm} instruction={alarmInfo.medicationInstruction} />
              )}
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
        <Route path="/caregiver-signin-redirect" element={<CaregiverSignInRedirect />} />
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

