import { requestNotificationPermission } from "@/lib/requestNotificationPermission";
import { useAuthContext } from '../context/AuthContextProvider';

const Notification = () => {

    const { currentUser, userProfileInfo } = useAuthContext();

    requestNotificationPermission(currentUser?.uid || "");


    return (
        <div>
            <h1>Hello Notification</h1>
            <p>{userProfileInfo?.fcmToken}</p>
        </div>
    )
}

export default Notification;