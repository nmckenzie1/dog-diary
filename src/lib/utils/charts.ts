import { format } from "date-fns";

import { DogLog, ChartPoint } from "@/types/models";

export function buildCumulativeChart(logs: DogLog[]): ChartPoint[] {
  const asc = [...logs].sort(
    (a, b) => a.loggedAt.toDate().getTime() - b.loggedAt.toDate().getTime(),
  );

  let running = 0;
  return asc.map((log) => {
    running += log.quantity;
    return {
      dateLabel: format(log.loggedAt.toDate(), "MMM d"),
      total: running,
    };
  });
}

