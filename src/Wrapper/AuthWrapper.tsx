import { ReactNode } from 'react';
import { useAuthContext } from '../context/AuthContextProvider';
import SplashScreen from '@/components/common/SplashScreen';


const AuthWrapper = ({ children }: { children: ReactNode }) => {


    const { loading } = useAuthContext();

    return (
        loading
        ? 
            <div>
                <SplashScreen />
            </div>
        :
            <div>
                {children}
            </div>
    );

}

export default AuthWrapper