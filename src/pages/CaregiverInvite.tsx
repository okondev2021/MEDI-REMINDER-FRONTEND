import { useState } from "react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { appAuth, appDb } from "@/lib/firebase";
import { LoaderIcon, CheckCircleIcon, XCircleIcon, User, Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";



const CaregiverInvite = () => {

    const [verificationState, setVerificationState] = useState<"verifying" | "success" | "initial" | "error">('initial');

    const [error, setError] = useState("");

    const [caregiverEmail, setCaregiverEmail] = useState("");

    const navigate = useNavigate()

    const handleCaregiverInviteLink = async () => {

        // Check if this is an email link sign-in

        setVerificationState("verifying")

        if (isSignInWithEmailLink(appAuth, window.location.href)) {

            try {
                // Complete the Firebase sign-in
                const result = await signInWithEmailLink(appAuth, caregiverEmail, window.location.href);
                const newCaregiverUser = result.user;
                // Caregiver signed in:
                // Get the invitationId from the URL
                const urlParams = new URLSearchParams(window.location.search);
                const invitationId = urlParams.get('invitationId');

                console.error(invitationId)

                if (!invitationId) {
                    setError('No invitation ID found in URL.');
                    setVerificationState("error")
                    return;
                }

                const invitationRef = doc(appDb, 'caregiverInvitations', invitationId);

                const invitationSnap = await getDoc(invitationRef);


                if (invitationSnap.exists() && invitationSnap.data().request_accepted === false) {

                    const invitationData = invitationSnap.data();

                    const patientId = invitationData.patientId;

                    // Update the invitation status to accepted

                    await updateDoc(invitationRef, {

                        request_accepted: true,

                        // acceptedByUid: newCaregiverUser.uid,

                        // acceptedAt: new Date()

                    });

                    // Establish the relationship: Add caregiver's UID to patient's record

                    const patientRef = doc(appDb, 'userProfile', patientId);

                    await updateDoc(patientRef, {

                        caregivers:{
                            uid: newCaregiverUser.uid,
                            email: newCaregiverUser.email,
                        }

                    });

                    const caregiverUserDocRef = doc(appDb, 'userProfile', newCaregiverUser.uid);

                    await setDoc(caregiverUserDocRef, {
                        userType: 'caregiver',
                        patients: {
                            uid: patientId,
                            email: invitationData.patientEmail
                        },
                        // email: newCaregiverUser.email
                    });

                    setVerificationState("success")

                }
                else {
                    setError('Invitation either does not exist or has already been accepted/expired.');
                    setVerificationState("error")
                    return;
                }
            }
            catch (error) {
                setError(typeof error === "string" ? error : (error instanceof Error ? error.message : JSON.stringify(error)))
                setVerificationState("error")
            }

        }

    }

    return (
        <div className="bg-white flex flex-col justify-center items-center min-h-screen">

            {verificationState === 'verifying' && (
                <div className="flex flex-col items-center justify-center py-12 shadow-md rounded-md w-[90%] md:w-[40%]">
                    <LoaderIcon size={64} className="animate-spin text-blue-500" />
                    <h2 className="mt-6 text-2xl font-semibold text-gray-800">Verifying your email link...</h2>
                    <p className="mt-2 text-gray-600">Please wait while we confirm your identity.</p>
                </div>
            )}

            {verificationState === 'success' && (
                <div className="flex flex-col items-center justify-center py-12 shadow-md rounded-md w-[90%] md:w-[40%]">
                    <CheckCircleIcon size={64} className="text-green-500" />
                    <h2 className="mt-6 text-2xl font-semibold text-gray-800">Email verified successfully!</h2>
                    <p className="mt-2 text-gray-600">You'll be redirected to your dashboard shortly.</p>
                </div>
            )}

            {verificationState === 'initial' && (
                <div className="flex flex-col items-center justify-center py-12 shadow-md rounded-md w-[90%] md:w-[40%]">
                    <User size={64} className=" text-gray-600" />
                    <h2
                        className="mt-6 text-2xl font-semibold text-gray-800"
                    >
                        Caregiver's Email Address
                    </h2>
                    <div className="relative mt-2 text-gray-600">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                            id="caregiver-email"
                            type="email"
                            value={caregiverEmail}
                            onChange={(e) => setCaregiverEmail(e.target.value)}
                            className={`pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300'}`}
                            placeholder="example@email.com"
                            required
                        />
                    </div>
                    <div className="flex mt-3">
                        <button
                            onClick={handleCaregiverInviteLink}
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            )}

            {verificationState === 'error' && (
                <div className="flex flex-col items-center justify-center py-12 shadow-md rounded-md w-[90%] md:w-[40%]">
                    <XCircleIcon size={64} className="text-red-500" />
                    <h2 className="mt-6 text-2xl font-semibold text-gray-800">Verification Failed</h2>
                    <p className="text-center">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 mt-6 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Return to Sign In
                    </button>
                </div>
            )}

        </div>
    )
}


export default CaregiverInvite;