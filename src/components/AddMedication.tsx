import React, { useState, useMemo } from 'react';
import { PlusIcon, XIcon, ChevronDownIcon, InfoIcon, AlarmClockIcon, CalendarIcon } from 'lucide-react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { appDb } from '../lib/firebase';
import { useAuthContext } from '../context/AuthContextProvider';
import { addDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import Loader from './Loader';
import { toast } from 'react-toastify';
import ErrorContainer from './ErrorContainer';
import { GenerateMonthlyDosesParams } from '../lib/types';
import { generateMonthlyDoses } from '../lib/mediRemindUtils';

const AddMedication = ({ setNewMedication }: { setNewMedication: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const { currentUser } = useAuthContext();

    // Memoize the collection reference avoid unecessary interaction with db on every render
    const medicationCollectionRef = useMemo(() => collection(appDb, "userProfile", currentUser.uid, "medications"), [appDb]);

    const [errorMessage, setErrorMessage] = useState("")

    const [loading, setLoading] = useState(false)

    // FORM STATE

    // medication information

    const [medicationName, setMedicationName] = useState("");

    const [medicationStrength, setMedicationStrength] = useState("");

    const [medicationStrengthUnit, setMedicationStrengthUnit] = useState("");

    const [medicationInstruction, setMedicationInstruction] = useState("");

    const [startDate, setStartDate] = useState("")

    // schedule states

    const [frequency, setFrequency] = useState('daily');

    const [showFrequencyOptions, setShowFrequencyOptions] = useState(false);

    const [days, setDays] = useState({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true
    });

    const [times, setTimes] = useState([{
        time: '08:00',
        period: 'AM'
    }]);


    // select day of the week
    const handleDayToggle = (day: string) => {
        setDays(prev => ({
            ...prev,
            [day]: !prev[day as keyof typeof prev]
        }));
    };

    const addTime = () => {
        setTimes([...times, {
            time: '08:00',
            period: 'AM'
        }]);
    };

    const removeTime = (index: number) => {
        setTimes(times.filter((_, i) => i !== index));
    };

    const updateTime = (index: number, field: string, value: string) => {
        const newTimes = [...times];
        const hour = parseInt(value.slice(0, 2))
        const minutes = parseInt(value.slice(3))

        newTimes[index] = field === 'time' && (hour >= 12 && minutes >= 0) ?

            {
                time: value.toString(),
                period: 'PM'
            }
            :
            field === 'time' && (hour < 12) ?
                {
                    time: value.toString(),
                    period: 'AM'
                }
                :
                {
                    ...newTimes[index],
                    [field]: value
                }

        setTimes(newTimes);
    };


    const submitMedication = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const arrayDays = Object.keys(days).filter((day) => days[day as keyof typeof days])
        const arrayTimeSlot = times.map((time) => time.time)

        try {
            const medicationResponse = await addDoc(medicationCollectionRef, {
                medicationInformation: {
                    name: medicationName,
                    instructions: medicationInstruction,
                    medicationStrength: medicationStrength + " " + medicationStrengthUnit,
                    startDate: startDate,
                },
                schedule: {
                    type: frequency,
                    days: arrayDays,
                    timeSlots: arrayTimeSlot
                },
                status: true
            });

            const medicationId = medicationResponse?.id

            if (medicationId) {

                const dataForDose: GenerateMonthlyDosesParams = {
                    startDate: startDate,
                    selectedDays: arrayDays,
                    timeSlots: arrayTimeSlot,
                    medicationInfo: {
                        id: medicationId,
                        name: medicationName,
                        strength: medicationStrength + " " + medicationStrengthUnit,
                        instruction: medicationInstruction
                    },
                    userId: currentUser.uid,
                };

                const generatedDoses = generateMonthlyDoses(dataForDose)

                const batch = writeBatch(appDb);

                const dosesCollectionRef = collection(appDb, "userProfile", currentUser.uid, "medications", medicationId, "doses")

                generatedDoses.forEach((dose) => {
                    const doseDocRef = doc(dosesCollectionRef)
                    batch.set(doseDocRef, dose);
                });


                await batch.commit(); // Commit the batch, which applies all writes atomically

            }

            // unmount component
            setNewMedication(false);

            toast.success("Medication added successfully!")
        }
        catch (error) {

            const message = error instanceof FirebaseError ? error.message : "An unexpected error occurred";

            setErrorMessage(message);

            setTimeout(() => {
                setErrorMessage("")
            }, 4000)
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-800">Add Medication</h2>
                <p className="text-gray-600 mt-1">
                    Fill out the details to add a new medication to your schedule.
                </p>
            </div>
            {errorMessage && <ErrorContainer errorMessage={errorMessage} setErrorMessage={setErrorMessage} />}
            <form onSubmit={submitMedication} method='post' className="p-6">
                <div className="space-y-6">
                    {/* Medication Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">
                            Medication Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="medication-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Medication Name*
                                </label>
                                <input onChange={(e) => setMedicationName(e.target.value)} type="text" id="medication-name" placeholder="e.g., Lisinopril" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="strength" className="block text-sm font-medium text-gray-700 mb-1">
                                    Strength*
                                </label>
                                <div className="flex">
                                    <input onChange={(e) => setMedicationStrength(e.target.value)} type="text" id="strength" placeholder="e.g., 10" className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    <select onChange={(e) => setMedicationStrengthUnit(e.target.value)} className="cursor-pointer w-1/3 border-l-0 border border-gray-300 rounded-r-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="mg">mg</option>
                                        <option value="mcg">mcg</option>
                                        <option value="g">g</option>
                                        <option value="ml">ml</option>
                                        <option value="IU">IU</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                                Instructions
                            </label>
                            <input onChange={(e) => setMedicationInstruction(e.target.value)} type="text" id="instructions" placeholder="e.g., Take with food" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    {/* Schedule */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Schedule</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frequency*
                            </label>
                            <div className="relative">
                                <button type="button" className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white" onClick={() => setShowFrequencyOptions(!showFrequencyOptions)}>
                                    <span className="capitalize">{frequency}</span>
                                    <ChevronDownIcon size={16} />
                                </button>
                                {showFrequencyOptions && <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                    {['daily', 'custom'].map(option => <button key={option} type="button" className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize" onClick={() => {
                                        setFrequency(option);
                                        setShowFrequencyOptions(false);
                                    }}>
                                        {option}
                                    </button>)}
                                </div>}
                            </div>
                        </div>
                        {frequency === 'custom' && <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Days of Week
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day =>
                                    <button key={day} type="button" className={`cursor-pointer px-3 py-1 rounded-full text-sm ${days[day as keyof typeof days] ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-500 border border-gray-200'}`} onClick={() => handleDayToggle(day)}>
                                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                                    </button>
                                )}
                            </div>
                        </div>}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Times*
                                </label>
                                <button type="button" className="flex items-center text-sm text-blue-600" onClick={addTime}>
                                    <PlusIcon size={16} className="mr-1" />
                                    Add Time
                                </button>
                            </div>
                            <div className="space-y-3">
                                {times.map((timeObj, index) => <div key={index} className="flex items-center">
                                    <div className="mr-2">
                                        <AlarmClockIcon size={16} className="text-gray-400" />
                                    </div>
                                    <input type="time" value={timeObj.time} onChange={e => updateTime(index, 'time', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <select value={timeObj.period} onChange={e => updateTime(index, 'period', e.target.value)} className="ml-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option  value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                    {times.length > 1 && <button type="button" onClick={() => removeTime(index)} className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                                        <XIcon size={16} />
                                    </button>}
                                </div>)}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date*
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon size={16} className="text-gray-400" />
                                </div>
                                <input onChange={(e) => setStartDate(e.target.value)} type="date" id="start-date" className="cursor-pointer w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                        </div>
                    </div>
                    {/* Reminders */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Reminders</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex">
                            <InfoIcon size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700">
                                Reminders will be sent according to your notification
                                preferences. You can adjust these in Settings.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                    <button onClick={() => setNewMedication(false)} type="button" className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        {loading ? <Loader /> : "Add Medication"}
                    </button>
                </div>
            </form>
        </div>
    );
}


export default AddMedication;