import { HandThumbUpIcon, ShareIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/outline";
import Button from "./components/Button";
import VideoPlayer from "./components/VideoPlayer";

export default function Home() {
  return (
    <div className="w-full h-160 min-h-120">
      <VideoPlayer />

      {/* Tip */}
      <div className="border-1 border-purple-300 bg-purple-200">
        <div className="container h-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-start">
          <Button text="Tip!" />
          
          <div className="">
            Thanks to...

            <div className="w-120 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
              <ul className="animate-infinite-scroll flex items-center justify-center md:justify-start [&_li]:mx-8 [&_li]:text-nowrap [&_img]:max-w-none">
                <li>Eric J. - $50</li>
                <li>J. Bob - $50</li>
                <li>Efewf. - $50</li>
                <li>E3t32tJ. - $50</li>
                <li>Er23t2. - $50</li>
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
              </ul>
              <ul className="animate-infinite-scroll flex items-center justify-center md:justify-start [&_li]:mx-8 [&_li]:text-nowrap [&_img]:max-w-none" aria-hidden="true">
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
                <li>Eric J. - $50</li>
              </ul>
            </div>

          </div>
        </div>  
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Title, Controls */}
          <div className="mt-4 mb-2">
            <h2 className="text-4xl font-extrabold pt-8 pb-4">
              My Video
            </h2>
          </div>
        
          <div className="grid grid-flow-col gap-4 grid-cols-[60%]">
            <div className="flex items-center justify-start"> {/* interactive controls */}
              <Button text="Like" icon={ <HandThumbUpIcon /> } />
              <Button text="Share" icon={ <ShareIcon /> } />

              <span className="text-md text-slate-400 ml-4 flex">
                <EyeIcon className="size-6 mr-2" /> 321 watching
              </span>
            </div>
            {/* Description */}
            <div className="text-sm">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            {/* Suggested content */}
            <div className="w-full h-full row-span-2 bg-slate-300">
              suggested
            </div>  
          </div>
        </div>
    </div>
  );
}
