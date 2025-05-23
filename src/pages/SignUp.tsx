import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthText from "../components/AuthText";
import AuthHeader from "../components/AuthHeader";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { appAuth, appDb } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';
import ErrorContainer from "../components/ErrorContainer";


const SignUp = () => {

    //  navigation
    const navigate = useNavigate();
    
    const passwordInput1 = useRef<HTMLInputElement>(null)

    const passwordInput2 = useRef<HTMLInputElement>(null)

    const [signUpInfo, setSignUpInfo] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmpassword: "",
    })

    const [errorMessage, setErrorMessage] = useState("")

    const [authLoading, setAuthLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value })
    }

    
    const userRegistration = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setAuthLoading(true)

        try {

            if (signUpInfo.password !== signUpInfo.confirmpassword) {
                setErrorMessage("Passwords do not match.");
                return;
            }

            const userCredentials = await createUserWithEmailAndPassword(appAuth, signUpInfo.email, signUpInfo.password);

            const user = userCredentials.user

            if (user) {
                await updateProfile(user, {
                    displayName: signUpInfo.full_name,
                });

                await setDoc(doc(appDb, "userProfile", user.uid), {
                    userType: "patient",
                    dateJoined: Timestamp.now(),
                    // user settings
                    healthConditions: ["cough", "polio"],
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    pushNotifications: true,
                    emailNotifications: true,
                    notificationReminderTiming: 5, // minutes
                    birthDate: "2000-01-01",
                });
            }

            navigate('/');


        }
        catch (error) {

            const message = error instanceof FirebaseError ? error.message : "An unexpected error occurred";

            setErrorMessage(message);

            setTimeout(() => {
                setErrorMessage("")
            }, 4000)
        }

        finally {
            setAuthLoading(false)
        }
    }

    return (
        <section className="flex min-h-full">
            <AuthText />
            <div className="w-full p-[1em] md:p-[3em] md:w-[50%]">
                <AuthHeader headingText="Create an account" paragraphText="Let's get started." />
                <form className="authForm" onSubmit={userRegistration}>
                    {errorMessage && <ErrorContainer errorMessage={errorMessage} setErrorMessage={setErrorMessage} />}
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="fullName">Full Name:</label>
                        <input className="authInput" onChange={handleChange} id="fullName" type="text" name="full_name" required />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="email">Email Address:</label>
                        <input className="authInput" onChange={handleChange} id="email" type="email" name="email" required />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="password">Password:</label>
                        <div className="authPasswordContainer">
                            <input ref={passwordInput1} className="authPasswordInput" onChange={handleChange} name="password" id="password" type="password" required />
                            <Reveal inputField={passwordInput1} />
                        </div>
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="confirmpassword">Confirm Password:</label>
                        <div className="authPasswordContainer">
                            <input ref={passwordInput2} className="authPasswordInput" onChange={handleChange} id="confirmpassword" type="password" name="confirmpassword" required />
                            <Reveal inputField={passwordInput2} />
                        </div>
                    </div>
                    <div>
                        <button className="authSubmitInput " type="submit" disabled={authLoading}>
                            {authLoading ? <Loader /> : "Create an account"}
                        </button>
                    </div>
                </form>
                <div className="authFooterContainer">
                    <p className="text-center">Already have an account? <Link className="authFooterLink" to="/login">Sign in</Link></p>
                </div>
            </div>
        </section>
    )
}


export default SignUp