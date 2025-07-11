import { useState, useEffect } from 'react';
import { ClockIcon, CheckIcon } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContextProvider';
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
import { appDb } from '@/lib/firebase';
import { DosesScheduleProps, UserProfile} from '@/lib/types';
import { DateTime } from "luxon";
import { formatTimestampToUserTime } from '@/lib/mediRemindUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import { markDoseAsTaken } from '@/lib/mediRemindUtils';
import { toast } from 'react-toastify';


const DashboardMedicationItem = ({ upComingMedication, userProfileInfo }: { upComingMedication: DosesScheduleProps; userProfileInfo: UserProfile }) => {

    const timeLeftToMedication = (timestamp: Timestamp) => {
        const now = DateTime.now().setZone(userProfileInfo?.timezone);
        const medTimeUTC = DateTime.fromJSDate(timestamp.toDate()).setZone(userProfileInfo?.timezone);
        const diff = medTimeUTC.diff(now, "hours");
        return Math.round(diff.hours);
    }

    const [loading, setLoading] = useState(false)

    const [taken, setTaken] = useState(false);

    const markMedicationDoseAsTaken = async () => {
        setLoading(true);
        try {
            const response = await markDoseAsTaken(upComingMedication);
            if (response && response.success) {
                setTaken(true); // ✅ Only runs if the dose was actually marked
            }
        }
        catch (err) {
            return;
        }
        finally {
          setLoading(false);
        }
    };
    
    const alreadyTaken = () => {
        toast.info("This medication has already been taken")
    }

    return (
        <div key={upComingMedication.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-medium text-gray-900">{upComingMedication.medicationName}</h3>
                    <p className="text-sm text-gray-600">{upComingMedication.medicationStrength}</p>
                </div>
                <div className="text-right">
                    <p className="font-medium">
                        {userProfileInfo?.timezone && formatTimestampToUserTime(upComingMedication.Timestamp, userProfileInfo?.timezone)}
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
                <button
                    onClick={taken ? alreadyTaken : markMedicationDoseAsTaken}
                    className={`${taken ? "bg-blue-900 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} cursor-pointer text-white text-sm py-2 px-4 rounded-md flex items-center gap-1`}>
                    {loading ? "Processing" : (
                        <>
                            <CheckIcon size={16} />
                            {taken ? "Taken" : "Mark as Taken"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}


const UpcomingMedications = () => {

    const { currentUser, userProfileInfo } = useAuthContext();

    const [upComingMedications, setUpcomingMedications] = useState<DosesScheduleProps[]>()

    const durationInHours = 24
    
    const getUpcomingDoses = async () => {
        const currentLocalTime = DateTime.now().setZone(userProfileInfo?.timezone) ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
        const endTimeRange = currentLocalTime.plus({ hours: 24 });

        const q = query(
            collectionGroup(appDb, 'doses'),
            where('userId', '==', currentUser?.uid),
            where('Timestamp', '>=', Timestamp.fromDate(currentLocalTime.toUTC().toJSDate())),
            where("Timestamp", "<=", Timestamp.fromDate(endTimeRange.toUTC().toJSDate())),
            where("taken", "==", false),
            where("missed", "==", false),
            limit(4),
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

    useEffect(() => {
        if (!userProfileInfo?.timezone) {
            return;
        }
        getUpcomingDoses();
    }, [userProfileInfo?.timezone])

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upcoming Medications
            </h2>
            <div className="space-y-4">
                {!upComingMedications && <LoadingSpinner size='lg' label='Upcoming Medication Loading' />}
                {upComingMedications?.length === 0 && (
                    <div className="mt-3 text-sm text-gray-600">
                        <p>No upcoming medications in the next {durationInHours} hrs.</p>
                    </div>
                )}

                {upComingMedications && userProfileInfo && upComingMedications.map(upComingMedication => (
                    <DashboardMedicationItem key={upComingMedication.id} upComingMedication={upComingMedication} userProfileInfo={userProfileInfo} />
                ))}
                
            </div>
            <div className="mt-4 text-center">
                <Link to={"/schedule"} className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
                    View Full Schedule
                </Link>
            </div>
        </div>
    );
}


export default UpcomingMedications;