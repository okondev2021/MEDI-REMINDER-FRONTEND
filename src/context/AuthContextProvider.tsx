import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { appAuth, appDb } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { UserProfile } from "@/lib/types";



interface contextProps {
    loading: boolean;
    currentUser: {
        name: string;
        uid: string;
        email: string;
    } | null,
    userProfileInfo: UserProfile | null;
}

export const AuthContext = createContext<contextProps | undefined>(undefined);


const AuthContextProvider = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<{ name: string; uid: string; email: string } | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile>()


    const getUserProfile = async (uid: string) => {
        // get userprofile information
        const userProfileDocRef = doc(appDb, "userProfile", uid);
        const userProfile = await getDoc(userProfileDocRef);

        if (!userProfile.exists()) {
            return;
        }

        return userProfile.data();
    }

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(appAuth, async (user) => {
            if (user && user.uid) {
                setLoading(false);

                setCurrentUser({
                    name: user.displayName ?? "",
                    uid: user.uid,
                    email: user.email ?? ""
                });

                if (appAuth.currentUser) {
                    const profileGottent = await getUserProfile(user.uid)

                    if (profileGottent) {
                        setUserProfile(profileGottent as UserProfile);
                    }
                }

            }
            else {
                setLoading(false);
                navigate("/login");
            }
        });


        // Cleanup subscription on unmount
        // This is important to prevent memory leaks
        return () => unsubscribe();

    }, [appAuth, navigate, appDb]);

    const contextValue: contextProps = {
        loading,
        currentUser,
        userProfileInfo: {
            birthDate: userProfile?.birthDate ?? "",
            dateJoined: userProfile?.dateJoined ?? Timestamp.now(),
            emailNotification: userProfile?.emailNotification ?? false,
            healthConditions: userProfile?.healthConditions ?? [],
            notificationReminderTiming: userProfile?.notificationReminderTiming ?? 0,
            pushNotification: userProfile?.pushNotification ?? false,
            timezone: userProfile?.timezone ?? "",
            userType: userProfile?.userType ?? "",
            fcmToken: userProfile?.fcmToken ?? "",
        }
    }


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthContextProvider;


export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }
    return context;
};