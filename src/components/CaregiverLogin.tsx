import { useState } from "react";
import { ArrowLeftIcon, MailIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { appAuth } from "@/lib/firebase";
import { toast } from "react-toastify";
import { sendSignInLinkToEmail } from "firebase/auth";

const CaregiverLogin = () => {

    const [email, setEmail] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const [isLinkSent, setIsLinkSent] = useState(false)

    const navigate = useNavigate()

    const projectDomain = import.meta.env.VITE_PROJECT_DOMAIN

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const actionCodeSettings = {
            url: `${projectDomain}/caregiver-signin-redirect`,
            handleCodeInApp: true,
        };

        try {
            if (!email) throw new Error("Please enter your email");
            await sendSignInLinkToEmail(appAuth, email, actionCodeSettings);
            localStorage.setItem("caregiverEmailForSignIn", email);
            toast.success("A login link has been sent to your email.");
            setIsLinkSent(true);
        }
        catch (err: unknown) {
            toast.error(
                typeof err === "string"
                    ? err
                    : err instanceof Error
                        ? err.message
                        : "Failed to send login link."
            );
        }
        finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="w-full">
            <>
                <button className="flex items-center gap-2 mb-4 font-semibold cursor-pointer text-redbold" onClick={() => navigate(-1)}>
                    <ArrowLeftIcon size={16} className="mr-2" />
                    <span className="text-sm sm:text-base">Back</span>
                </button>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Caregiver Sign in
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                    Welcome, please enter your email to continue
                </p>
                {!isLinkSent ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5 sm:mb-6">
                            <label
                                htmlFor="email"
                                className="block text-gray-800 font-medium mb-1 sm:mb-2 text-sm sm:text-base"
                            >
                                Email Address:
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm sm:text-base"
                                    placeholder="your@email.com"
                                    required
                                />
                                <MailIcon
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                            </div>
                            <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
                                We'll send you a secure login link to access your account
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`cursor-pointer w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            {isLoading ? 'Sending...' : 'Send Login Link'}
                        </button>
                        <div className="mt-6 sm:mt-8 text-center">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Caregiver accounts are created by patients
                            </p>
                        </div>
                    </form>
                ) :
                (
                    <div className="text-center py-6 sm:py-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <MailIcon size={24} className="text-green-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                            Check your inbox
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                            We've sent a login link to <strong>{email}</strong>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                            Click the link in the email to sign in to your caregiver account.
                            The link will expire in 10 minutes.
                        </p>
                        <button
                            onClick={() => setIsLinkSent(false)}
                            className="cursor-pointer text-sm sm:text-base text-blue-600 hover:underline font-medium"
                        >
                            Use a different email
                        </button>
                    </div>
                )}
            </>
        </div>
    )
}

export default CaregiverLogin;