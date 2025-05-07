import { BellIcon, MenuIcon } from 'lucide-react';

const Header = ({ onNotificationClick }: { onNotificationClick: () => void }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center">
                <button className="mr-4 md:hidden">
                    <MenuIcon size={24} />
                </button>
                <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
                <button onClick={onNotificationClick} className="relative mr-4 cursor-pointer">
                    <BellIcon size={20} className="text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        3
                    </span>
                </button>
                <div className="flex items-center cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                        <span className="font-medium text-sm">SJ</span>
                    </div>
                    <span className="font-medium">Sarah Johnson</span>
                </div>
            </div>
        </header>
    );
}

export default Header;