import { useState } from 'react';
import AdherenceStats  from '../components/history/AdherenceStats';
import MedicationHistoryList  from '../components/history/MedicationHistoryList';
import { SkeletonLoader } from '../components/common/SkeletonLoader';


const History = () => {

    const [isLoading, setIsLoading] = useState(false);

    // setIsLoading(false);


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
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Medication History
                </h2>
                <p className="text-gray-600">
                    Track your medication adherence and see your progress over time.
                </p>
            </div>
            <AdherenceStats />
            {/* <HealthTips /> */}
            <MedicationHistoryList />
        </div>
    )
}

export default History;