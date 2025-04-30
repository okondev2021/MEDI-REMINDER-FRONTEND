import { HelpCircleIcon, BookOpenIcon, PhoneIcon, MessageCircleIcon, MailIcon, SearchIcon } from 'lucide-react';

const HelpPage = () => {

    const faqs = [
        {
            question: 'How do I add a new medication?',
            answer: "Click the 'Add Medication' button from either the Dashboard or Schedule page. Fill in the medication details, including name, dosage, and schedule, then click 'Add Medication' to save."
        }, {
            question: 'How do notifications work?',
            answer: 'Notifications are sent based on your medication schedule. You can customize notification preferences in Settings, including push notifications and email reminders.'
        }, {
            question: 'Can I edit my medication schedule?',
            answer: 'Yes, click the edit icon next to any medication in your schedule or medications list to modify details, timing, or instructions.'
        }, {
            question: 'How do I mark medications as taken?',
            answer: "When you receive a medication reminder, click 'Mark as Complete' in the notification. You can also mark medications as taken from the Dashboard."
        }, {
            question: 'What should I do if I miss a dose?',
            answer: 'If you miss a dose, consult your healthcare provider for guidance. Do not take double doses unless specifically instructed by your healthcare provider.'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HelpCircleIcon size={24} className="text-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-800">Help Center</h2>
            </div>
            {/* Search */}
            <div className="mb-8">
                <div className="relative">
                    <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search for help..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <BookOpenIcon size={20} className="text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900 mb-1">User Guide</h3>
                    <p className="text-sm text-gray-600">
                        Detailed instructions for using MediRemind
                    </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <MessageCircleIcon size={20} className="text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900 mb-1">Live Chat</h3>
                    <p className="text-sm text-gray-600">Chat with our support team</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <PhoneIcon size={20} className="text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900 mb-1">Contact Support</h3>
                    <p className="text-sm text-gray-600">Get help via phone or email</p>
                </div>
            </div>
            {/* FAQs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">
                        Frequently Asked Questions
                    </h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {faqs.map((faq, index) => (
                        <div key={index} className="p-6">
                            <h4 className="text-base font-medium text-gray-900 mb-2">
                                {faq.question}
                            </h4>
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Contact Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">
                        Still Need Help?
                    </h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <MailIcon size={20} className="text-gray-400 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">Email Support</p>
                                <p className="text-sm text-gray-600">support@mediremind.com</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <PhoneIcon size={20} className="text-gray-400 mr-3" />
                            <div>
                                <p className="font-medium text-gray-900">Phone Support</p>
                                <p className="text-sm text-gray-600">1-800-MEDI-HELP</p>
                                <p className="text-xs text-gray-500">
                                    Available Mon-Fri, 9AM-5PM EST
                                </p>
                            </div>
                        </div>
                        <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                            <MessageCircleIcon size={20} className="mr-2" />
                            Start Live Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpPage;