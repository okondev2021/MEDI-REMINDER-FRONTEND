import { useState, useEffect } from "react";
import { CheckIcon, PillIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    formatDate,
    markDoseAsTaken,
    groupDailyDosesByTime,
} from "@/lib/mediRemindUtils";
import { appDb } from "@/lib/firebase";
import { useAuthContext } from "@/context/AuthContextProvider";
import {
    collectionGroup,
    query,
    where,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { GroupedDosesProps, UserProfile, DosesScheduleProps } from "@/lib/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { DateTime } from "luxon";
import { toast } from "react-toastify";

/* ---------------------- Medication Item ---------------------- */
const ScheduleMedicationItem = ({
    userProfileInfo,
    medication,
}: {
    userProfileInfo: UserProfile;
    medication: DosesScheduleProps;
}) => {
    const checkIfPresentDay = (doseTime: Timestamp) => {
        const currentDay = DateTime.now().setZone(userProfileInfo?.timezone);
        const doseDate = DateTime.fromJSDate(doseTime.toDate()).setZone(
            userProfileInfo?.timezone
        );
        return doseDate.startOf("day") > currentDay.startOf("day");
    };

    const [loading, setLoading] = useState(false);
    const [taken, setTaken] = useState(medication.taken);

    const markMedicationDoseAsTaken = async () => {
        setLoading(true);
        try {
            const response = await markDoseAsTaken(medication);
            if (response?.success) setTaken(true);
        } catch (err) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const alreadyTaken = () => toast.info("This medication has already been taken");

    return (
        <div className="flex items-start justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-sm transition">
            <div>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <PillIcon size={16} className="text-blue-600" />
                    {medication.medicationName}
                    <span className="ml-1 text-sm text-gray-500">
                        {medication.medicationStrength}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    {medication.medicationInstruction}
                </p>
            </div>

            {!checkIfPresentDay(medication.Timestamp) && (
                <button
                    onClick={
                        medication.missed
                            ? undefined
                            : taken
                                ? alreadyTaken
                                : markMedicationDoseAsTaken
                    }
                    disabled={loading}
                    className={cn(
                        "text-white text-sm py-2 px-4 rounded-lg flex items-center gap-1 shadow-sm transition cursor-pointer",
                        medication.missed
                            ? "bg-red-600 hover:bg-red-700"
                            : taken
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    {loading ? (
                        "Processing..."
                    ) : (
                        <>
                            <CheckIcon size={16} />
                            {medication.missed ? "Missed" : taken ? "Taken" : "Mark as Taken"}
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

/* ---------------------- Schedule Page ---------------------- */
const Schedule = () => {
    const { currentUser, userProfileInfo } = useAuthContext();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [dailySchedule, setDailySchedule] = useState<GroupedDosesProps[] | null>();

    const improvedSetDate = (date: Date | undefined) => {
        setDailySchedule(null);
        if (!date) return;
        if (date < new Date()) {
            setDate(new Date());
        } else {
            setDate(date);
        }
    };

    const getDailyScheduledDoses = async () => {
        const q = query(
            collectionGroup(appDb, "doses"),
            where("userId", "==", currentUser?.uid),
            where("date", "==", formatDate(date ?? new Date()))
        );

        const doses = await getDocs(q);

        const dosesList = doses.docs.map((dose) => ({
            ...(dose.data() as DosesScheduleProps),
            id: dose.id,
        }));

        setDailySchedule(groupDailyDosesByTime(dosesList));
    };

    useEffect(() => {
        getDailyScheduledDoses();
    }, [date]);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Your Schedule
                </h2>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={improvedSetDate}
                        className="rounded-md w-full"
                        classNames={{
                            months:
                                "cursor-pointer flex w-full flex-col sm:flex-row gap-6 flex-1",
                            month: "cursor-pointer space-y-4 w-full flex flex-col",
                            table: "w-full h-full border-collapse",
                            head_cell:
                                "cursor-pointer text-muted-foreground rounded-md w-8 font-normal text-xs",
                            cell: cn(
                                "cursor-pointer relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                "w-full"
                            ),
                            day: cn(
                                buttonVariants({ variant: "ghost" }),
                                "cursor-pointer size-9 w-full p-0 font-normal aria-selected:opacity-100"
                            ),
                        }}
                    />
                </div>

                {/* Daily Medication List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Daily Medications
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {!dailySchedule && (
                            <LoadingSpinner label="Loading Schedule..." size="lg" />
                        )}
                        {dailySchedule && dailySchedule.length < 1 && (
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                                <CheckIcon size={16} className="text-green-600" />
                                You’re all caught up! No medications today 🎉
                            </p>
                        )}
                        {dailySchedule?.map((schedule, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-gray-900">{schedule.time}</span>
                                </div>
                                <div className="space-y-4">
                                    {userProfileInfo &&
                                        schedule.medications.map((medication, medIndex) => (
                                            <ScheduleMedicationItem
                                                key={medIndex}
                                                userProfileInfo={userProfileInfo}
                                                medication={medication}
                                            />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
