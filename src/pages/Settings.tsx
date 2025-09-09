import React, { useState, useEffect } from 'react';
import { BellIcon, SmartphoneIcon, MailIcon, ClockIcon, UserIcon } from 'lucide-react';
import { IAIATimezones } from '@/database';
import { useAuthContext } from '@/context/AuthContextProvider';
import { doc, setDoc } from 'firebase/firestore';
import { appDb } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';
import { updateProfile } from 'firebase/auth';
import { appAuth } from '@/lib/firebase';
import { updateEmail } from 'firebase/auth';
import { UserProfile } from '@/lib/types';
import { USER_ROLES } from '@/lib/types';


const SettingsPage = () => {

    const { userProfileInfo, currentUser } = useAuthContext();

    interface userInfoProps {
        pushNotification: boolean | undefined;
        emailNotification: boolean | undefined;
        notificationReminderTiming: number | undefined;
        name: string | undefined;
        email: string | undefined;
        timezone: string | undefined;
    }

    const [userInfo, setUserInfo] = useState<userInfoProps | undefined>()

    const [loading, setLoading] = useState(false)

    const resetData = () => {
        setUserInfo({
            pushNotification: userProfileInfo?.pushNotification,
            emailNotification: userProfileInfo?.emailNotification,
            notificationReminderTiming: userProfileInfo?.notificationReminderTiming,
            name: currentUser?.name,
            email: currentUser?.email,
            timezone: userProfileInfo?.timezone
        })
    }

    useEffect(() => {

        if (!userProfileInfo) {
            return;
        }

        resetData();

    }, [userProfileInfo])

    const onchangeUserInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        setUserInfo((prevInfo) => {
            if (prevInfo) {
                if (target.type === "checkbox") {
                    return { ...prevInfo, [target.name]: target.checked };
                }
                return { ...prevInfo, [target.name]: target.value };
            }
            return prevInfo;
        });
    }


    const submitUpdatedUserSettings = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        if (!currentUser?.uid) {
            return;
        }

        try {

            const userProfileKeys = ["pushNotification", "emailNotification", "notificationReminderTiming", "timezone"]

            const userProfileRef = doc(appDb, "userProfile", currentUser.uid);

            let params: { [key: string]: string | boolean | number | undefined} = {};

            userProfileKeys.forEach((profileKey) => {
                if (userInfo && userProfileInfo) {
                    if (userInfo[profileKey as keyof userInfoProps] !== userProfileInfo[profileKey as keyof UserProfile]) {
                        params[profileKey] = userInfo[profileKey as keyof userInfoProps]
                    }
                }
                
            })

            if (Object.keys(params).length >= 1) {
                await setDoc(userProfileRef, params, { merge: true })
            }

            if (userInfo?.name !== currentUser?.name && appAuth.currentUser) {
                await updateProfile(appAuth.currentUser, {
                    displayName: userInfo?.name,
                });
            }

            if (userInfo?.email && userInfo?.email !== currentUser?.email && appAuth.currentUser) {
                await updateEmail(appAuth.currentUser, userInfo?.email);
            }
            
            toast.success("Profile Details Updated Successfully")
        }
        catch (error) {
            resetData();

            const message = error instanceof FirebaseError ? error.message : "An unexpected error occurred, try again";

            toast.error(message)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl space-y-6 mx-auto px-4 sm:px-6 lg:px-0">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h2>

            <form
                className="space-y-8"
                onSubmit={submitUpdatedUserSettings}
                method="post"
            >
                {/* Notification Preferences */}
                {userProfileInfo?.userType === USER_ROLES.PATIENT && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-5 flex items-center">
                            <BellIcon size={20} className="mr-2 text-gray-500" />
                            Notification Preferences
                        </h3>

                        <div className="space-y-5">
                            {/* Push Notifications */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <SmartphoneIcon size={18} className="text-gray-400 mr-3 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-700">
                                            Push Notifications
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Receive alerts directly on your device
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={userInfo?.pushNotification ?? false}
                                        onChange={(e) => onchangeUserInfo(e)}
                                        name="pushNotification"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>

                            {/* Email Notifications */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <MailIcon size={18} className="text-gray-400 mr-3 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-700">
                                            Email Notifications
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Get summaries and reminders via email
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={userInfo?.emailNotification ?? false}
                                        onChange={(e) => onchangeUserInfo(e)}
                                        name="emailNotification"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>

                            {/* Reminder Timing */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <ClockIcon size={18} className="text-gray-400 mr-3 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-700">
                                            Reminder Timing
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            How long before a dose to remind you
                                        </p>
                                    </div>
                                </div>
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={userInfo?.notificationReminderTiming?.toString() || "1"}
                                    onChange={(e) => onchangeUserInfo(e)}
                                    name="notificationReminderTiming"
                                >
                                    <option value="1">1 min</option>
                                    <option value="5">5 min</option>
                                    <option value="10">10 min</option>
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-5 flex items-center">
                        <UserIcon size={20} className="mr-2 text-gray-500" />
                        Account Settings
                    </h3>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={userInfo?.name || ""}
                                onChange={(e) => onchangeUserInfo(e)}
                                name="name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={userInfo?.email || ""}
                                name="email"
                                onChange={(e) => onchangeUserInfo(e)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {userProfileInfo?.userType === USER_ROLES.PATIENT && (
                            <div>
                                <label
                                    htmlFor="timezone"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Time Zone
                                </label>
                                <input
                                    id="timezone"
                                    list="timezones"
                                    value={userInfo?.timezone || ""}
                                    name="timezone"
                                    onChange={(e) => onchangeUserInfo(e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    placeholder="Choose your timezone"
                                />
                                <datalist id="timezones">
                                    {Object.keys(IAIATimezones).map((timezone, index) => (
                                        <option key={index} value={timezone} />
                                    ))}
                                </datalist>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={resetData}
                        type="button"
                        className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? <Loader /> : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>

    );
}

export default SettingsPage;