import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthText from "../components/AuthText";
import AuthHeader from "../components/AuthHeader";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";
import { X } from "lucide-react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { appAuth } from "../lib/firebase";

const SignIn = () => {


    // Initialize Firebase authentication and navigation
    const auth = appAuth;

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

        console.log("running login")

        try {
            console.log("running actual code 1")
            // Use Firebase to sign in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password);
            const user = userCredential.user;

            console.log("Logged in as:", user.email);
            navigate('/');

            console.log("running actual code 1")
        }
        catch (error) {

            console.log("error occured");
            
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


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])


    const ErrorContainer = () => {
        return (
            <div className="flex justify-between items-center bg-red-200 w-[80%]  px-2 py-4 rounded-lg tab:w-full">
                <p>{errorMessage}</p>
                <X onClick={() => setErrorMessage("")} className="h-[20px] cursor-pointer aspect-square" />
            </div>
        )
    }
    

    return (
        <section className="flex min-h-full">
            <AuthText />
            <div className="className= w-[50%] mobile:w-full p-[3em] tab:p-[2em]">
                <AuthHeader headingText="Sign in" paragraphText="Welcome back, kindly enter your login details" />
                <form className="authForm" onSubmit={userLogin} method="post">
                    {errorMessage && <ErrorContainer />}
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