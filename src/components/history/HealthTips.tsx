import { useState } from 'react';
import { BrainIcon, LightbulbIcon, HeartIcon } from 'lucide-react';
import HealthTipsModal from './HealthTipsModal';


const HealthTips = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const tips = [
    {
    icon: <HeartIcon className="h-5 w-5 text-red-500" />,
    title: 'Consistency is Key',
    message: 'Taking your medication at the same time each day helps maintain steady levels in your system, maximizing its effectiveness.'
    },
    {
    icon: <BrainIcon className="h-5 w-5 text-purple-500" />,
    title: 'Understanding Your Medications',
    message: 'Regular medication adherence reduces the risk of complications and helps maintain your overall health stability.'
    },
    {
    icon: <LightbulbIcon className="h-5 w-5 text-yellow-500" />,
    title: 'Daily Progress',
    message: 'Each dose taken is a step towards better health. Your current streak shows your commitment to your well-being.'
    }
  ];
  
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Health Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, index) => <div key={index} className="p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-gray-50 rounded-lg mr-3">{tip.icon}</div>
              <h4 className="font-medium text-gray-800">{tip.title}</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tip.message}
            </p>
          </div>)}
        </div>
        <div className="mt-4 text-center">
          <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View More Health Tips
          </button>
        </div>
      </div>
      <HealthTipsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )

}

export default HealthTips;