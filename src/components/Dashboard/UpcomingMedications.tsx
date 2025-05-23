import { useState, useEffect } from 'react';
import { ClockIcon, CheckIcon } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContextProvider';
import {
    collectionGroup,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { appDb } from '@/lib/firebase';
import { DosesScheduleProps } from '@/lib/types';
import { DateTime } from "luxon";
import { formatTimestampToUserTime } from '@/lib/mediRemindUtils';

const UpcomingMedications = () => {

    const { currentUser, userProfileInfo } = useAuthContext();

    const [upComingMedications, setUpcomingMedications] = useState<DosesScheduleProps[]>()

    const getUpcomingDoses = async () => {
        const currentLocalTime = DateTime.now().setZone(userProfileInfo.timezone) ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
        const endTimeRange = currentLocalTime.plus({ hours: 50 });

        const q = query(
            collectionGroup(appDb, 'doses'),
            where('userId', '==', currentUser.uid),
            where('Timestamp', '>=', Timestamp.fromDate(currentLocalTime.toUTC().toJSDate())),
            where("Timestamp", "<=", Timestamp.fromDate(endTimeRange.toUTC().toJSDate())),
            orderBy('Timestamp', 'asc'),
        );

        const doses = await getDocs(q);

        const dosesList = doses.docs.map(dose => (
            {
                ...(dose.data() as DosesScheduleProps),
                id: dose.id,
            }
        ));

        setUpcomingMedications(dosesList)
    }

    const timeLeftToMedication = (timestamp: Timestamp) => {

        const now = DateTime.now().setZone(userProfileInfo.timezone);
        const medTimeUTC = DateTime.fromJSDate(timestamp.toDate()).setZone(userProfileInfo.timezone);
        const diff = medTimeUTC.diff(now, "hours");
        return Math.round(diff.hours);
    }


    useEffect(() => {
        getUpcomingDoses();
    }, [])

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upcoming Medications
            </h2>
            <div className="space-y-4">
                {upComingMedications?.map(upComingMedication => (
                    <div key={upComingMedication.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-gray-900">{upComingMedication.medicationName}</h3>
                                <p className="text-sm text-gray-600">{upComingMedication.medicationStrength}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    {formatTimestampToUserTime(upComingMedication.Timestamp, userProfileInfo.timezone)}
                                </p>
                                <p className="text-sm text-blue-600 flex items-center justify-end gap-1">
                                    <ClockIcon size={14} />
                                    {timeLeftToMedication(upComingMedication.Timestamp) > 0 ? `in ${timeLeftToMedication(upComingMedication.Timestamp)} hours` : "Now"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                            <p>{upComingMedication.medicationInstruction}</p>
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
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                    View Full Schedule
                </button>
            </div>
        </div>
    );
}

export default UpcomingMedications;