import { useState } from "react"
import { RefObject } from "react";
import { Eye, EyeClosed } from "lucide-react";

interface RevealProps {
    inputField: RefObject<HTMLInputElement | null>;
}

const Reveal = ({ inputField }: RevealProps) => {

    const [isHidden, setIsHidden] = useState(true)

    const password = () => {
        // using the state updater function to make use of the new state variable instead of the current state variable snapshot.
        setIsHidden((prev) => {
            const newHiddenState = !prev;
            if (inputField.current) {
                inputField.current.type = newHiddenState ? 'password' : 'text';
            }
            return newHiddenState;
        });
    }
    return (
        <div className="w-[10%] flex justify-center items-center cursor-pointer">
            {
                isHidden ?
                    <EyeClosed onClick={password} />
                    :
                    <Eye onClick={password} />
            }
        </div>
    )
}

export default Reveal