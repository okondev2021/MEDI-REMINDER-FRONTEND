import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { appAuth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface contextProps {
    loading: boolean;
    currentUser: {
        name: string;
        uid: string;
        email: string;
    }
}

export const AuthContext = createContext<contextProps | undefined>(undefined);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(appAuth, (user) => {
            if (user) {
                setLoading(false);
            } else {
                setLoading(false);
                navigate('/login')
            }
        });

        return () => unsubscribe();

    }, [appAuth, navigate]);
    
    const contextValue: contextProps = {
        loading: loading,
        currentUser: {
            name: appAuth?.currentUser?.displayName ?? "",
            email: appAuth?.currentUser?.email ?? "",
            uid: appAuth?.currentUser?.uid ?? ""
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