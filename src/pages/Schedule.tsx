import { useState, useEffect } from 'react';
import { CheckIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDate, markDoseAsTaken, groupDailyDosesByTime } from '@/lib/mediRemindUtils';
import { appDb } from '@/lib/firebase';
import { useAuthContext } from '@/context/AuthContextProvider';
import {
    collectionGroup,
    query,
    where,
    getDocs,
    Timestamp
} from 'firebase/firestore';
import { GroupedDosesProps } from '@/lib/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { DateTime } from 'luxon';
import { UserProfile, DosesScheduleProps } from '@/lib/types';
import { toast } from 'react-toastify';



const ScheduleMedicationItem = ({ userProfileInfo, medication }: { userProfileInfo: UserProfile; medication: DosesScheduleProps; }) => {

    const checkIfPresentDay = (doseTime: Timestamp) => {
        const currentDay = DateTime.now().setZone(userProfileInfo?.timezone);
        const doseDate = DateTime.fromJSDate(doseTime.toDate()).setZone(userProfileInfo?.timezone);
        return doseDate.startOf('day') > currentDay.startOf('day');
    }

    const [loading, setLoading] = useState(false)

    const [taken, setTaken] = useState(medication.taken);

    const markMedicationDoseAsTaken = async () => {
        setLoading(true);
        try {
            const response = await markDoseAsTaken(medication);
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
        <div className="flex items-start justify-between bg-gray-50 p-3 rounded-lg">
            <div>
                <div className="font-medium text-gray-900">
                    {medication.medicationName}
                    <span className="ml-2 text-sm text-gray-500">
                        {medication.medicationStrength}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    {medication.medicationInstruction}
                </p>
            </div>

            {!checkIfPresentDay(medication.Timestamp) && (
                <button
                    onClick={medication.missed ? undefined : taken ? alreadyTaken : markMedicationDoseAsTaken}
                    className={`${medication.missed ? " bg-red-600 hover:bg-red-700" : " bg-blue-600 hover:bg-blue-700"} text-white cursor-pointer text-sm py-2 px-4 rounded-md flex items-center gap-1`}>
                    {loading ? "Processing" : (
                        <>
                            <CheckIcon size={16} />
                            {medication.missed ? "Missed" : taken ? "Taken" : "Mark as Taken"}
                        </>
                    )}
                </button>
            )}
        </div>
    )
}




const Schedule = () => {

    const { currentUser, userProfileInfo } = useAuthContext();

    const [date, setDate] = useState<Date | undefined>(new Date())


    const [dailySchedule, setDailySchedule] = useState<GroupedDosesProps[] | null>()

    // ensures users cannot select previous date
    const improvedSetDate = (date: Date | undefined) => {
        setDailySchedule(null);
        if (!date) {
            return;
        }
        if (date < new Date()) {
            setDate(new Date());
        } else {
            setDate(date);
        }
    }

    const getDailyScheduledDoses = async () => {

        const q = query(
            collectionGroup(appDb, 'doses'),
            where('userId', '==', currentUser?.uid),
            // where("taken", "==", false),
            // where("missed", "==", false),
            where('date', '==', formatDate(date ?? new Date()))
        );

        const doses = await getDocs(q);

        const dosesList = doses.docs.map(dose => (
            {
                ...(dose.data() as DosesScheduleProps),
                id: dose.id,
            }
        ));

        setDailySchedule(groupDailyDosesByTime(dosesList))
    }

    useEffect(() => {
        getDailyScheduledDoses();
    }, [date])

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Schedule</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={improvedSetDate}
                        className="rounded-md border w-full"
                        classNames={{
                            months: ' cursor-pointer flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
                            month: ' cursor-pointer space-y-4 w-full flex flex-col',
                            table: 'w-full h-full border-collapse space-y-1',
                            head_cell: 'cursor-pointer text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] w-full',
                            cell: cn(
                                ' cursor-pointer [&:has([aria-selected])]:bg-accent relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                                '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
                                'w-full',
                            ),
                            day: cn(
                                buttonVariants({ variant: 'ghost' }),
                                'cursor-pointer size-8 w-full p-0 font-normal aria-selected:opacity-100',
                            ),
                        }}
                    />
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">
                            Daily Medication
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {!dailySchedule && <LoadingSpinner label='Loading Schedule' size='lg' />}
                        {(dailySchedule && dailySchedule.length < 1) && <p>You do not have any medication today 😁😁.</p>}
                        {dailySchedule?.map((schedule, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-gray-900">
                                        {schedule.time}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {userProfileInfo && schedule.medications.map((medication, medIndex) => (

                                        <ScheduleMedicationItem key={medIndex} userProfileInfo={userProfileInfo} medication={medication}  />

                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Schedule;