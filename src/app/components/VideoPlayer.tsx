import { PlayCircleIcon } from '@heroicons/react/24/solid';

export default function VideoPlayer() {
  return (
    <div className="h-full w-full bg-gray-200 border-t-2 border-slate-300 flex items-center justify-center">
      <PlayCircleIcon className="mx-auto size-1/3 text-slate-400 cursor-pointer" />
    </div>
  );
}
