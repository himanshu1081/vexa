
import { useState } from "react";


const Toggle = ({ color = 'gray', size, onToggle, toggle = false }) => {
    const [isToggled, setIsToggled] = useState(toggle);
    const toggleSize = {
        height: size,
        width: size * 2
    }

    const handleChange = () => {
        const newState = !isToggled;
        setIsToggled(newState);
        if (onToggle) {
            onToggle(newState)
        }
    }

    return (
        <>
            <div
                className={`${size ? `h-[${toggleSize.height}px] w-[${toggleSize.width}px]` : "h-8 w-16"} bg-${color}-500 rounded-2xl relative
                border-2 border-purple-400/30`}
                onClick={handleChange}
            >
                <div
                    className="h-full w-2/4"
                >
                    <div
                        className={`transition-all duration-200 ease-in-out h-full w-2/4 
                        bg-${color}-700
                        rounded-full  absolute top-0 
                        border border-purple-700/30 
                        ${isToggled ? "right-0 " : "right-7.5"} `}>
                    </div>

                </div>
            </div>
        </>
    )
}
export default Toggle;