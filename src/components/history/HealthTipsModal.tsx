import { useState } from 'react';
import { Modal } from '../common/Modal';
import { HeartIcon, BrainIcon, LeafIcon, PillIcon, ActivityIcon, BookmarkIcon, ShareIcon, SearchIcon } from 'lucide-react';


const HealthTipsModal = ({ isOpen, onClose }: { isOpen: boolean;  onClose: () => void}) => {
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'all',
      name: 'All Tips',
      icon: <HeartIcon className="h-4 w-4" />
    },
    {
      id: 'medication',
      name: 'Medication',
      icon: <PillIcon className="h-4 w-4" />
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      icon: <ActivityIcon className="h-4 w-4" />
    },
    {
      id: 'wellness',
      name: 'Wellness',
      icon: <LeafIcon className="h-4 w-4" />
    }
  ];
  const tips = [
    {
      category: 'medication',
      icon: <PillIcon className="h-6 w-6 text-blue-500" />,
      title: 'Understanding Your Paracetamol Schedule',
      content: 'Taking Paracetamol consistently at scheduled times ensures optimal pain relief. The recommended 4-6 hour gap between doses helps maintain steady medication levels in your system.',
      tags: ['Paracetamol', 'Pain Management'],
      importance: 'high'
    },
    {
      category: 'lifestyle',
      icon: <ActivityIcon className="h-6 w-6 text-green-500" />,
      title: 'Exercise and Pain Management',
      content: 'Regular gentle exercise can help manage chronic pain naturally. Consider activities like walking or swimming, which complement your pain medication routine.',
      tags: ['Exercise', 'Pain Relief'],
      importance: 'medium'
    },
    {
      category: 'wellness',
      icon: <LeafIcon className="h-6 w-6 text-emerald-500" />,
      title: 'Dietary Considerations with Your Medication',
      content: 'Some foods can interact with your medications. Learn about timing your meals around your medication schedule for optimal effectiveness.',
      tags: ['Diet', 'Medication'],
      importance: 'high'
    },
    {
      category: 'medication',
      icon: <BrainIcon className="h-6 w-6 text-purple-500" />,
      title: 'Building a Medication Routine',
      content: 'Create a consistent daily routine for taking your medications. Link it to daily activities like breakfast or bedtime to help remember.',
      tags: ['Routine', 'Adherence'],
      importance: 'high'
    }
  ];
  const filteredTips = tips.filter(tip => (activeCategory === 'all' || tip.category === activeCategory) && (searchQuery === '' || tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || tip.content.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Health Insights
        </h2>
        <p className="text-gray-600 mb-6">
          Personalized health tips based on your medications and wellness
          journey.
        </p>
        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" placeholder="Search health tips..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
          {filteredTips.map((tip, index) => <div key={index} className="bg-white rounded-lg border border-gray-100 p-6 hover:border-blue-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start">
              <div className="p-3 bg-gray-50 rounded-lg mr-4">{tip.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    {tip.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200">
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tip.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tip.tags.map((tag, tagIndex) => <span key={tagIndex} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {tag}
                  </span>)}
                  {tip.importance === 'high' && <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    High Priority
                  </span>}
                </div>
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </Modal>
  )
}


export default HealthTipsModal;