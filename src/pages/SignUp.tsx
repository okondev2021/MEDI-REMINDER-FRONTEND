import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthText from "../components/AuthText";
import AuthHeader from "../components/AuthHeader";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";
import { X } from "lucide-react"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { appDb, appAuth } from "../lib/firebase";

const SignUp = () => {

    //  navigation
    const auth = appAuth
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value })
    }

    const [authLoading, setAuthLoading] = useState(false)


    const userRegistration = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setAuthLoading(true)

        try {

            if (signUpInfo.password !== signUpInfo.confirmpassword) {
                setErrorMessage("Passwords do not match.");
                return;
            }

            // Use Firebase to create a new user with email and password
            const userCredentials = await createUserWithEmailAndPassword(auth, signUpInfo.email, signUpInfo.password);
            const user = userCredentials.user

            console.log(user)
            // add the user full_name
            

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

    const ErrorContainer = () => {
        return (
            <div className="flex justify-between items-center bg-red-200 w-[80%]  px-2 py-4 rounded-lg tab:w-full">
                <p>{errorMessage}</p>
                <X onClick={() => setErrorMessage("")} className="h-[20px] cursor-pointer aspect-square"/>
            </div>
        )
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])


    return (
        <section className="flex min-h-full">
            <AuthText />
            <div className="className= w-[50%] mobile:w-full p-[3em] tab:p-[2em]">
                <AuthHeader headingText="Create an account" paragraphText="Let's get started." />
                <form className="authForm" onSubmit={userRegistration}>
                    {errorMessage && <ErrorContainer />}
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