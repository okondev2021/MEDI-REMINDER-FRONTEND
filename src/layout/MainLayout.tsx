import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import NotificationsModal from "./NotificationsModal";
import AddCareGiver from "@/components/AddCareGiver";

const MainLayout = () => {

    const [showNotifications, setShowNotifications] = useState(false);

    const [showSideNav, setShowSideNav] = useState(window.innerWidth > 640 ? true : false)

    const [caregiver, setCaregiver] = useState(false);

    return (
        // MainLayout.tsx
        <div className="flex w-full bg-gray-50 relative">
            <Sidebar setShowSideNav={setShowSideNav} showSideNav={showSideNav} setCaregiver={setCaregiver} />
            <div className="flex flex-col flex-1 md:ml-[20%] min-h-screen">
                {showSideNav && (
                    <div className="absolute z-[60] top-0 left-0 bg-black/60 backdrop-blur-sm w-full h-full min-h-screen md:hidden"></div>
                )}
                <div className="relative">
                    <Header
                        setShowSideNav={setShowSideNav}
                        showSideNav={showSideNav}
                    />
                    {showNotifications && (
                        <div className="absolute z-[100] right-0 w-full mx-auto top-20 px-2 md:right-6 md:w-[22rem]">
                            <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
                        </div>
                    )}
                </div>
                <main className="flex-1 p-6 md:p-8 mt-20">
                    {caregiver && <AddCareGiver onClose={() => setCaregiver(false)} />}
                    <Outlet />
                </main>
            </div>
        </div>

    );
}

export default MainLayout;