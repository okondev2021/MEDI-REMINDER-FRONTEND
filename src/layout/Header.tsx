import React, { SetStateAction } from 'react';
import { BellIcon, MenuIcon } from 'lucide-react';
import { useAuthContext } from '../context/AuthContextProvider';
import { USER_ROLES } from '@/lib/types';


const Header = ({ onNotificationClick, setShowSideNav, showSideNav }: { onNotificationClick: () => void; setShowSideNav: React.Dispatch<SetStateAction<boolean>>; showSideNav: boolean }) => {

    const { currentUser, userProfileInfo } = useAuthContext();

    const extractInitials = (userDisplay: string) => {
        const displaNameList = userDisplay.split(" ")
        return displaNameList[0][0].toUpperCase() + displaNameList[1][0].toUpperCase()
    }

    const displayName = currentUser?.name


    return (
        <header className="fixed w-full z-[50] h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:w-[80%]">
            <div className="flex items-center text-nowrap">
                <button onClick={() => setShowSideNav(!showSideNav)} className="mr-4 md:hidden">
                    <MenuIcon size={24} />
                </button>
                <h1 className="text-base font-semibold text-nowrap md:text-xl">Dashboard</h1>
            </div>
            <div className="flex items-center text-nowrap">
                {/* {userProfileInfo?.userType === USER_ROLES.PATIENT && (
                    <button onClick={onNotificationClick} className="relative mr-4 cursor-pointer">
                        <BellIcon size={20} className="text-gray-600" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            3
                        </span>
                    </button>
                )} */}
                <div className="flex items-center cursor-pointer text-nowrap">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                        <span className="font-medium text-sm">{extractInitials(displayName || "Unknown User")}</span>
                    </div>
                    <span className="hidden font-medium text-nowrap md:block">{displayName}</span>
                </div>
            </div>
        </header>
    );
}

export default Header;