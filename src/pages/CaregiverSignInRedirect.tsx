import { useEffect, useState } from "react";
import {
    isSignInWithEmailLink,
    signInWithEmailLink,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { appDb, appAuth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const CaregiverSignInRedirect = () => {
    const [status, setStatus] = useState("Verifying...");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyLogin = async () => {
            if (isSignInWithEmailLink(appAuth, window.location.href)) {
                let email = localStorage.getItem("caregiverEmailForSignIn");
                if (!email) {
                    email = window.prompt("Please confirm your email");
                }

                try {
                    const result = await signInWithEmailLink(
                        appAuth,
                        email!,
                        window.location.href
                    );
                    localStorage.removeItem("caregiverEmailForSignIn");

                    // Verify userType is caregiver
                    const caregiverRef = doc(appDb, "userProfile", result.user.uid);
                    const caregiverSnap = await getDoc(caregiverRef);

                    if (!caregiverSnap.exists() || caregiverSnap.data().userType !== "caregiver") {
                        throw new Error("You are not authorized as a caregiver.");
                    }

                    setStatus("Login successful! Redirecting...");
                    setTimeout(() => navigate("/"), 2000);
                } catch (error: any) {
                    setStatus(`Login failed: ${error.message}`);
                }
            }
            else {
                setStatus("Invalid login link.");
            }
        };

        verifyLogin();
    }, [appAuth, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>{status}</p>
        </div>
    );
};

export default CaregiverSignInRedirect;
