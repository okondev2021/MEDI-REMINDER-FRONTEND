import MedicationHistoryList from "../history/MedicationHistoryList";
import { useAuthContext } from "@/context/AuthContextProvider";
const CaregiverDashboard = () => {

    const { currentUser } = useAuthContext();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Hi {currentUser?.name ? currentUser?.name : "Caregiver"}</h1>
            <p className="text-gray-600">Here's today's medication log for the person you're caring for</p>
            <MedicationHistoryList caregiver={true} />
        </div>
    )
}

export default CaregiverDashboard;