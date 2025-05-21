import { ReactNode } from "react";
import { clsx } from "clsx";

interface ButtonProps {
  text: string;
  disabled?: boolean;
  icon?: ReactNode;
  big?: boolean;
}

export default function Button({ disabled, icon, text, big = false } : ButtonProps) {
  const normalStyle = "h-10 px-5 text-purple-500 font-bold border-2 border-purple-500 hover:bg-purple-100";

  const bigStyle = "h-12 px-8 text-white font-bold text-lg border-2 border-purple-700 bg-purple-700 hover:bg-purple-800";

  return (
    <button 
      // className={` ${
      //   disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      // }`}
      className={ clsx(
        "cursor-pointer mr-1 my-2 flex items-center rounded-md transition-colors duration-150 focus:shadow-outline",
        big ? bigStyle : normalStyle,
        disabled && 'opacity-50 cursor-not-allowed'
      ) }
      disabled={ disabled }>
        { icon && <span className="w-4 h-4 text-purple-500 mr-2">{ icon }</span>} {/* Render icon if provided */}
        { text }
    </button>
  )
}
