import { CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';

const MedicationHistory = () => {
    // Sample data - in a real app, this would come from a backend
    const medicationHistory = [
        {
            date: 'Today',
            medications: [{
                id: 1,
                name: 'Lisinopril',
                dosage: '10mg',
                time: '8:00 AM',
                status: 'taken'
            }, {
                id: 2,
                name: 'Metformin',
                dosage: '500mg',
                time: '8:00 AM',
                status: 'taken'
            }, {
                id: 3,
                name: 'Vitamin D',
                dosage: '1000 IU',
                time: '1:00 PM',
                status: 'pending'
            }]
        }, {
            date: 'Yesterday',
            medications: [{
                id: 4,
                name: 'Lisinopril',
                dosage: '10mg',
                time: '8:00 AM',
                status: 'taken'
            }, {
                id: 5,
                name: 'Metformin',
                dosage: '500mg',
                time: '8:00 AM',
                status: 'taken'
            }, {
                id: 6,
                name: 'Atorvastatin',
                dosage: '20mg',
                time: '9:00 PM',
                status: 'missed'
            }]
        }];
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Medication History
                </h2>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-600">Taken</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-gray-600">Missed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-gray-600">Pending</span>
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                {medicationHistory.map((day) => (
                    <div key={day.date} className="relative">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                {day.date}
                            </div>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>
                        <div className="relative">
                            {day.medications.map((med, index) => (
                                <div key={med.id} className="relative pl-8 pb-6 last:pb-0">
                                    <div className="absolute left-0 top-0 h-full">
                                        <div className={` absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2
                                            ${med.status === 'taken' ? 'border-green-500 bg-green-100' : ''}
                                            ${med.status === 'missed' ? 'border-red-500 bg-red-100' : ''}
                                            ${med.status === 'pending' ? 'border-yellow-500 bg-yellow-100' : ''}`}>
                                        </div>
                                        {index !== day.medications.length - 1 && <div className="absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>}
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">
                                                        {med.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {med.dosage}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {med.time}
                                                </span>
                                            </div>
                                            <div>
                                                {med.status === 'taken' && <CheckCircleIcon className="text-green-500" size={20} />}
                                                {med.status === 'missed' && <XCircleIcon className="text-red-500" size={20} />}
                                                {med.status === 'pending' && <ClockIcon className="text-yellow-500" size={20} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Complete History
                </button>
            </div>
        </div>
    );
}

export default MedicationHistory;