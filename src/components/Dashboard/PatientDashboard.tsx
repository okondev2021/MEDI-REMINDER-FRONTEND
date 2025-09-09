import MedicationHistory from "./MedicationHistory";
import UpcomingMedications from "./UpcomingMedications";
import { useAuthContext } from "@/context/AuthContextProvider";

const PatientDashboard = () => {
    const { currentUser } = useAuthContext();

    return (
        <div className="space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Hello, {currentUser?.name.split(" ")[0]} 👋
                </h1>
                <p className="mt-1 text-base text-gray-600">
                    Here’s your medication overview for today.
                </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <MedicationHistory />
                <UpcomingMedications />
            </div>
        </div>
    );
};

export default PatientDashboard;
