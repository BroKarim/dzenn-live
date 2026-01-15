import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor: string;
  isPositive?: (change: number) => boolean;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  isPositive = (c) => c >= 0,
}: MetricCardProps) {
  const showChange = change !== undefined;
  const positive = showChange ? isPositive(change) : true;
  const changeValue = showChange ? Math.abs(change) : 0;

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold mb-2">{value}</p>
        {showChange && (
          <div className="flex items-center gap-1.5">
            {positive ? (
              <ArrowUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 text-red-600" />
            )}
            <span className={`text-sm font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}>
              {changeValue.toFixed(0)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

