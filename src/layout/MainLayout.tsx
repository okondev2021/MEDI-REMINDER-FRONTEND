import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import NotificationsModal from "./NotificationsModal";

const MainLayout = () => {

    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="flex w-full min-h-screen bg-gray-50">
            <Sidebar />
            <div className="ml-[20%] flex flex-col flex-1">
                <div className="relative">
                    <Header onNotificationClick={() => setShowNotifications(!showNotifications)} />
                    {showNotifications && (
                        <div className="absolute right-4 top-16">
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