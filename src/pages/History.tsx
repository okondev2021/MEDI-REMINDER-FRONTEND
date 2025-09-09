import { useState } from 'react';
import AdherenceStats from '../components/history/AdherenceStats';
import MedicationHistoryList  from '../components/history/MedicationHistoryList';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { useAuthContext } from '@/context/AuthContextProvider';


const History = () => {

    const isLoading = false;

    const { currentUser } = useAuthContext();

    const [hasMedicationHistory, setHasMedicationHistory] = useState(false);

    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <SkeletonLoader type="line" count={2} />
                </div>
                <div className="mb-6">
                    <SkeletonLoader type="card" />
                </div>
                <div className="mb-6">
                    <SkeletonLoader type="card" />
                </div>
                <SkeletonLoader type="card" />
            </div>
        )
    }
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Medication History
                </h2>
                <p className="text-gray-600">
                    Track your medication adherence and see your progress over time.
                </p>
            </div>
            {hasMedicationHistory && <AdherenceStats userId={currentUser?.uid || ""} />}
            <MedicationHistoryList setHasMedicationHistory={setHasMedicationHistory} />
        </div>
    )
}

export default History;