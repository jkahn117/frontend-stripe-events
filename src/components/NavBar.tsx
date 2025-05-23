import { UserCircleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function NavBar() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              {/* <img className="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" /> */}
              <VideoCameraIcon className="size-10 text-purple-500 mr-4" />
              <h1 className="text-2xl text-purple-500 font-extrabold">
                My Live Stream
              </h1>
            </div>
          </div>
          {/* Right */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3">
              <div>
                <button type="button" className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="size-8 text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}