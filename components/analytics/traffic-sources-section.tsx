"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import { Globe } from "lucide-react";
import { getReferrerIcon } from "./analytics-icons";

interface TrafficSource {
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  clicks: number;
}

interface TrafficSourcesSectionProps {
  referrers?: TrafficSource[];
  utmSources?: TrafficSource[];
  utmMediums?: TrafficSource[];
  utmCampaigns?: TrafficSource[];
}

export function TrafficSourcesSection({
  referrers = [],
  utmSources = [],
  utmMediums = [],
  utmCampaigns = [],
}: TrafficSourcesSectionProps) {
  const [activeTab, setActiveTab] = useState("referrers");

  const totalForShare = (data: TrafficSource[]) => {
    return data.reduce((sum, item) => sum + item.clicks, 0) || 1;
  };

  const getShare = (clicks: number, total: number) => {
    return total > 0 ? ((clicks / total) * 100).toFixed(2) : "0";
  };

  const renderList = (data: TrafficSource[], getLabel: (item: TrafficSource) => string, getIcon?: (item: TrafficSource) => React.ReactNode) => {
    if (data.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Globe />
            </EmptyMedia>
            <EmptyTitle>No data available</EmptyTitle>
          </EmptyHeader>
        </Empty>
      );
    }

    const total = totalForShare(data);

    return (
      <div className="space-y-2">
        {data.map((item) => {
          const share = getShare(item.clicks, total);
          const label = getLabel(item);
          const IconComponent = getIcon ? getIcon(item) : null;
          const ReferrerIcon = item.referrer ? getReferrerIcon(item.referrer) : null;

          return (
            <div
              key={label}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {IconComponent || (ReferrerIcon && <ReferrerIcon className="h-4 w-4" />)}
                <span className="text-sm font-medium truncate">{label}</span>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <span className="text-sm text-muted-foreground">{item.clicks}</span>
                <span className="text-sm font-medium w-16 text-right">{share}%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
            <TabsTrigger value="referrers">
              Referrers ({referrers.length})
            </TabsTrigger>
            <TabsTrigger value="utm-sources">
              UTM Sources ({utmSources.length})
            </TabsTrigger>
            <TabsTrigger value="utm-mediums">
              UTM Mediums ({utmMediums.length})
            </TabsTrigger>
            <TabsTrigger value="utm-campaigns">
              UTM Campaigns ({utmCampaigns.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="referrers" className="mt-4">
            {renderList(
              referrers,
              (item) => item.referrer || "Unknown"
            )}
          </TabsContent>

          <TabsContent value="utm-sources" className="mt-4">
            {renderList(utmSources, (item) => item.source || "Unknown")}
          </TabsContent>

          <TabsContent value="utm-mediums" className="mt-4">
            {renderList(utmMediums, (item) => item.medium || "Unknown")}
          </TabsContent>

          <TabsContent value="utm-campaigns" className="mt-4">
            {renderList(utmCampaigns, (item) => item.campaign || "Unknown")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

