import { LayoutDashboardIcon, CalendarIcon, PillIcon, SettingsIcon, HelpCircleIcon, LogOutIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";

const Sidebar = () => {

    
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
    return (
        <div className="w-56 h-screen max-h-screen fixed bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center mr-2">
                        <PillIcon size={20} color="white" />
                    </div>
                    <span className="text-xl font-bold text-blue-500">MediRemind</span>
                </div>
            </div>
            <nav className="flex-1 pt-4">
                <ul>
                    {navItems.map(item => (
                        <NavLink to={item.href} key={item.id}>
           
                            {({ isActive }) => (
                                <button
                                    className={`flex items-center w-full px-4 py-3 text-left cursor-pointer ${isActive
                                            ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-500'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            )}
                        </NavLink>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-200">
                <button onClick={() => signOut(auth)} className="flex items-center text-gray-600 px-4 py-2 w-full hover:bg-gray-50 rounded">
                    <LogOutIcon size={20} className="mr-3" />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;