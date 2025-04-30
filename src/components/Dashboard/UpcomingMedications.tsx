import { ClockIcon, CheckIcon } from 'lucide-react';

const UpcomingMedications = () => {
    // Sample data - in a real app, this would come from a backend
    const upcomingMeds = [
        {
            id: 1,
            name: 'Lisinopril',
            dosage: '10mg',
            time: '8:00 PM',
            timeRemaining: 'In 2 hours',
            instructions: 'Take with food'
        },
        {
            id: 2,
            name: 'Metformin',
            dosage: '500mg',
            time: '8:00 PM',
            timeRemaining: 'In 2 hours',
            instructions: 'Take with evening meal'
        },
        {
            id: 3,
            name: 'Vitamin D',
            dosage: '1000 IU',
            time: '9:00 PM',
            timeRemaining: 'In 3 hours',
            instructions: 'Take with food'
        }
    ];
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upcoming Medications
            </h2>
            <div className="space-y-4">
                {upcomingMeds.map(med => (
                    <div key={med.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-gray-900">{med.name}</h3>
                                <p className="text-sm text-gray-600">{med.dosage}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">{med.time}</p>
                                <p className="text-sm text-blue-600 flex items-center justify-end gap-1">
                                    <ClockIcon size={14} />
                                    {med.timeRemaining}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                            <p>{med.instructions}</p>
                        </div>
                        <div className="mt-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md flex items-center gap-1">
                                <CheckIcon size={16} />
                                Mark as Taken
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Full Schedule
                </button>
            </div>
        </div>
    );
}

export default UpcomingMedications;