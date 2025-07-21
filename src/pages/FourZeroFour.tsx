import { useEffect, useState } from 'react'
import {
    HomeIcon,
    PillIcon,
    HeartPulseIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const FourZeroFour = () => {
    const [pillPosition, setPillPosition] = useState({
        x: 0,
        y: 0,
    })
    const [heartBeat, setHeartBeat] = useState(false)

    const [currentJoke, setCurrentJoke] = useState(0)

    // Floating pill animation
    useEffect(() => {
        const floatInterval = setInterval(() => {
            setPillPosition({
                x: Math.sin(Date.now() / 1000) * 10,
                y: Math.cos(Date.now() / 1000) * 10,
            })
        }, 50)
        return () => clearInterval(floatInterval)
    }, [])

    // Heartbeat animation
    useEffect(() => {
        const heartbeatInterval = setInterval(() => {
            setHeartBeat(true)
            setTimeout(() => setHeartBeat(false), 500)
        }, 2000)
        return () => clearInterval(heartbeatInterval)
    }, [])

    // Rotate through jokes
    useEffect(() => {
        const jokeInterval = setInterval(() => {
            setCurrentJoke((prev) => (prev + 1) % medicalJokes.length)
        }, 8000)
        return () => clearInterval(jokeInterval)
    }, [])

    const medicalJokes = [
        "Looks like this page is experiencing cardiac arrest... it's flatlined!",
        "We prescribed this URL some medicine, but it still hasn't recovered.",
        'This page seems to have skipped its check-up appointment.',
        "The page you're looking for has been quarantined.",
        'Error 404: Page needs a defibrillator STAT!',
    ]

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center bg-white">
            <div className="relative mb-8 h-40 w-40">
                {/* Floating animated pill */}
                <div
                    className="absolute"
                    style={{
                        transform: `translate(${pillPosition.x}px, ${pillPosition.y}px)`,
                        transition: 'transform 0.2s ease-out',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-40px',
                        marginTop: '-40px',
                    }}
                >
                    <div className="bg-blue-100 rounded-full p-6 shadow-lg">
                        <PillIcon size={60} className="text-blue-600 transform rotate-45" />
                    </div>
                </div>
                {/* Pulsing heart */}
                <div
                    className="absolute -bottom-6 -right-6"
                    style={{
                        transform: heartBeat ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.2s ease-out',
                    }}
                >
                    <div className="bg-red-100 rounded-full p-3 shadow-md">
                        <HeartPulseIcon size={30} className="text-red-500" />
                    </div>
                </div>
            </div>
            <div className="relative">
                <h1 className="text-7xl font-bold text-blue-600 mb-2">404</h1>
                <div className="absolute -top-2 -right-2 bg-red-100 text-red-600 text-xs rounded-full px-2 py-1 animate-pulse">
                    STAT!
                </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Page Not Found</h2>
            <div className="bg-blue-50 p-6 rounded-lg max-w-md mb-8 relative">
                <div className="absolute -top-3 -left-3 bg-white rounded-full p-1 shadow-md">
                    <HeartPulseIcon
                        size={24}
                        className={`${heartBeat ? 'text-red-500' : 'text-gray-400'}`}
                    />
                </div>
                <p className="text-lg text-gray-700 italic">
                    {medicalJokes[currentJoke]}
                </p>
                <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-300 ease-linear"
                        style={{
                            width: `${((currentJoke + 1) / medicalJokes.length) * 100}%`,
                        }}
                    ></div>
                </div>
            </div>
            <p className="text-gray-600 mb-8 max-w-lg">
                The page you're looking for seems to have missed its appointment. Our
                digital doctors are working on the issue, but in the meantime, you can
                return to a healthier part of our app.
            </p>
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
    )
}


export default FourZeroFour;