
interface ProgressBarProps {
  text: string;
  value?: number;
  max?: number;
}

export default function ProgressBar({ text, value = 0, max = 100 }: ProgressBarProps) {
  return (
    <div className="relative w-full px-4">
      {/* Text + value */}
      <div className="flex mb-1 items-center justify-between w-full">
        <div className="text-xs font-semibold uppercase">
          <span>{ text }</span>
        </div>
        <div>
          <span className="text-xs font-semibold inline-flex ml-auto pl-4 uppercase">
            { value / max * 100 }%
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-400">
        <div style={{ width: `${(value / max) * 100}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-700">
        </div>
      </div>

    </div>
  )
}
