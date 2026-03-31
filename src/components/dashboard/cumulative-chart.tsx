"use client";

import { useEffect, useRef, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "@/types/models";

type Props = {
  data: ChartPoint[];
};

export function CumulativeChart({ data }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const checkSize = () => {
      const { width, height } = element.getBoundingClientRect();
      setIsReady(width > 0 && height > 0);
    };

    checkSize();

    const observer = new ResizeObserver(() => {
      checkSize();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!data.length) {
    return <p className="text-sm text-zinc-500">No dogs logged yet this year. Go set the pace.</p>;
  }

  return (
    <div ref={containerRef} className="h-56 min-h-56 w-full min-w-0">
      {isReady ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
            <XAxis dataKey="dateLabel" tickLine={false} axisLine={false} minTickGap={28} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #27272a" }} />
            <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}



