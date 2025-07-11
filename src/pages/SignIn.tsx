import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthText from "../components/AuthText";
import AuthHeader from "../components/AuthHeader";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { appAuth } from "../lib/firebase";
import ErrorContainer from "../components/ErrorContainer";
import { requestNotificationPermission } from "@/lib/requestNotificationPermission";

const SignIn = () => {

    // Initialize navigation
    const navigate = useNavigate();

    const passwordInput = useRef(null)

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value })
    }

    const [errorMessage, setErrorMessage] = useState("")

    const [authLoading, setAuthLoading] = useState(false)

    const userLogin = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setAuthLoading(true)

        try {
            const userCredentials = await signInWithEmailAndPassword(appAuth, loginInfo.email, loginInfo.password);

            if (userCredentials.user) {
                await requestNotificationPermission(userCredentials.user.uid)
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
                <AuthHeader headingText="Sign in" paragraphText="Welcome back, kindly enter your login details" />
                <form className="authForm" onSubmit={userLogin} method="post">
                    {errorMessage && <ErrorContainer errorMessage={errorMessage} setErrorMessage={setErrorMessage} />}
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="email">Email Address:</label>
                        <input className="authInput" onChange={handleChange} name="email" id="email" type="email" required value={loginInfo.email} />
                    </div>
                    <div className="inputContainer">
                        <label className="authLabel" htmlFor="password">Password:</label>
                        <div className="authPasswordContainer">
                            <input ref={passwordInput} className="authPasswordInput" onChange={handleChange} name="password" id="password" type="password" required value={loginInfo.password} />
                            <Reveal inputField={passwordInput} />
                        </div>
                    </div>
                    <div>
                        <button className="authSubmitInput" type="submit" disabled={authLoading}>
                            {authLoading ? <Loader /> : "Sign in"}
                        </button>
                    </div>
                </form>
                <div className="authFooterContainer">
                    <p className="text-center">Don't have an account? <Link className="authFooterLink" to="/signup">Create a free account</Link></p>
                </div>
            </div>
        </section>
    )
}


export default SignIn