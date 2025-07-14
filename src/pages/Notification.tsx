import { requestNotificationPermission } from "@/lib/requestNotificationPermission";

const Notification = () => {

    requestNotificationPermission();

    return (
        <div>
            <h1>Hello Notification</h1>
        </div>
    )
}

export default Notification;