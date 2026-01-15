"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getDeviceIcon } from "./analytics-icons";

interface DeviceItem {
  name: string;
  value: number;
}

interface DeviceBreakdownProps {
  data: DeviceItem[];
}

const DEVICE_COLORS: Record<string, { bg: string; badge: string }> = {
  mobile: { bg: "bg-emerald-50/50 dark:bg-emerald-950/30", badge: "bg-emerald-500" },
  tablet: { bg: "bg-blue-50/50 dark:bg-blue-950/30", badge: "bg-blue-500" },
  desktop: { bg: "bg-gray-100/50 dark:bg-gray-800/50", badge: "bg-gray-500" },
  laptop: { bg: "bg-gray-100/50 dark:bg-gray-800/50", badge: "bg-gray-500" },
};

const getDeviceColor = (deviceName: string) => {
  const lower = deviceName.toLowerCase();
  if (lower.includes("mobile")) return DEVICE_COLORS.mobile;
  if (lower.includes("tablet")) return DEVICE_COLORS.tablet;
  if (lower.includes("laptop")) return DEVICE_COLORS.laptop;
  return DEVICE_COLORS.desktop;
};

export function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  if (data.length === 0) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  const getShare = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) : "0";
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Device breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0 overflow-x-auto">
          <div className="grid grid-cols-[1fr_60px_60px] sm:grid-cols-[1fr_80px_80px] gap-2 sm:gap-4 px-2 py-2 text-xs font-medium text-muted-foreground border-b mb-2 min-w-[280px]">
            <div>DEVICE TYPE</div>
            <div className="text-right">VISITORS</div>
            <div className="text-right">SHARE</div>
          </div>
          {sortedData.map((item) => {
            const DeviceIcon = getDeviceIcon(item.name);
            const share = getShare(item.value, total);
            const colors = getDeviceColor(item.name);
            
            return (
              <div
                key={item.name}
                className={`grid grid-cols-[1fr_60px_60px] sm:grid-cols-[1fr_80px_80px] gap-2 sm:gap-4 items-center px-2 py-2 sm:py-3 rounded-lg ${colors.bg} transition-colors min-w-[280px]`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <DeviceIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">{item.name}</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-right">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-white ${colors.badge}`}>
                    {share}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

