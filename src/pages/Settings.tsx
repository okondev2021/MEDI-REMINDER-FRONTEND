
import { BellIcon, SmartphoneIcon, MailIcon, ClockIcon, UserIcon } from 'lucide-react';
import { IAIATimezones } from '@/database';
import { useAuthContext } from '@/context/AuthContextProvider';

const SettingsPage = () => {


    const { userProfileInfo, currentUser } = useAuthContext();



    
    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
            <div className="space-y-6">
                {/* Notification Preferences */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <BellIcon size={20} className="mr-2 text-gray-500" />
                        Notification Preferences
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <SmartphoneIcon size={18} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-700">
                                        Push Notifications
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Receive alerts on your device
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={userProfileInfo?.pushNotifications} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <MailIcon size={18} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-700">
                                        Email Notifications
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Receive daily summary and reminders
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={userProfileInfo?.emailNotifications} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <ClockIcon size={18} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-700">Reminder Timing</p>
                                    <p className="text-sm text-gray-500">
                                        Minutes before scheduled time
                                    </p>
                                </div>
                            </div>
                            <select className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={userProfileInfo?.notificationReminderTiming.toString()} >
                                <option value="1"> 1 minute</option>
                                <option value="5">5 minutes</option>
                                <option value="10">10 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <UserIcon size={20} className="mr-2 text-gray-500" />
                        Account Settings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input type="text" defaultValue={currentUser?.name} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input type="email" defaultValue={currentUser?.email} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                                Time Zone
                            </label>
                  
                            <input id="timezone" list='timezones' value={userProfileInfo?.timezone} name='timezone' className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder='Choose your timezone' />
                            <datalist id='timezones'>
                                {Object.keys(IAIATimezones).map((timezone, index) => (
                                    <option key={index} value={timezone} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security still pending for now */}
                {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <ShieldIcon size={20} className="mr-2 text-gray-500" />
                        Privacy & Security
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">
                                    Two-Factor Authentication
                                </p>
                                <p className="text-sm text-gray-500">
                                    Add an extra layer of security
                                </p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                                Enable
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Data Privacy</p>
                                <p className="text-sm text-gray-500">
                                    Manage how your data is used
                                </p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                                Manage
                            </button>
                        </div>
                    </div>
                </div> */}


                <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;