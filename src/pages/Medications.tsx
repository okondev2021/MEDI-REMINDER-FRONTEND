import { PlusIcon, PillIcon, ClockIcon, CalendarIcon } from 'lucide-react';
import AddMedication  from '../components/AddMedication';
import { useState } from 'react';

const Medications = () => {

    const dummMedications = [
        {
        name: 'Lisinopril',
        strength: '10mg',
        frequency: 'Daily',
        schedule: '8:00 AM',
        instructions: 'Take with water',
        status: 'active'
    }, {
        name: 'Metformin',
        strength: '500mg',
        frequency: 'Twice daily',
        schedule: '8:00 AM, 8:00 PM',
        instructions: 'Take with food',
        status: 'active'
    }, {
        name: 'Vitamin D',
        strength: '1000 IU',
        frequency: 'Daily',
        schedule: '2:00 PM',
        instructions: 'Take with food',
        status: 'paused'
        }
    ];

    const [newMedication, setNewMedication] = useState(false)

    const [medications, setMedications] = useState(dummMedications)

    
    if (newMedication) {
        return <AddMedication setNewMedication={setNewMedication} />
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">My Medications</h2>
                <button onClick={ () => setNewMedication(true)} className="cursor-pointer flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <PlusIcon size={20} className="mr-2" />
                    Add New Medication
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 gap-4 p-4">
                    {medications.map((medication, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${medication.status === 'active' ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <PillIcon size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {medication.name}
                                            <span className="ml-2 text-sm text-gray-500">
                                                {medication.strength}
                                            </span>
                                        </h3>
                                        <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <ClockIcon size={16} className="mr-1" />
                                                {medication.frequency}
                                            </div>
                                            <div className="flex items-center">
                                                <CalendarIcon size={16} className="mr-1" />
                                                {medication.schedule}
                                            </div>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {medication.instructions}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {medication.status === 'active' ?
                                        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                        :
                                        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                            Paused
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default Medications;