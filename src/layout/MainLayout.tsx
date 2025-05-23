import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import NotificationsModal from "./NotificationsModal";

const MainLayout = () => {

    const [showNotifications, setShowNotifications] = useState(false);

    const [showSideNav, setShowSideNav] = useState(window.innerWidth > 640 ? true : false)

    return (
        <div className="flex w-full bg-gray-50 relative">
            <Sidebar setShowSideNav={setShowSideNav} showSideNav={showSideNav} />
            <div className="flex flex-col flex-1 md:ml-[20%]">
                {showSideNav && <div className='absolute z-[60] top-0 left-0 bg-black/50 w-full h-full min-h-screen md:hidden'></div>}
                <div className="relative">
                    <Header setShowSideNav={setShowSideNav} showSideNav={showSideNav} onNotificationClick={() => setShowNotifications(!showNotifications)} />
                    {showNotifications && (
                        <div className="absolute z-[100] right-0 w-[100%] mx-auto top-16 md:right-4">
                        
                            <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
                        </div>
                    )}
                </div>
                <main className="flex-1 p-6 mt-20">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;