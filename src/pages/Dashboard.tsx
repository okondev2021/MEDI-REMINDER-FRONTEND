import { useAuthContext } from "@/context/AuthContextProvider";
import { CaregiverDashboard, PatientDashboard } from "@/components/Dashboard";

const Dashboard: React.FC = () => {
    const { userProfileInfo } = useAuthContext()

    return userProfileInfo?.userType === 'caregiver'
        ? <CaregiverDashboard />
        : <PatientDashboard />
}

export default Dashboard