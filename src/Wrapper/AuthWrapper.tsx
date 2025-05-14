import { ReactNode } from 'react';
import { useAuthContext } from '../context/AuthContextProvider';


const AuthWrapper = ({ children }: { children: ReactNode }) => {


    const { loading } = useAuthContext();

    return (
        loading
        ? 
            <p>.....</p>
        :
            <div>{children}</div>
    );

}

export default AuthWrapper