import { BellIcon, XIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';

interface NotificationsProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationsModal = ({ isOpen, onClose } : NotificationsProps) => {


    const notifications = [
        {
            id: 1,
            type: 'reminder',
            title: 'Medication Due',
            message: 'Time to take Lisinopril (10mg)',
            time: '2 minutes ago',
            status: 'pending'
        }, {
            id: 2,
            type: 'reminder',
            title: 'Medication Due',
            message: 'Time to take Metformin (500mg)',
            time: '15 minutes ago',
            status: 'completed'
        }, {
            id: 3,
            type: 'alert',
            title: 'Refill Needed',
            message: 'Vitamin D prescription needs refill',
            time: '1 hour ago',
            status: 'pending'
        }
    ];

    if (!isOpen) return null;
    return (
        <div className="w-[90%] mx-auto right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 md:w-96 md:absolute">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                    <BellIcon size={20} className="text-gray-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XIcon className='cursor-pointer' size={20} />
                </button>
            </div>
            <div className="divide-y divide-gray-200 max-h-[480px] overflow-y-auto">
                {notifications.map(notification => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50 ">
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
                                    : <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <AlertCircleIcon size={16} className="text-yellow-600" />
                                    </div>
                                }
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500">{notification.time}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                    {notification.message}
                                </p>
                                {notification.status === 'pending' && <div className="mt-2">
                                    <button className="text-sm text-blue-600 hover:text-blue-500 font-medium cursor-pointer">
                                        Mark as Complete
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-500 font-medium cursor-pointer">
                    View All Notifications
                </button>
            </div>
        </div>
    )
}

export default NotificationsModal;