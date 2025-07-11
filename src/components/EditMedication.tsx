// import { useState } from 'react';
// XIcon, ChevronDownIcon, InfoIcon, AlarmClockIcon, CalendarIcon,
import { TrashIcon } from 'lucide-react';

interface EditMedicationProps {
    medication?: {
        name: string;
        strength: string;
        instructions: string;
        frequency: string;
        times: {
            time: string;
            period: string;
        }[];
        days?: Record<string, boolean>;
    };
}

const EditMedication = ({
    medication
}: EditMedicationProps) => {
    
    // const [frequency, setFrequency] = useState(medication?.frequency || 'daily');

    // const [showFrequencyOptions, setShowFrequencyOptions] = useState(false);

    // const [days, setDays] = useState(medication?.days || {
    //     monday: true,
    //     tuesday: true,
    //     wednesday: true,
    //     thursday: true,
    //     friday: true,
    //     saturday: true,
    //     sunday: true
    // });

    // const [times, setTimes] = useState(medication?.times || [{
    //     time: '08:00',
    //     period: 'AM'
    // }]);

    // const handleDayToggle = (day: string) => {
    //     setDays(prev => ({
    //         ...prev,
    //         [day]: !prev[day as keyof typeof prev]
    //     }));
    // };

    // const addTime = () => {
    //     setTimes([...times, {
    //         time: '08:00',
    //         period: 'AM'
    //     }]);
    // };

    // const removeTime = (index: number) => {
    //     setTimes(times.filter((_, i) => i !== index));
    // };

    // const updateTime = (index: number, field: string, value: string) => {
    //     const newTimes = [...times];
    //     newTimes[index] = {
    //         ...newTimes[index],
    //         [field]: value
    //     };
    //     setTimes(newTimes);
    // };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Edit Medication
                </h2>
                <p className="text-gray-600 mt-1">
                    Update the details of your medication.
                </p>
            </div>
            <form className="p-6">
                {/* Same form structure as AddMedication, but with pre-populated values */}
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
                                <input type="text" id="medication-name" defaultValue={medication?.name} placeholder="e.g., Lisinopril" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="strength" className="block text-sm font-medium text-gray-700 mb-1">
                                    Strength*
                                </label>
                                <div className="flex">
                                    <input type="text" id="strength" defaultValue={medication?.strength} placeholder="e.g., 10" className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    <select className="w-1/3 border-l-0 border border-gray-300 rounded-r-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                            <input type="text" id="instructions" defaultValue={medication?.instructions} placeholder="e.g., Take with food" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    {/* Schedule section - same as AddMedication */}
                    {/* ... Existing schedule section code ... */}
                    {/* Delete Medication */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <button type="button" className="flex items-center text-red-600 hover:text-red-700">
                            <TrashIcon size={20} className="mr-2" />
                            Delete Medication
                        </button>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                    <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Update Medication
                    </button>
                </div>
            </form>
        </div>
    );
}


export default EditMedication;