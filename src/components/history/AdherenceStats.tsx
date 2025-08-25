import { TrophyIcon, FlameIcon, DownloadIcon } from 'lucide-react';

const AdherenceStats = () => {

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between w-full gap-4">
        {/* stats 1 */}
        <div className="bg-gradient-to-br w-full from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrophyIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-800">
              Adherence Rate
            </h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-blue-700">92%</span>
            <span className="ml-2 text-sm text-green-600">+2% this week</span>
          </div>
          <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>
        {/* stats 2 */}
        <div className="bg-gradient-to-br w-full from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FlameIcon className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-800">
              Current Streak
            </h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-orange-700">7 days</span>
            <span className="ml-2 text-xs text-orange-600">Keep it up!</span>
          </div>
          <div className="mt-2 flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <div key={day} className="flex-1 h-6 bg-orange-200 rounded-sm flex items-center justify-center">
                <span className="text-xs font-medium text-orange-700">
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="mt-4 flex justify-end">
        <button className="flex items-center cursor-pointer bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm mr-2 hover:bg-gray-50">
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download Report
        </button>
      </div> */}
    </div>
  )
}

export default AdherenceStats;