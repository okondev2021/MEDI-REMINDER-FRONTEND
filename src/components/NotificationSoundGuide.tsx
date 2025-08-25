import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const NotificationSoundGuide = () => {

    const [openSection, setOpenSection] = useState <"android" | "ios" | null>(null);

    const toggleSection = (section: "android" | "ios") => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 text-gray-800">
            <h1 className="text-2xl font-bold mb-3">
                Help: How to Change Your Reminder Sound
            </h1>
            <p className="mb-6">
                We want you to hear every reminder loud and clear! MediRemind is a{" "}
                <strong>web app</strong>, which means we send notifications using your
                phone’s normal system settings. We can’t change your notification sound
                for you — but <strong>you can</strong> in just a few taps.
            </p>

            {/* Android Section */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("android")}
                    className="w-full cursor-pointer flex justify-between items-center py-3 text-left font-semibold text-lg"
                >
                    📱 For Android Users
                    {openSection === "android" ? <ChevronUp /> : <ChevronDown />}
                </button>
                {openSection === "android" && (
                    <div className="pl-2 pb-4 space-y-2 text-gray-700">
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Open your <strong>Settings</strong> app.</li>
                            <li>Tap <strong>Apps</strong> or <strong>Apps & Notifications</strong>.</li>
                            <li>Scroll down and find <strong>MediRemind</strong>.</li>
                            <li>Tap <strong>Notifications</strong>.</li>
                            <li>Choose the reminder category (e.g., <em>Reminders</em>).</li>
                            <li>Tap <strong>Sound</strong> and pick your favourite tone.</li>
                            <li>Your new sound will now play whenever it’s time for your meds.</li>
                        </ol>
                        <p className="italic text-sm">
                            💡 Pro tip: Pick a sound you don’t use for anything else so you
                            instantly know it’s your medication reminder.
                        </p>
                    </div>
                )}
            </div>

            {/* iOS Section */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("ios")}
                    className="w-full cursor-pointer flex justify-between items-center py-3 text-left font-semibold text-lg"
                >
                    🍏 For iPhone & iPad Users
                    {openSection === "ios" ? <ChevronUp /> : <ChevronDown />}
                </button>
                {openSection === "ios" && (
                    <div className="pl-2 pb-4 space-y-2 text-gray-700">
                        <p className="italic">
                            iOS treats MediRemind like a website you’ve installed, so the
                            settings are inside Safari’s notification controls.
                        </p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Open your <strong>Settings</strong> app.</li>
                            <li>Scroll down and tap <strong>Safari</strong>.</li>
                            <li>Tap <strong>Notifications</strong>.</li>
                            <li>Look for <strong>MediRemind</strong> in the list.</li>
                            <li>Choose your alert sound from the available tones.</li>
                        </ol>
                        <p className="italic text-sm">
                            💡 Note: iOS only lets you pick from built-in tones for web apps —
                            but you can still choose one that stands out.
                        </p>
                    </div>
                )}
            </div>

            {/* Closing note */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="font-medium">A Friendly Reminder 😉</p>
                <p>
                    The best reminder sound is one you’ll never ignore. Whether it’s a
                    gentle chime or a “get-up-now” alarm, set a tone that helps you stay
                    on track with your medication — your future self will thank you!
                </p>
            </div>
        </div>
    );
}


export default NotificationSoundGuide;