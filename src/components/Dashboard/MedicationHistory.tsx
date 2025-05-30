import { CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContextProvider';
import { appDb } from '@/lib/firebase';
import { Link } from 'react-router-dom';
import {
    collectionGroup,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp,
    limit
} from 'firebase/firestore';
import { DosesScheduleProps, GroupedDosesProps } from '@/lib/types';
import { groupMedicationHistoryByDate } from '@/lib/mediRemindUtils';
import { DateTime } from 'luxon';
import { formatTimestampToUserTime } from '@/lib/mediRemindUtils';
import LoadingSpinner from '../common/LoadingSpinner';


const MedicationHistory = () => {

    const { currentUser, userProfileInfo } = useAuthContext();

    const now = DateTime.local().setZone(userProfileInfo?.timezone).startOf('day');
    const yesterday = now.minus({ days: 1 }).toFormat('yyyy-MM-dd');

    const [medicationHistory, setMedicationHistory] = useState<GroupedDosesProps[]>()    

    const getBriefMedicationHistory = async () => {

        // Get the current local time from end of the day in the user's timezone
        const currentLocalTime = DateTime.now().setZone(userProfileInfo?.timezone).endOf('day') ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

        const q = query(
            collectionGroup(appDb, 'doses'),
            where('userId', '==', currentUser?.uid),
            where('Timestamp', '<=', Timestamp.fromDate(currentLocalTime.toUTC().toJSDate())),
            limit(6),
            orderBy('Timestamp', 'desc'),
        );

        const doses = await getDocs(q);

        const dosesList = doses.docs.map(dose => (
            {
                ...(dose.data() as DosesScheduleProps),
                id: dose.id,
            }
        ));

        (userProfileInfo?.timezone && setMedicationHistory(groupMedicationHistoryByDate(dosesList, userProfileInfo?.timezone)))
    }

    useEffect(() => {
        if (!userProfileInfo?.timezone) {
            return;
        }

        getBriefMedicationHistory();
    }, [userProfileInfo?.timezone])



    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex gap-y-2 flex-col justify-between mb-6 md:flex-row md:items-center">
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
                {!medicationHistory && <LoadingSpinner size='lg' label='History Loading' />} 
                {medicationHistory && medicationHistory.length < 1 && <p>You have no medication doses yet. Add one to get started.</p>}
                {medicationHistory?.map((day) => (
                    <div key={day.time} className="relative">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                {day.time === now.toFormat('yyyy-MM-dd') ? 'Today' : day.time === yesterday ? 'Yesterday' : day.time}
                            </div>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>
                        <div className="relative">
                            {day.medications.map((med, index) => (
                                <div key={med.id} className="relative pl-8 pb-6 last:pb-0">
                                    <div className="absolute left-0 top-0 h-full">
                                        <div className={` absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2
                                            ${med.taken === true
                                                ? "border-green-500 bg-green-100"
                                                :
                                                DateTime.fromMillis(med.Timestamp.toMillis()).toLocal() < now && med.taken === false
                                                    ?
                                                    'border-red-500 bg-red-100'
                                                    :
                                                    'border-yellow-500 bg-yellow-100'
                                            }
                                            `}>
                                        </div>
                                        {index+1 !== day.medications.length && <div className="absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>}
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">
                                                        {med.medicationName}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {med.medicationStrength}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {userProfileInfo?.timezone && formatTimestampToUserTime(med.Timestamp, userProfileInfo?.timezone)}
                                                </span>
                                            </div>
                                            <div>
                                                {med.taken === true
                                                    ? <CheckCircleIcon className="text-green-500" size={20} />
                                                    :
                                                    DateTime.fromMillis(med.Timestamp.toMillis()).toLocal() < now && med.taken === false
                                                        ?
                                                        <XCircleIcon className="text-red-500" size={20} /> 
                                                        :
                                                        <ClockIcon className="text-yellow-500" size={20} />
                                                }
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
                <Link to={"/history"} className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Complete History
                </Link>
            </div>
        </div>
    ); 
}

export default MedicationHistory;
