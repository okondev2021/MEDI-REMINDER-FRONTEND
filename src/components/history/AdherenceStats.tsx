import { useState, useEffect } from "react";
import { appDb } from "@/lib/firebase";
import { TrophyIcon, FlameIcon, DownloadIcon } from "lucide-react";
import { DosesScheduleProps } from "@/lib/types";
import { DateTime } from "luxon";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useAuthContext } from "@/context/AuthContextProvider";

interface AdherenceStatsProps {
  userId: string;
}

const safeTimestampToDate = (ts?: Timestamp | null) => {
  if (!ts) return null;
  if (ts instanceof Timestamp) return ts.toDate();
  const d = new Date(ts as any);
  return isNaN(d.getTime()) ? null : d;
};

const safeTimestampToLocaleString = (ts?: Timestamp | null) => {
  const d = safeTimestampToDate(ts);
  return d ? d.toLocaleString() : "";
};

const AdherenceStats: React.FC<AdherenceStatsProps> = ({ userId }) => {
  const { userProfileInfo, currentUser } = useAuthContext();

  const [adherence, setAdherence] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [doses, setDoses] = useState<DosesScheduleProps[]>([]);

  const getFullMedicationHistory = async () => {
    const currentLocalTime =
      DateTime.now()
        .setZone(userProfileInfo?.timezone)
        .endOf("day") ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

    const q = query(
      collectionGroup(appDb, "doses"),
      where("userId", "==", currentUser?.uid),
      where("Timestamp", "<=", Timestamp.fromDate(currentLocalTime.toUTC().toJSDate())),
      orderBy("Timestamp", "desc")
    );

    const doses = await getDocs(q);

    const dosesList = doses.docs.map((dose) => ({
      ...(dose.data() as DosesScheduleProps),
      id: dose.id,
    }));

    setDoses(dosesList);
    calculateAdherence(dosesList);
    calculateStreak(dosesList);
  };

  useEffect(() => {
    if (userId && userProfileInfo?.timezone) {
      getFullMedicationHistory();
    }
  }, [userId]);

  const calculateAdherence = (allDoses: DosesScheduleProps[]) => {
    const relevantDoses = allDoses.filter((d) => d.taken || d.missed);
    const takenDoses = relevantDoses.filter((d) => d.taken).length;
    const adherencePercent =
      Math.round((takenDoses / relevantDoses.length) * 100) || 0;
    setAdherence(adherencePercent);
  };

  const calculateStreak = (allDoses: DosesScheduleProps[]) => {
    const dayMap: Record<string, DosesScheduleProps[]> = {};

    allDoses.forEach((d) => {
      const localDate =
        d.date || safeTimestampToDate(d.Timestamp)?.toISOString().split("T")[0];
      if (!localDate) return;
      if (!dayMap[localDate]) dayMap[localDate] = [];
      dayMap[localDate].push(d);
    });

    const sortedDates = Object.keys(dayMap).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    let currentStreak = 0;

    for (const date of sortedDates) {
      const dosesForDay = dayMap[date];
      if (dosesForDay.every((d) => d.taken)) currentStreak++;
      else break;
    }

    setStreak(currentStreak);
  };

  const downloadCSV = () => {
    let csv =
      "Medication,Strength,Instruction,Date,Time,Taken,Missed,Taken At\n";
    doses.forEach((d) => {
      const takenAt = safeTimestampToLocaleString(d.takenAt);
      csv += `${d.medicationName},${d.medicationStrength},${d.medicationInstruction},${d.date},${d.time},${d.taken},${d.missed},${takenAt}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adherence_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adherence Rate */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <TrophyIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Adherence Rate</h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-blue-700">{adherence}%</span>
          </div>
          <div className="mt-3 bg-white rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${adherence}%` }}
            ></div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <FlameIcon className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Current Streak</h3>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-orange-700">{streak} days</span>
          </div>

          {/* Streak blocks */}
          <div className="mt-3 flex space-x-1">
            {Array.from({ length: Math.min(streak, 7) }).map((_, idx) => (
              <div
                key={idx}
                className="flex-1 h-6 bg-orange-200 rounded-full flex items-center justify-center shadow-sm"
              >
                <span className="text-xs font-semibold text-orange-700">
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <DownloadIcon className="h-4 w-4" />
          Download Report
        </button>
      </div>
    </div>
  );
};

export default AdherenceStats;
