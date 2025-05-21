import { ReactNode } from "react";

interface ButtonProps {
  text: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export default function Button({ disabled, icon, text } : ButtonProps) {
  return (
    <button 
      className={`h-10 px-5 mr-1 my-2 flex items-center text-purple-500 font-bold border-2 border-purple-500 rounded-md transition-colors duration-150 focus:shadow-outline hover:bg-purple-100 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      disabled={ disabled }>
        { icon && <span className="w-4 h-4 text-purple-500 mr-2">{ icon }</span>} {/* Render icon if provided */}
        { text }
    </button>
  )
}
