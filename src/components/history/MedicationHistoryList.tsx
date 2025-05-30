import { useState } from 'react';
import { CheckIcon, XIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';



const MedicationHistoryList = () => {

  const [expandedDates, setExpandedDates] = useState(['May 24, 2025', 'May 23, 2025']);

  const toggleDate = date => {
    setExpandedDates(prev => prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]);
  };

  const historyData = [{
    date: 'May 24, 2025',
    medications: [{
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '08:00 AM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '12:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '05:00 PM',
      status: 'pending',
      instructions: 'Take with food'
    }]
  }, {
    date: 'May 23, 2025',
    medications: [{
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '08:00 AM',
      status: 'missed',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '12:00 PM',
      status: 'missed',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '05:00 PM',
      status: 'missed',
      instructions: 'Take with food'
    }]
  }, {
    date: 'May 22, 2025',
    medications: [{
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '08:00 AM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '12:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '05:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }]
  }, {
    date: 'May 21, 2025',
    medications: [{
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '08:00 AM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '12:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '05:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }]
  }, {
    date: 'May 20, 2025',
    medications: [{
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '08:00 AM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '12:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '05:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }]
  }, {
    date: 'May 19, 2025',
    medications: [{
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '08:00 AM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '12:00 PM',
      status: 'missed',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '05:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }]
  }, {
    date: 'May 18, 2025',
    medications: [{
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '08:00 AM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '12:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }, {
      name: 'Paracetamol',
      dosage: '20 IU',
      time: '05:00 PM',
      status: 'taken',
      instructions: 'Take with food'
    }]
  }];
  const statusIcons = {
    taken: <CheckIcon className="h-5 w-5 text-green-500" />,
    missed: <XIcon className="h-5 w-5 text-red-500" />,
    pending: <ClockIcon className="h-5 w-5 text-yellow-500" />
  };
  const getStatusColor = status => {
    const colors = {
      taken: 'bg-green-100 text-green-800',
      missed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status];
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">
          Complete Medication History
        </h3>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-gray-600">Taken</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-sm text-gray-600">Missed</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {historyData.map(day => <div key={day.date} className="border-b border-gray-100 last:border-0">
            <button className="w-full flex justify-between items-center p-4 hover:bg-gray-50" onClick={() => toggleDate(day.date)}>
              <div className="flex items-center">
                <div className="mr-3">
                  {day.date === 'May 24, 2025' ? <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      Today
                    </span> : day.date === 'May 23, 2025' ? <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      Yesterday
                    </span> : <span className="text-sm text-gray-500">{day.date}</span>}
                </div>
                <div className="flex space-x-1">
                  {day.medications.map((med, idx) => <span key={idx} className={`h-2 w-2 rounded-full ${med.status === 'taken' ? 'bg-green-500' : med.status === 'missed' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>)}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  {day.medications.filter(m => m.status === 'taken').length}/
                  {day.medications.length} taken
                </span>
                {expandedDates.includes(day.date) ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
              </div>
            </button>
            {expandedDates.includes(day.date) && <div className="px-4 pb-4">
                {day.medications.map((med, idx) => <div key={idx} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                    <div className="mr-3 mt-1">{statusIcons[med.status]}</div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-800">
                          {med.name}
                        </h4>
                        <span className="ml-2 text-sm text-gray-500">
                          {med.dosage}
                        </span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusColor(med.status)}`}>
                          {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>{med.time}</span>
                        <span className="mx-2">•</span>
                        <span>{med.instructions}</span>
                      </div>
                    </div>
                    {med.status === 'missed' && <span className="text-xs text-red-600">Not taken</span>}
                  </div>)}
              </div>}
          </div>)}
      </div>
    </div>;
}

export default MedicationHistoryList;