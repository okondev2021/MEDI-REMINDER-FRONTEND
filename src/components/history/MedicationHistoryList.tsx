import { useState, useEffect, SetStateAction } from 'react';
import { CheckIcon, XIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContextProvider';
import { appDb } from '@/lib/firebase';
import {
    collectionGroup,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { DosesScheduleProps, GroupedDosesProps } from '@/lib/types';
import { groupMedicationHistoryByDate } from '@/lib/mediRemindUtils';
import { DateTime } from 'luxon';
import { fetchPatientTimezoneFromCaregiver } from '@/lib/mediRemindUtils';



const MedicationHistoryList = ({ caregiver, setHasMedicationHistory }: { caregiver?: boolean; setHasMedicationHistory?: React.Dispatch<SetStateAction<boolean>> }) => {

    const { currentUser, userProfileInfo } = useAuthContext();

    const [timeZone, setTimeZone] = useState("")

    const now = DateTime.local().setZone(timeZone).startOf('day');

    const yesterday = now.minus({ days: 1 }).toFormat('yyyy-MM-dd');

    const [medicationHistory, setMedicationHistory] = useState<GroupedDosesProps[]>()

    const getFullMedicationHistory = async () => {

        // Get the current local time from end of the day in the user's timezone
        const currentLocalTime = DateTime.now().setZone(timeZone).endOf('day') ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

        const q = query(
            collectionGroup(appDb, 'doses'),
            where('userId', '==', caregiver ? userProfileInfo?.patients?.uid : currentUser?.uid),
            where('Timestamp', '<=', Timestamp.fromDate(currentLocalTime.toUTC().toJSDate())),
            orderBy('Timestamp', 'desc'),
        );

        const doses = await getDocs(q);

        console.log(doses, caregiver ? userProfileInfo?.patients?.uid : currentUser?.uid)

        const dosesList = doses.docs.map(dose => (
            {
                ...(dose.data() as DosesScheduleProps),
                id: dose.id,
            }
        ));

        if (setHasMedicationHistory) {
            setHasMedicationHistory(dosesList.length > 0 ? true : false);
        }

        (timeZone && setMedicationHistory(groupMedicationHistoryByDate(dosesList, timeZone)))
    }

    useEffect(() => {
        if (!userProfileInfo?.timezone) {
            const timeZoneFunc = async () => {
                if (userProfileInfo) {
                    const patientTimezone = await fetchPatientTimezoneFromCaregiver(userProfileInfo);
                    setTimeZone(patientTimezone ?? "");
                }
            }

            timeZoneFunc()
        }
        else {
            setTimeZone(userProfileInfo?.timezone ?? "")
        }
        getFullMedicationHistory();


    }, [timeZone])

    const [expandedDates, setExpandedDates] = useState<string[]>([]);

    // Function to toggle the expansion of medication history for a specific date
    const toggleDate = (date: string) => {
        setExpandedDates(prev => prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]);
    };

    // returns specific icons based on medication status
    const statusIcons = {
        taken: <CheckIcon className="h-5 w-5 text-green-500" />,
        missed: <XIcon className="h-5 w-5 text-red-500" />,
        pending: <ClockIcon className="h-5 w-5 text-yellow-500" />
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/*  */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">
                    Complete Medication History
                </h3>
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm text-gray-600">Taken</span>
                    </div>
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-sm text-gray-600">Missed</span>
                    </div>
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                        <span className="text-sm text-gray-600">Pending</span>
                    </div>
                </div>
            </div>
            {/*  */}
            <div className="divide-y divide-gray-200">
                {(medicationHistory?.length ?? 0) < 1 && (
                    <div className=' p-4'>
                        <p className="text-base font-bold text-gray-600 text-center">{caregiver ? "No medication logs found yet. Once they start tracking their meds, you'll see them here" : "History is empty, add a medication to get started"}</p>
                    </div>
                )}
                {medicationHistory?.map(day => (
                    <div key={day.time} className="border-b border-gray-100 last:border-0">
                        {/*  */}
                        <button
                            className="w-full cursor-pointer flex justify-between items-center p-4 hover:bg-gray-50"
                            onClick={() => toggleDate(day.time)}
                        >
                            <div className="flex items-center">
                                <div className="mr-3">
                                    {day.time === now.toFormat('yyyy-MM-dd') ? 'Today' : day.time === yesterday ? 'Yesterday' : day.time}
                                </div>
                                <div className="flex space-x-1">
                                    {day.medications.map((med, idx) => (
                                        <span
                                            key={idx}
                                            className={`h-2 w-2 rounded-full ${med.taken ? 'bg-green-500' : med.missed ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">
                                    {day.medications.filter(m => m.taken).length}/
                                    {day.medications.length} taken
                                </span>
                                {/*  */}
                                {expandedDates.includes(day.time) ?
                                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                                    :
                                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                }
                            </div>
                        </button>
                        {/*  */}
                        {expandedDates.includes(day.time) && (
                            <div className="px-4 pb-4">
                                {day.medications.map((med, idx) => (
                                    <div key={idx} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                                        <div className="mr-3 mt-1">{med.taken ? statusIcons["taken"] : med.missed ? statusIcons["missed"] : statusIcons["pending"]}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <h4 className="font-medium text-gray-800">
                                                    {med.medicationName}
                                                </h4>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {med.medicationStrength}
                                                </span>
                                                <span
                                                    className={`ml-2 text-xs px-2 py-0.5 rounded-full 
                                                        ${med.taken ? "bg-green-100 text-green-800" : med.missed ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`
                                                    }
                                                >
                                                    {med.taken ? "taken" : med.missed ? "missed" : "pending"}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span>{med.time}</span>
                                                <span className="mx-2">•</span>
                                                <span>{med.medicationInstruction}</span>
                                            </div>
                                        </div>
                                        {/* {(med.missed && !med.taken) && (
                                            <span className="text-xs text-red-600">Medication Missed</span>
                                        )} */}
                                    </div>
                                ))}
                            </div>
                        )}
                        {/*  */}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default MedicationHistoryList;








