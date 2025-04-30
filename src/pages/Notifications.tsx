import { useState } from 'react';
import { BellIcon, CheckIcon, AlertCircleIcon, FilterIcon, ChevronDownIcon } from 'lucide-react';

const Notifications = () => {

    const [filterType, setFilterType] = useState('all');

    const [showFilters, setShowFilters] = useState(false);

    const notifications = [
        {
            id: 1,
            type: 'reminder',
            title: 'Medication Due',
            message: 'Time to take Lisinopril (10mg)',
            time: '2 minutes ago',
            status: 'pending',
            date: 'Today'
        }, {
            id: 2,
            type: 'reminder',
            title: 'Medication Due',
            message: 'Time to take Metformin (500mg)',
            time: '15 minutes ago',
            status: 'completed',
            date: 'Today'
        }, {
            id: 3,
            type: 'alert',
            title: 'Refill Needed',
            message: 'Vitamin D prescription needs refill',
            time: '1 hour ago',
            status: 'pending',
            date: 'Today'
        }, {
            id: 4,
            type: 'reminder',
            title: 'Medication Due',
            message: 'Time to take Atorvastatin (20mg)',
            time: '6:00 PM',
            status: 'completed',
            date: 'Yesterday'
        }, {
            id: 5,
            type: 'alert',
            title: 'Missed Dose',
            message: 'Missed dose: Metformin (500mg)',
            time: '2:00 PM',
            status: 'pending',
            date: 'Yesterday'
        }
    ];

    const filteredNotifications = filterType === 'all' ? notifications : notifications.filter(notification => notification.type === filterType);

    const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
        if (!groups[notification.date]) {
            groups[notification.date] = [];
        }
        groups[notification.date].push(notification);
        return groups;
    }, {} as Record<string, typeof notifications>);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <BellIcon size={24} className="text-blue-600 mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Notifications
                    </h2>
                </div>
                <div className="relative">
                    <button onClick={() => setShowFilters(!showFilters)} className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                        <FilterIcon size={16} className="mr-2 text-gray-500" />
                        Filter
                        <ChevronDownIcon size={16} className="ml-2 text-gray-500" />
                    </button>
                    {showFilters && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                                {['all', 'reminder', 'alert'].map(type => <button key={type} className={`block w-full text-left px-4 py-2 text-sm ${filterType === type ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => {
                                    setFilterType(type);
                                    setShowFilters(false);
                                }}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {Object.entries(groupedNotifications).map(([date, notifications]) => <div key={date}>
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700">{date}</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {notifications.map(notification => (
                            <div key={notification.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        {notification.type === 'reminder' ? notification.status === 'completed' ?
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckIcon size={16} className="text-green-600" />
                                            </div>
                                            :
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <BellIcon size={16} className="text-blue-600" />
                                            </div>
                                            :
                                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                                <AlertCircleIcon size={16} className="text-yellow-600" />
                                            </div>
                                        }
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {notification.time}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {notification.message}
                                        </p>
                                        {notification.status === 'pending' && (
                                            <div className="mt-2">
                                                <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                                                    Mark as Complete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>)}
            </div>
        </div>
    );
}


export default Notifications;