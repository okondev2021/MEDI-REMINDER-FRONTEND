import { useEffect, useState } from 'react'
import {
    LockIcon,
    HomeIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'


const NotAuthorized = () => {
    const [bounce, setBounce] = useState(false)

    // Animation for the lock icon
    useEffect(() => {
        const bounceInterval = setInterval(() => {
            setBounce(true)
            setTimeout(() => setBounce(false), 600)
        }, 3000)
        return () => clearInterval(bounceInterval)
    }, [])
    
    const [currentTip, setCurrentTip] = useState<string>('')

    const funnyTips = [
        "Have you tried saying 'please' to your screen? Sometimes computers just need good manners.",
        'Maybe try wearing a lab coat? The system might recognize you as a doctor then.',
        "Did you remember to take your 'access permission' pill this morning?",
        "Our security system is like a strict nurse - it won't let you in without proper ID.",
        'Looks like your digital prescription for this page has expired!',
    ]

    useEffect(() => {
            setCurrentTip(getRandomTip())

        // After 5 seconds, start changing tips every 5s
        
            const tipInterval = setInterval(() => {
                setCurrentTip(getRandomTip())
            }, 5000)

        // Clean up interval on unmount
        
            return () => clearInterval(tipInterval)
    }, [])

    function getRandomTip() {
        return funnyTips[Math.floor(Math.random() * funnyTips.length)]
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
            <div className="relative mb-8">
                <div
                    className={`text-blue-600 bg-blue-100 rounded-full p-8 relative z-10 ${bounce ? 'animate-bounce' : ''}`}
                >
                    <LockIcon size={80} />
                </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                <span className="text-blue-600">Oops!</span> Not Authorized
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Looks like you're trying to access a restricted area. Your account
                doesn't come with VIP access to this page!
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 max-w-md text-left rounded-r-lg animate-fadeIn">
                <p className="text-blue-800 font-medium mb-1">Helpful Tip:</p>
                <p className="text-gray-700">{currentTip}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                    to={"/"}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-transform transform hover:scale-105"
                >
                    <HomeIcon size={18} />
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}


export default NotAuthorized;