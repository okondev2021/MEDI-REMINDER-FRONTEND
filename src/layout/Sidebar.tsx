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
        <div ref={sideNavRef} className={` overflow-x-hidden h-screen overflow-hidden fixed z-[80] bg-white  border-r border-gray-200 flex flex-col md:w-[20%] text-nowrap ${showSideNav ? " w-[70%]" : "w-0"}`}>
            <div className="p-4 border-b border-gray-200 text-nowrap">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center mr-2">
                        <PillIcon size={20} color="white" />
                    </div>
                    <span className="text-xl font-bold text-blue-500 text-nowrap">MediRemind</span>
                </div>
            </div>
            <nav className="pt-4 text-nowrap">
                <ul>
                    {filteredNavItems.map(item => (
                        item.href ? (
                            <NavLink onClick={() => setShowSideNav(false)} to={item.href} key={item.id}>
                                {({ isActive }) => (
                                    <button
                                        className={`text-nowrap flex items-center w-full px-4 py-3 text-left cursor-pointer ${isActive
                                                ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-500'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="mr-3 text-nowrap">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                )}
                            </NavLink>
                        ) : (
                            <button
                                key={item.id}
                                className="text-nowrap flex items-center w-full px-4 py-3 text-left cursor-pointer text-gray-600 hover:bg-gray-50"
                                onClick={() => setCaregiver(true)}
                            >
                                <span className="mr-3 text-nowrap">{item.icon}</span>
                                <span className='inline-flex items-center gap-2'>
                                    {item.label}
                                    {userProfileInfo?.caregivers && (
                                        <CheckCircle className='h-6 w-6 text-green-600 ' />
                                    )}  
                                </span>
                            </button>
                        )
                    ))}
                </ul> 
            </nav>
            <div className="relative flex-1 overflow-hidden">
                <button onClick={() => signOut(auth)} className={`border-t overflow-hidden border-gray-200 text-nowrap fixed bottom-0 cursor-pointer md:w-[20%] flex items-center text-gray-600 hover:bg-gray-50 p-4 ${showSideNav ? "w-[70%]" : "w-0 px-0"}`}>
                    <LogOutIcon size={20} className="mr-3" />
                    <p>Log out</p>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;