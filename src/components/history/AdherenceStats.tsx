import { TrophyIcon, FlameIcon, DownloadIcon, ShareIcon, AwardIcon } from 'lucide-react';

const AdherenceStats = () => {

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* stats 1 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg cursor-pointer">
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
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg cursor-pointer">
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
        {/* stats 3 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg cursor-pointer">
          <div className="flex items-center mb-2">
            <AwardIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-800">Achievements</h3>
          </div>
          <div className="flex items-center mb-2">
            <div className="bg-purple-200 p-1 rounded-full">
              <div className="bg-purple-600 h-8 w-8 rounded-full flex items-center justify-center">
                <FlameIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-800">
                Consistency Master
              </h4>
              <p className="text-xs text-gray-600">7 day streak achieved</p>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-purple-600">
              2 of 5 badges earned
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="flex items-center cursor-pointer bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm mr-2 hover:bg-gray-50">
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download Report
        </button>
        <button className="flex items-center cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700">
          <ShareIcon className="h-4 w-4 mr-2" />
          Share Progress
        </button>
      </div>
    </div>
  )
}

export default AdherenceStats;