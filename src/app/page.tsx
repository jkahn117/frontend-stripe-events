import { BellIcon, HandThumbUpIcon, ShareIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/outline";
import Button from "./components/Button";
import VideoPlayer from "./components/VideoPlayer";
import Tips from "./components/Tips";

export default function Home() {
  return (
    <div className="w-full h-160 min-h-120">
      <VideoPlayer />

      <Tips />
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Title, Controls */}
          <div className="mt-4 mb-2">
            <h2 className="text-4xl font-extrabold pt-8 pb-4">
              My Video
            </h2>
          </div>
        
          <div className="grid grid-flow-col gap-4 grid-cols-[60%]">
            <div className="flex items-center justify-start"> {/* interactive controls */}
              <span className="text-md text-slate-500 mr-8 flex">
                <EyeIcon className="size-6 mr-2" /> 321 watching
              </span>

              <div className="inline-flex ml-auto">
                <Button text="Like" icon={ <HandThumbUpIcon /> } />
                <Button text="Share" icon={ <ShareIcon /> } />
                <Button text="Subscribe" icon={ <BellIcon /> } />
              </div>
            </div>
            {/* Description */}
            <div className="text-sm">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            {/* Suggested content */}
            <div className="w-full h-full p-2 row-span-4 border-l-1 border-slate-400 bg-amber-50">
              <div>
                <h3>Suggested streams</h3>
              </div>
            </div>  
          </div>
        </div>
    </div>
  );
}
