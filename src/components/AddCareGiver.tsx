import React, { useState } from 'react'
import { X, Mail, CheckCircle } from 'lucide-react'
import { sendSignInLinkToEmail } from "firebase/auth";
import { appDb, appAuth } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from "firebase/firestore"; 
import { useAuthContext } from '@/context/AuthContextProvider';


interface CaregiverModalProps {
    onClose: () => void
}

const AddCareGiver = ({ onClose }: CaregiverModalProps) => {

    const { currentUser, userProfileInfo } = useAuthContext();

    const projectDomain = import.meta.env.VITE_PROJECT_DOMAIN
    
    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(false);

    const [signUpErr, setSignUpErr] = useState("")

    const [isSubmitted, setIsSubmitted] = useState(false)

    const [isEmailValid, setIsEmailValid] = useState(true)

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSignUpErr("");

        if (!validateEmail(email)) {
            setIsEmailValid(false);
            setLoading(false);
            return;
        }

        setIsEmailValid(true);

        if (currentUser?.email) {
            try {
                const invitationId = crypto.randomUUID();
                const invitationRef = doc(appDb, 'caregiverInvitations', invitationId);

                alert(currentUser?.email)

                await setDoc(invitationRef, {
                    caregiverEmail: email,
                    patientId: currentUser?.uid,
                    patientEmail: currentUser?.email,
                    request_accepted: false,
                    createdAt: Timestamp.fromDate(new Date()),
                    expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
                });

                const actionCodeSettings = {
                    url: `${projectDomain}/caregiver-invite?invitationId=${invitationId}`,
                    handleCodeInApp: true,
                };

                await sendSignInLinkToEmail(appAuth, email, actionCodeSettings);

                console.log(`Invitation sent to ${email} with ID: ${invitationId}`);
                localStorage.setItem('caregiverEmailForSignIn', email);
                setIsSubmitted(true);
            }

            catch (err: unknown) {
                setIsEmailValid(false);
                setSignUpErr(
                    typeof err === "string"
                        ? err
                        : err instanceof Error
                            ? err.message
                            : "An error occurred"
                );
            }

            finally {
                setLoading(false);
            }
        }

};


    return (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        {userProfileInfo?.caregivers ? "Information" :  isSubmitted ? 'Invitation Sent' : 'Add a Caregiver'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
                {userProfileInfo?.caregivers ?
                    (
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Agent on the Case 🕵️‍♀️
                            </h3>
                            <p className='text-gray-500 mb-6'>
                                Your caregiver is already undercover, ensuring your reminders arrive right on schedule. No need to send in reinforcements — the mission is in progress.
                            </p>
                        </div>
                    )
                    :
                    (
                        <div className="p-6">
                            {!isSubmitted ?
                                (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <label
                                                htmlFor="caregiver-email"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Caregiver's Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    id="caregiver-email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={`pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isEmailValid ? 'border-red-500' : 'border-gray-300'}`}
                                                    placeholder="example@email.com"
                                                    required
                                                />
                                            </div>
                                            {!isEmailValid && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    Please enter a valid email address
                                                </p>
                                            )}
                                            {signUpErr && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {signUpErr}
                                                </p>
                                            )}
                                            <p className="mt-2 text-sm text-gray-500">
                                                Your caregiver will receive an email invitation to connect to
                                                your MediRemind account.
                                            </p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                            >
                                                {loading ? "Processing..." : "Send Invitation"}
                                            </button>
                                        </div>
                                    </form>
                                )
                                :
                                (
                                  <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Invitation Sent!
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        We've sent an invitation to <strong>{email}</strong>. Please
                                        inform them to check their email and accept the invitation.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                    >
                                        Done
                                    </button>
                                </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}


export default AddCareGiver;