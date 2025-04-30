import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { Dashboard, HelpPage, Medications, Notifications, Schedule, Settings, FourZeroFour } from "./pages";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/settings" element={<Settings />} /> 
        </Route>
        <Route path="*" element={<FourZeroFour />} />
      </Routes>
    </>
  )
}

export default App
