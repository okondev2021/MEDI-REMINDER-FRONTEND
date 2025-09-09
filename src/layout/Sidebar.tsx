import React, {useRef} from 'react';
import { LayoutDashboardIcon, CalendarIcon, PillIcon, SettingsIcon, HelpCircleIcon, LogOutIcon, HistoryIcon, Cross, CheckCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useCloseMenuWhenClickedOutside } from '@/hooks/useCloseMenuWhenClickedOutside ';
import { useAuthContext } from '@/context/AuthContextProvider';

const Sidebar = ({ showSideNav, setShowSideNav, setCaregiver }: { showSideNav: boolean; setShowSideNav: React.Dispatch<React.SetStateAction<boolean>>; setCaregiver: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const auth = getAuth();

    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboardIcon size={20} />,
            href: "/",
        },
        {
            id: 'schedule',
            label: 'Schedule',
            icon: <CalendarIcon size={20} />,
            href: "/schedule",
            only_patient: true
        },
        {
            id: 'medications',
            label: 'Medications',
            icon: <PillIcon size={20} />,
            href: "/medications",
            only_patient: true
        },
        {
            id: 'history',
            label: 'History',
            icon: <HistoryIcon size={20} />,
            href: "/history",
            only_patient: true
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <SettingsIcon size={20} />,
            href: "/settings",
        },
        {
            id: "care-giver",
            label: 'Care Giver',
            icon: <Cross size={20} />,
            only_patient: true
        },
        {
            id: 'help',
            label: 'Help',
            icon: <HelpCircleIcon size={20} />,
            href: "/help",
            only_patient: true
        }
    ];

    const { userProfileInfo } = useAuthContext()

    const filteredNavItems = navItems.filter(item => {
        if (item.only_patient && userProfileInfo?.userType !== 'patient') {
            return false
        }
        return true
    })

    const sideNavRef = useRef<HTMLDivElement | null>(null);

    useCloseMenuWhenClickedOutside({
        showMenu: showSideNav,
        showMenuRef: sideNavRef,
        setShowMenu: setShowSideNav,
    });

    return (
        // Sidebar.tsx
        <div
            ref={sideNavRef}
            className={`
                fixed z-[80] overflow-hidden h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out md:w-[20%] ${showSideNav ? "w-[70%]" : "w-0"
                }`}
        >
            <div className=" h-16 md:h-20 flex items-center justify-center border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                        <PillIcon size={20} color="white" />
                    </div>
                    <span className="text-xl font-bold text-blue-600">MediRemind</span>
                </div>
            </div>
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1">
                    {filteredNavItems.map(item =>
                        item.href ? (
                            <NavLink onClick={() => setShowSideNav(false)} to={item.href} key={item.id}>
                                {({ isActive }) => (
                                    <button
                                        className={`flex cursor-pointer items-center w-full px-5 py-3 text-sm font-medium rounded-l-md transition-colors ${isActive
                                                ? "text-blue-600 bg-blue-50 border-l-4 border-blue-500"
                                                : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                )}
                            </NavLink>
                        ) : (
                            <button
                                key={item.id}
                                onClick={() => setCaregiver(true)}
                                    className="flex cursor-pointer items-center w-full px-5 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
                            >
                                <span className="mr-3">{item.icon}</span>
                                <span className="flex items-center gap-2">
                                    {item.label}
                                    {userProfileInfo?.caregivers && <CheckCircle className="h-5 w-5 text-green-600" />}
                                </span>
                            </button>
                        )
                    )}
                </ul>
            </nav>
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={() => signOut(auth)}
                    className="flex items-center cursor-pointer gap-3 w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-2 rounded-md"
                >
                    <LogOutIcon size={20} />
                    <span>Log out</span>
                </button>
            </div>
        </div>

    );
}

export default Sidebar;