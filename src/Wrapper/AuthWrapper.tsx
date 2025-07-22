import { ReactNode, useState, useEffect} from 'react';
import { useAuthContext } from '../context/AuthContextProvider';
import SplashScreen from '@/components/common/SplashScreen';


const AuthWrapper = ({ children }: { children: ReactNode }) => {


    const { loading } = useAuthContext();

    const [contextLoading, setContextLoading] = useState(loading);

    const [displaySplashScreen, setDisplaySplashScreen] = useState(true);

    useEffect(() => {
        setContextLoading(loading);
    }, [loading]); 

    return (
        (!contextLoading && !displaySplashScreen)
        ? 
             <div>
                {children}
            </div>
      
        :
            <div>
                <SplashScreen setDisplaySplashScreen={setDisplaySplashScreen} contextLoading={contextLoading} />
            </div>
    );

}

export default AuthWrapper