import React,{ SetStateAction, useEffect, useState } from 'react'
import { BellRing, Check, X } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContextProvider';
import { appDb } from '@/lib/firebase';
import { updateDoc, Timestamp, doc } from 'firebase/firestore';
import { toast } from "react-toastify";


interface AlarmModalProps {
    medicationName: string;
    docId: string;
    instruction?: string;
    setDisplayAlarm: React.Dispatch<SetStateAction<boolean>>;
    medicationId: string;
}


const AlarmModal = ({ medicationName, instruction, setDisplayAlarm, docId, medicationId }: AlarmModalProps) => {

    const {currentUser} = useAuthContext();
    
    const [isPlaying, setIsPlaying] = useState(true)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        // Create audio context and oscillator for alarm sound

        const createAlarmSound = () => {
            const AudioContext =
                window.AudioContext || (window as any).webkitAudioContext
            if (!AudioContext) return
            const audioContext = new AudioContext()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            oscillator.type = 'triangle'
            oscillator.frequency.setValueAtTime(780, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            oscillator.start()
            // Create pattern for alarm sound
            const createPattern = () => {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
                gainNode.gain.linearRampToValueAtTime(
                    0.3,
                    audioContext.currentTime + 0.1,
                )
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.3)
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4)
            }
            // Play pattern every 0.8 seconds
            const interval = setInterval(createPattern, 800)
            return () => {
                clearInterval(interval)
                oscillator.stop()
                oscillator.disconnect()
                gainNode.disconnect()
                audioContext.close()
            }
        }

        let cleanup: (() => void) | undefined

        if (isPlaying) {
            cleanup = createAlarmSound()
        }

        return () => {
            if (cleanup) cleanup()
        }
        
    }, [isPlaying])


    const onTake = async () => {

        setIsLoading(true)

        try {
            const doseRef = doc(appDb, "userProfile", currentUser?.uid || "", "medications", medicationId || "", "doses", docId || "");

            await updateDoc(doseRef, {
                taken: true,
                takenAt: Timestamp.now(),
            });

            setDisplayAlarm(false);

            toast.success("Dose marked as taken ✅");
        }
        catch(error) {
            toast.error(`Error marking dose as taken: ${error}`);
        } 
        finally {
            setIsLoading(false);
        }
    }

    const handleTake = () => {
        setIsPlaying(false)
        onTake()
    }

    const handleSkip = () => {
        setIsPlaying(false)
        setDisplayAlarm(false)
    }

    return (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-red-600 p-6 text-white text-center">
                    <div className={`inline-block ${isPlaying ? 'animate-shake' : ''}`}>
                        <BellRing size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-xl font-bold mt-3">Medication Reminder</h2>
                </div>
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            {medicationName}
                        </h3>
                        {/* <p className="text-lg text-gray-600">{dosage}</p> */}
                        {instruction && (
                            <p className="mt-2 text-gray-500 text-sm">{instruction}</p>
                        )}
                        <p className="mt-4 text-gray-700">
                            It's time to take your medication
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleSkip}
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                            Skip
                        </button>
                        <button
                            onClick={handleTake}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-primary-700 transition-colors cursor-pointer"
                        >
                            {isLoading ? "Processing..." : (
                                <>
                                    <Check size={20} />
                                    Take
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default AlarmModal;