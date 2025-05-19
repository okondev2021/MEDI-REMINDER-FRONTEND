import { useState, useEffect } from 'react';
import { EditIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/mediRemindUtils';
import { appDb } from '@/lib/firebase';
import { useAuthContext } from '@/context/AuthContextProvider';
import {
    collectionGroup,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { DosesScheduleProps } from '@/lib/types';
import { groupDailyDosesByTime } from '@/lib/mediRemindUtils';
import { GroupedDailyDosesProps } from '@/lib/types';



const Schedule = () => {

    const [date, setDate] = useState<Date | undefined>(new Date())

    const { currentUser } = useAuthContext();

    const [dailySchedule, setDailySchedule] = useState<GroupedDailyDosesProps[]>()

    const getDailyScheduledDoses = async () => {

        const q = query(
            collectionGroup(appDb, 'doses'),
            where('userId', '==', currentUser.uid),
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
                        onSelect={setDate}
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
                            Daily Schedule
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{date?.getDate()}</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {(dailySchedule && dailySchedule.length < 1) && <p className='p-4'>You do not have any medication today.</p>}
                        {dailySchedule?.map((schedule, index) => (
                            <div key={index} className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-gray-900">
                                        {schedule.time}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {schedule.medications.map((med, medIndex) => (
                                        <div key={medIndex} className="flex items-start justify-between bg-gray-50 p-3 rounded-lg">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {med.medicationName}
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {med.medicationStrength}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {med.medicationInstruction}
                                                </p>
                                            </div>
                                            <button onClick={() => { }} className="p-1 text-gray-400 hover:text-gray-600">
                                                <EditIcon size={16} />
                                            </button>
                                        </div>
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