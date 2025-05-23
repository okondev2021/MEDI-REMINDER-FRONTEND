import { useState, useEffect, useMemo } from 'react';
import { PlusIcon, PillIcon, ClockIcon, CalendarIcon } from 'lucide-react';
import AddMedication from '../components/AddMedication';
import { useAuthContext } from '../context/AuthContextProvider';
import { collection, getDocs } from 'firebase/firestore';
import { appDb } from '../lib/firebase';
import { MedicationProps } from '../lib/types';


const Medications = () => {

    const { currentUser } = useAuthContext();

    const medicationCollectionRef = useMemo(() => collection(appDb, "userProfile", currentUser.uid, "medications"), [appDb]);
    
    const [newMedication, setNewMedication] = useState(false);

    const [medications, setMedications] = useState <MedicationProps[]>();

    const getMedications = async () => {
        const medicationResponse = await getDocs(medicationCollectionRef);

        const medicationList = medicationResponse.docs.map((medication) => ({
            ...(medication.data() as MedicationProps),
            id: medication.id
        }));

        setMedications(medicationList);
    }

    useEffect(() => {
        getMedications()
    }, [getMedications])

    return (
        newMedication ?
            <AddMedication setNewMedication={setNewMedication} />
            :
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col gap-y-2 justify-between mb-6 md:flex-row md:items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">My Medications</h2>
                    <button onClick={ () => setNewMedication(true)} className="cursor-pointer self-start inline-flex w-auto items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        <PlusIcon size={20} className="mr-2" />
                        Add New Medication
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 gap-4 p-4">
                        {medications?.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                                <PillIcon size={40} className="mb-2" />
                                <p className="text-lg font-medium">No medications found</p>
                                <p className="text-sm">Add your medications to get started</p>
                            </div>
                        )}
                        {medications?.map((medication, index) => (
                            <div key={index} className={`p-4 rounded-lg border cursor-pointer ${medication.status ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <PillIcon size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {medication.medicationInformation.name}
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {medication.medicationInformation.medicationStrength}
                                                </span>
                                            </h3>
                                            <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <ClockIcon size={16} className="mr-1" />
                                                    {medication.schedule.type}
                                                </div>
                                
                                                {medication.schedule.timeSlots.map((time, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <CalendarIcon size={16} className="mr-1" />
                                                        {time}
                                                    </div> 
                                                ))}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {medication.medicationInformation.instructions}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {medication.status ?
                                            <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                            :
                                            <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                Paused
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
}


export default Medications;