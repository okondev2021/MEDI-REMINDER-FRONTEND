import { useState, useEffect } from "react";
import { ClockIcon, CheckIcon } from "lucide-react";
import { useAuthContext } from "@/context/AuthContextProvider";
import { Link } from "react-router-dom";
import {
    collectionGroup,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp,
    limit,
} from "firebase/firestore";
import { appDb } from "@/lib/firebase";
import { DosesScheduleProps, UserProfile } from "@/lib/types";
import { DateTime } from "luxon";
import { formatTimestampToUserTime } from "@/lib/mediRemindUtils";
import LoadingSpinner from "../common/LoadingSpinner";
import { markDoseAsTaken } from "@/lib/mediRemindUtils";
import { toast } from "react-toastify";

/* ✅ Single upcoming medication card */
const DashboardMedicationItem = ({
    upComingMedication,
    userProfileInfo,
}: {
    upComingMedication: DosesScheduleProps;
    userProfileInfo: UserProfile;
}) => {
    const timeLeftToMedication = (timestamp: Timestamp) => {
        const now = DateTime.now().setZone(userProfileInfo?.timezone);
        const medTimeUTC = DateTime.fromJSDate(timestamp.toDate()).setZone(
            userProfileInfo?.timezone
        );
        const diff = medTimeUTC.diff(now, "hours");
        return Math.round(diff.hours);
    };

    const [loading, setLoading] = useState(false);
    const [taken, setTaken] = useState(false);

    const markMedicationDoseAsTaken = async () => {
        setLoading(true);
        try {
            const response = await markDoseAsTaken(upComingMedication);
            if (response && response.success) {
                setTaken(true);
            }
        } catch (err) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const alreadyTaken = () => {
        toast.info("This medication has already been taken");
    };

    return (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:bg-gray-100/50 transition">
            <div className="flex justify-between items-start">
                {/* Medication Info */}
                <div>
                    <h3 className="font-semibold text-gray-900 text-base">
                        {upComingMedication.medicationName}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {upComingMedication.medicationStrength}
                    </p>
                </div>

                {/* Time */}
                <div className="text-right">
                    <p className="font-medium text-gray-900">
                        {userProfileInfo?.timezone &&
                            formatTimestampToUserTime(
                                upComingMedication.Timestamp,
                                userProfileInfo?.timezone
                            )}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center justify-end gap-1 mt-1">
                        <ClockIcon size={14} />
                        {timeLeftToMedication(upComingMedication.Timestamp) > 0
                            ? `in ${timeLeftToMedication(upComingMedication.Timestamp)} hrs`
                            : "Now"}
                    </p>
                </div>
            </div>

            {/* Instructions */}
            {upComingMedication.medicationInstruction && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {upComingMedication.medicationInstruction}
                </p>
            )}

            {/* Action button */}
            <div className="mt-4">
                <button
                    onClick={taken ? alreadyTaken : markMedicationDoseAsTaken}
                    disabled={loading}
                    className={`${taken
                            ? "bg-blue-900 hover:bg-blue-800"
                            : "bg-blue-600 hover:bg-blue-700"
                        } w-full cursor-pointer text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition`}
                >
                    {loading ? (
                        "Processing..."
                    ) : (
                        <>
                            <CheckIcon size={16} />
                            {taken ? "Taken" : "Mark as Taken"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

/* ✅ Upcoming medications list */
const UpcomingMedications = () => {
    const { currentUser, userProfileInfo } = useAuthContext();

    const [upComingMedications, setUpcomingMedications] =
        useState<DosesScheduleProps[]>();

    const durationInHours = 24;

    const getUpcomingDoses = async () => {
        const currentLocalTime =
            DateTime.now().setZone(userProfileInfo?.timezone) ??
            Intl.DateTimeFormat().resolvedOptions().timeZone;
        const endTimeRange = currentLocalTime.plus({ hours: 24 });

        const q = query(
            collectionGroup(appDb, "doses"),
            where("userId", "==", currentUser?.uid),
            where("Timestamp", ">=", Timestamp.fromDate(currentLocalTime.toUTC().toJSDate())),
            where("Timestamp", "<=", Timestamp.fromDate(endTimeRange.toUTC().toJSDate())),
            where("taken", "==", false),
            where("missed", "==", false),
            limit(4),
            orderBy("Timestamp", "asc")
        );

        const doses = await getDocs(q);

        const dosesList = doses.docs.map((dose) => ({
            ...(dose.data() as DosesScheduleProps),
            id: dose.id,
        }));

        setUpcomingMedications(dosesList);
    };

    useEffect(() => {
        if (!userProfileInfo?.timezone) return;
        getUpcomingDoses();
    }, [userProfileInfo?.timezone]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Medications
            </h2>

            {/* List */}
            <div className="space-y-4">
                {!upComingMedications && (
                    <LoadingSpinner size="lg" label="Loading Upcoming Medications..." />
                )}

                {upComingMedications?.length === 0 && (
                    <div className="text-center py-6">
                        <p className="text-sm text-gray-500">
                            No upcoming medications in the next {durationInHours} hrs.
                        </p>
                    </div>
                )}

                {upComingMedications &&
                    userProfileInfo &&
                    upComingMedications.map((upComingMedication) => (
                        <DashboardMedicationItem
                            key={upComingMedication.id}
                            upComingMedication={upComingMedication}
                            userProfileInfo={userProfileInfo}
                        />
                    ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
                <Link
                    to={"/schedule"}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View Full Schedule
                </Link>
            </div>
        </div>
    );
};

export default UpcomingMedications;
