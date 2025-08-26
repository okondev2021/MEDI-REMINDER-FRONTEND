import { useState } from "react";
import AuthText from "../components/AuthText";
import PatientLogin from "@/components/PatientLogin";
import CaregiverLogin from "@/components/CaregiverLogin";


const SignIn = () => {

    const [loginMode, setLoginMode] = useState<'normal' | 'caregiver'>('normal')
    

    return (
        <section className="flex min-h-full">
            <AuthText caregiver={loginMode === "caregiver"} />
            <div className="w-full p-[1em] md:p-[3em] md:w-[50%]">
                <div className="flex mb-6 sm:mb-8 border-b">
                    <button
                        onClick={() => setLoginMode('normal')}
                        className={`cursor-pointer py-2 sm:py-3 px-3 sm:px-4 font-medium text-sm sm:text-base flex-1 text-center ${loginMode === 'normal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Patient Login
                    </button>
                    <button
                        onClick={() => setLoginMode('caregiver')}
                        className={`cursor-pointer py-2 sm:py-3 px-3 sm:px-4 font-medium text-sm sm:text-base flex-1 text-center ${loginMode === 'caregiver' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Caregiver Login
                    </button>
                </div>
                {loginMode === 'normal' ? <PatientLogin /> : <CaregiverLogin />}
            </div>

        </section>
    )
}


export default SignIn