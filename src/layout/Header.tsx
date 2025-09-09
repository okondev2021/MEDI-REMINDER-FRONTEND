import React, { SetStateAction } from 'react';
import { MenuIcon } from 'lucide-react';
import { useAuthContext } from '../context/AuthContextProvider';


const Header = (
    {
        setShowSideNav,
        showSideNav
    }
        :
    {
        setShowSideNav: React.Dispatch<SetStateAction<boolean>>; 
        showSideNav: boolean
    }
) => {

    const { currentUser } = useAuthContext();

    const extractInitials = (userDisplay: string) => {
        const displaNameList = userDisplay.split(" ")
        return displaNameList[0][0].toUpperCase() + displaNameList[1][0].toUpperCase()
    }

    const displayName = currentUser?.name


    return (
        // Header.tsx
        <header
            className="fixed w-full z-[50] h-16 md:h-20 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 md:w-[80%]"
        >
            <div className="flex items-center gap-3">
                <button onClick={() => setShowSideNav(!showSideNav)} className="p-2 rounded-md hover:bg-gray-100 md:hidden">
                    <MenuIcon size={22} />
                </button>
                <h1 className="text-lg md:text-2xl font-semibold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2">
                        <span>{extractInitials(displayName || "Unknown User")}</span>
                    </div>
                    <span className="hidden font-medium text-gray-700 md:block">{displayName}</span>
                </div>
            </div>
        </header>

    );
}

export default Header;