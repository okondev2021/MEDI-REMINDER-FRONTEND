import { useState, useEffect, useMemo } from 'react';
import { PlusIcon, PillIcon, ClockIcon, CalendarIcon, Trash2Icon } from 'lucide-react';
import AddMedication from '../components/AddMedication';
import { useAuthContext } from '../context/AuthContextProvider';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { MedicationProps } from '../lib/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { appDb } from '../lib/firebase';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';

const Medications = () => {
    const { currentUser } = useAuthContext();

    const medicationCollectionRef = useMemo(
        () =>
            currentUser?.uid &&
            collection(appDb, 'userProfile', currentUser?.uid, 'medications'),
        [appDb, currentUser?.uid]
    );

    const [isLoading, setIsLaoding] = useState(false);
    const [newMedication, setNewMedication] = useState(false);
    const [medications, setMedications] = useState<MedicationProps[]>();

    const getMedications = async () => {
        if (medicationCollectionRef) {
            const medicationResponse = await getDocs(medicationCollectionRef);
            const medicationList = medicationResponse.docs.map((medication) => ({
                ...(medication.data() as MedicationProps),
                id: medication.id,
            }));

            setMedications(medicationList);
        } else {
            setMedications([]);
        }
    };

    const deleteMedication = async (id: string) => {
        setIsLaoding(true);

        if (!currentUser?.uid) return;

        try {
            const dosesRef = collection(
                appDb,
                'userProfile',
                currentUser.uid,
                'medications',
                id,
                'doses'
            );
            const snapshot = await getDocs(dosesRef);

            const batchDeletes = snapshot.docs.map((d) => deleteDoc(d.ref));
            await Promise.all(batchDeletes);

            const medicationDoc = doc(
                appDb,
                'userProfile',
                currentUser.uid,
                'medications',
                id
            );
            await deleteDoc(medicationDoc);

            setMedications((prevMedications) =>
                prevMedications?.filter((medication) => medication.id !== id)
            );

            toast.success('Medication deleted successfully');
        } catch (error) {
            const message =
                error instanceof FirebaseError
                    ? error.message
                    : 'An unexpected error occurred, try again';
            getMedications();
            toast.error(message);
        } finally {
            setIsLaoding(false);
        }
    };

    useEffect(() => {
        getMedications();
    }, [newMedication]);

    return newMedication ? (
        <AddMedication setNewMedication={setNewMedication} />
    ) : (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-y-3 justify-between mb-6 md:flex-row md:items-center">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    My Medications
                </h2>
                <button
                    onClick={() => setNewMedication(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition"
                >
                    <PlusIcon size={20} className="mr-2" />
                    Add New Medication
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
                {/* Loader */}
                {(!medications || isLoading) && (
                    <LoadingSpinner
                        label={`${isLoading ? 'Deleting Medication' : 'Loading Your Medications'
                            }`}
                        size="lg"
                    />
                )}

                {/* Empty state */}
                {medications?.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <PillIcon size={50} className="mb-3 text-blue-400" />
                        <p className="text-lg font-medium">No medications found</p>
                        <p className="text-sm mb-4">
                            Add your medications to get started
                        </p>
                        <button
                            onClick={() => setNewMedication(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            <PlusIcon size={18} className="mr-2" />
                            Add Medication
                        </button>
                    </div>
                )}

                {/* Medications grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {!isLoading &&
                        medications?.map((medication, index) => (
                            <div
                                key={index}
                                className={`relative flex flex-col p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition ${medication.status ? '' : 'opacity-80'
                                    }`}
                            >
                                {/* Status badge */}
                                <span
                                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${medication.status
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {medication.status ? 'Active' : 'Paused'}
                                </span>

                                <div className="flex items-start space-x-4">
                                    {/* Icon */}
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <PillIcon size={28} className="text-blue-600" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {medication.medicationInformation.name}
                                            <span className="ml-2 text-sm text-gray-500 font-normal">
                                                {medication.medicationInformation.medicationStrength}
                                            </span>
                                        </h3>

                                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <ClockIcon size={16} className="mr-1 text-gray-400" />
                                                {medication.schedule.type}
                                            </div>
                                            {medication.schedule.timeSlots.map((time, i) => (
                                                <div key={i} className="flex items-center">
                                                    <CalendarIcon
                                                        size={16}
                                                        className="mr-1 text-gray-400"
                                                    />
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={() => deleteMedication(medication.id)}
                                    className="absolute bottom-3 right-3 text-gray-400 hover:text-red-600 transition"
                                    title="Delete"
                                >
                                    <Trash2Icon size={20} />
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Medications;
