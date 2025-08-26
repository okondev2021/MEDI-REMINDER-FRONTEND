import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from 'lucide-react'

const AuthHeader = ({ headingText, paragraphText }: { headingText: string, paragraphText : string}) => {

    const navigate = useNavigate()

    return (
        <header>
            <button className="flex items-center gap-2 mb-4 font-semibold cursor-pointer text-redbold" onClick={() => navigate(-1)}>
                <ArrowLeftIcon size={16} className="mr-2" />
                <p>Back</p>
            </button>
            <h2 className="text-5xl font-medium text-black001 tab:text-3xl">{headingText}</h2>
            <p className="mt-2 text-lg font-normal text-grayBlue">{paragraphText}</p>
        </header>
    )
}


export default AuthHeader