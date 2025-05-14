import React, { SetStateAction } from "react";
import { X } from "lucide-react"

const ErrorContainer = ({ errorMessage, setErrorMessage }: { errorMessage: string; setErrorMessage: React.Dispatch<SetStateAction<string>>}) => {
    return (
        <div className="flex justify-between items-center bg-red-200 w-[80%]  px-2 py-4 rounded-lg tab:w-full">
            <p>{errorMessage}</p>
            <X onClick={() => setErrorMessage("")} className="h-[20px] cursor-pointer aspect-square" />
        </div>
    )
}


export default ErrorContainer