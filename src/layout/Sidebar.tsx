import React, {useRef} from 'react';
import { LayoutDashboardIcon, CalendarIcon, PillIcon, SettingsIcon, HelpCircleIcon, LogOutIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useCloseMenuWhenClickedOutside } from '@/hooks/useCloseMenuWhenClickedOutside ';

const Sidebar = ({ showSideNav, setShowSideNav }: { showSideNav: boolean;  setShowSideNav: React.Dispatch<React.SetStateAction<boolean>>;}) => {

    
    const auth = getAuth();

    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboardIcon size={20} />,
            href: "/"
        }, {
            id: 'schedule',
            label: 'Schedule',
            icon: <CalendarIcon size={20} />,
            href: "/schedule"
        }, {
            id: 'medications',
            label: 'Medications',
            icon: <PillIcon size={20} />,
            href: "/medications"
        }, {
            id: 'settings',
            label: 'Settings',
            icon: <SettingsIcon size={20} />,
            href: "/settings"
        }, {
            id: 'help',
            label: 'Help',
            icon: <HelpCircleIcon size={20} />,
            href: "/help"
        }
    ];

    const sideNavRef = useRef<HTMLDivElement | null>(null);

    useCloseMenuWhenClickedOutside({
        showMenu: showSideNav,
        showMenuRef: sideNavRef,
        setShowMenu: setShowSideNav,
    });

    // useCloseMenuWhenClickedOutside
    return (
        <div ref={sideNavRef} className={` overflow-x-hidden h-screen overflow-hidden fixed z-[100] bg-white  border-r border-gray-200 flex flex-col md:w-[20%] text-nowrap ${showSideNav ? " w-[70%]" : "w-0"}`}>
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
                    {navItems.map(item => (
                        <NavLink onClick={ () => setShowSideNav(false)} to={item.href} key={item.id}>
           
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
                    ))}
                </ul> 
            </nav>
            <div className="relative flex-1 overflow-hidden">
                <button onClick={() => signOut(auth)} className={`border-t overflow-hidden border-gray-200 text-nowrap fixed bottom-0 cursor-pointer md:w-[20%] flex items-center text-gray-600 hover:bg-gray-50 ${showSideNav ? "w-[70%] p-4" : "w-0 p-0"}`}>
                    <LogOutIcon size={20} className="mr-3" />
                    <p>Log out</p>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;