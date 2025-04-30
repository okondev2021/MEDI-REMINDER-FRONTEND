import { MedicationHistory, UpcomingMedications } from "../components/Dashboard";

const Dashboard = () => {
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Hello, Sarah!</h1>
            <p className="text-gray-600">
                Here's your medication overview for today.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MedicationHistory />
                <UpcomingMedications />
            </div>
        </div>
    );
}

export default Dashboard;