import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { appAuth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export interface IAuthRouteProps {
    children: React.ReactNode;
}

const AuthWrapper: React.FunctionComponent<IAuthRouteProps> = (props) => {
    const { children } = props;
    const auth = appAuth;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
            } else {
                setLoading(false);
                navigate('/login')
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);

    if (loading) return <p>.....</p>;

    return <div>{children}</div>;

}

export default AuthWrapper