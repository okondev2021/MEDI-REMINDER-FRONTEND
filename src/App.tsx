import { Routes, Route } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextProvider";
import AuthWrapper from "./Wrapper/AuthWrapper";
import MainLayout from "./layout/MainLayout";
import { Dashboard, HelpPage, Medications, Notifications, Schedule, Settings, FourZeroFour, Login, SignUp, History, Notification, CaregiverInvite, NotAuthorized } from "./pages";
import { ToastContainer } from "react-toastify";
import { ScrollToTop } from "./components/ScrollToTop";
import { messaging } from "./lib/firebase";
import { onMessage } from "firebase/messaging";
import { USER_ROLES } from "./lib/types";
import ProtectedRoute from "./Wrapper/ProtectedRoute";
import AlarmModal from "./components/Alarm";
import { useState } from "react";


const App = () => {

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