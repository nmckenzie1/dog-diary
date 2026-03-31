import { buildCumulativeChart } from "@/lib/utils/charts";
import { getCurrentYear } from "@/lib/utils/dates";
import {
  getLeaderboardForYear,
  getLogsForYear,
  getRecentLogs,
  getUserProfile,
} from "@/lib/firebase/firestore";

export async function getDashboardData(uid: string) {
  const year = getCurrentYear();
  const [profile, recentLogs, allYearLogs, board] = await Promise.all([
    getUserProfile(uid),
    getRecentLogs(uid, year),
    getLogsForYear(uid, year),
    getLeaderboardForYear(year),
  ]);

  return {
    year,
    profile,
    recentLogs,
    chartData: buildCumulativeChart(allYearLogs),
    board,
  };
}

