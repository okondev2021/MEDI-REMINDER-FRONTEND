import { HelpCircleIcon, BookOpenIcon, PhoneIcon, MessageCircleIcon, MailIcon, SearchIcon } from 'lucide-react';
import NotificationSoundGuide from '@/components/NotificationSoundGuide';

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
        <>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <HelpCircleIcon size={24} className="text-blue-600 mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">Help Center</h2>
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
            </div>
            <NotificationSoundGuide />
        </>
    );
}

export default HelpPage;