"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface TrafficTrendsChartProps {
  data: Array<{
    date: string;
    clicks: number;
    sessions?: number;
    visitors?: number;
  }>;
  isLoading?: boolean;
  showMultipleLines?: boolean;
}

export function TrafficTrendsChart({
  data,
  isLoading = false,
  showMultipleLines = false,
}: TrafficTrendsChartProps) {
  if (isLoading) {
    return (
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Traffic Trends</CardTitle>
          {showMultipleLines && (
            <p className="text-sm text-muted-foreground">Daily traffic data</p>
          )}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Traffic Trends</CardTitle>
          {showMultipleLines && (
            <p className="text-sm text-muted-foreground">Daily traffic data</p>
          )}
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TrendingUp />
              </EmptyMedia>
              <EmptyTitle>No data yet</EmptyTitle>
              <EmptyDescription>
                Click data will appear here as visitors interact with your links.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Traffic Trends</CardTitle>
        {showMultipleLines && (
          <p className="text-sm text-muted-foreground">Daily traffic data</p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            {showMultipleLines && <Legend />}
            <Area
              type="monotone"
              dataKey="clicks"
              name={showMultipleLines ? "Pageviews" : undefined}
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            {showMultipleLines && (
              <>
                <Area
                  type="monotone"
                  dataKey="sessions"
                  name="Sessions"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

