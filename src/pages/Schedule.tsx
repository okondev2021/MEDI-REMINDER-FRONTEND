import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, EditIcon } from 'lucide-react';


const Schedule = () => {

    const [currentMonth, setCurrentMonth] = useState('March 2024');

    const [selectedDate, setSelectedDate] = useState('March 15, 2024');

    const dailySchedule = [
        {
            time: '08:00 AM',
            medications: [
                {
                    name: 'Lisinopril',
                    dosage: '10mg',
                    instructions: 'Take with water'
                },
                {
                    name: 'Metformin',
                    dosage: '500mg',
                    instructions: 'Take with breakfast'
                }
            ]
        },
        {
            time: '02:00 PM',
            medications: [
                {
                    name: 'Vitamin D',
                    dosage: '1000 IU',
                    instructions: 'Take with food'
                }
            ]
        },
        {
            time: '08:00 PM',
            medications: [
                {
                    name: 'Atorvastatin',
                    dosage: '20mg',
                    instructions: 'Take with evening meal'
                }
            ]
        }
    ];
    const daysInMonth = Array.from({
        length: 31
    }, (_, i) => i + 1);
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Schedule</h2>
                <button onClick={() => {}} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <PlusIcon size={20} className="mr-2" />
                    Add Medication
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-800">
                            {currentMonth}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <button className="p-1 rounded hover:bg-gray-100">
                                <ChevronLeftIcon size={20} />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100">
                                <ChevronRightIcon size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                        {daysInMonth.map(day => (
                            <button key={day} className={`aspect-square flex items-center justify-center rounded-full text-sm 
                                ${day === 15 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                                ${[5, 10, 15, 20, 25].includes(day) ? 'after:content-["•"] after:absolute after:bottom-1 after:text-blue-600' : ''}`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">
                            Daily Schedule
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{selectedDate}</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {dailySchedule.map((schedule, index) => (
                            <div key={index} className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-gray-900">
                                        {schedule.time}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {schedule.medications.map((med, medIndex) => (
                                        <div key={medIndex} className="flex items-start justify-between bg-gray-50 p-3 rounded-lg">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {med.name}
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {med.dosage}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {med.instructions}
                                                </p>
                                            </div>
                                            <button onClick={() => {}} className="p-1 text-gray-400 hover:text-gray-600">
                                                <EditIcon size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Schedule;