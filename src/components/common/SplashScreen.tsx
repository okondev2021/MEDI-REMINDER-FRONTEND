import { LinkIcon } from 'lucide-react';

const SplashScreen = () => {
  return <div className="fixed inset-0 bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse opacity-40"></div>
        <div className="relative bg-blue-600 text-white p-6 rounded-2xl transform transition-all duration-500 animate-float">
          <LinkIcon className="h-16 w-16 md:h-20 md:w-20" />
        </div>
      </div>
      <div className="text-center space-y-3 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-fade-in">
          MediRemind
        </h1>
        <p className="text-gray-600 animate-fade-in-delayed">
          Your personal medication companion
        </p>
        <div className="pt-4 animate-fade-in-delayed-more">
          <div className="w-full max-w-[200px] mx-auto">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 animate-fade-in-delayed-more">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span>Loading your health data...</span>
        </div>
      </div>
    </div>;
}

export default SplashScreen;