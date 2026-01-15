"use client";

import { useState } from "react";
import type * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { 
  Globe, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  RefreshCw, 
  Clock,
  Eye,
  Activity,
  User,
  BarChart3
} from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MetricCard } from "@/components/analytics/metric-card";
import { TrafficTrendsChart } from "@/components/analytics/traffic-trends-chart";
import { TrafficSourcesSection } from "@/components/analytics/traffic-sources-section";
import { PagesSection } from "@/components/analytics/pages-section";
import { DeviceBreakdown } from "@/components/analytics/device-breakdown";
import { BrowserBreakdown } from "@/components/analytics/browser-breakdown";
import { OSBreakdown } from "@/components/analytics/os-breakdown";
import { VisitorLocations } from "@/components/analytics/visitor-locations";


interface ProfileStats {
  totalClicks: number;
  uniqueVisitors?: number;
  topLinks: Array<{ link_id: string; clicks: number }>;
  clicksOverTime: Array<{ date: string; clicks: number }>;
  clicksByReferrer?: Array<{ referrer: string; clicks: number }>;
  clicksByUTMSource?: Array<{ source: string; clicks: number }>;
  clicksByUTMMedium?: Array<{ medium: string; clicks: number }>;
  clicksByUTMCampaign?: Array<{ campaign: string; clicks: number }>;
}

interface LinkStats {
  linkId: string;
  totalClicks: number;
  uniqueVisitors?: number;
  sessions?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
  clicksChange?: number;
  sessionsChange?: number;
  visitorsChange?: number;
  bounceRateChange?: number;
  sessionDurationChange?: number;
  clicksOverTime: Array<{ date: string; clicks: number; sessions?: number; visitors?: number }>;
  clicksByCountry: Array<{ country: string; clicks: number }>;
  clicksByDevice: Array<{ device: string; clicks: number }>;
  clicksByBrowser: Array<{ browser: string; clicks: number }>;
  clicksByOS?: Array<{ os: string; clicks: number }>;
  clicksByReferrer?: Array<{ referrer: string; clicks: number }>;
  clicksByUTMSource?: Array<{ source: string; clicks: number }>;
  clicksByUTMMedium?: Array<{ medium: string; clicks: number }>;
  clicksByUTMCampaign?: Array<{ campaign: string; clicks: number }>;
}

interface Link {
  id: string;
  title: string;
  url: string;
  isActive?: boolean;
}

interface AnalyticsClientProps {
  initialStats: ProfileStats;
  links: Link[];
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}

export function AnalyticsClient({
  initialStats,
  links,
}: AnalyticsClientProps) {
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data: stats = initialStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["analytics", selectedLinkId],
    queryFn: async () => {
      const url = selectedLinkId
        ? `/api/analytics?linkId=${selectedLinkId}`
        : "/api/analytics";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    initialData: selectedLinkId ? undefined : initialStats,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 60000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["analytics", selectedLinkId] });
      await queryClient.invalidateQueries({ queryKey: ["link-click-counts"] });
      await queryClient.refetchQueries({ queryKey: ["analytics", selectedLinkId] });
      await queryClient.refetchQueries({ queryKey: ["link-click-counts"] });
    } catch (error) {
      console.error("Failed to refresh analytics:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const selectedLink = selectedLinkId
    ? links.find((l) => l.id === selectedLinkId)
    : null;

  const topLinksWithDetails = stats.topLinks
    ? stats.topLinks
        .map((item: { link_id: string; clicks: number }) => {
          const link = links.find((l) => l.id === item.link_id);
          return {
            ...item,
            title: link?.title || "Unknown",
            url: link?.url || "",
          };
        })
        .slice(0, 20)
    : [];

  const linkStats = stats as LinkStats;
  const profileStats = stats as ProfileStats;

  const totalClicks = stats.totalClicks || 0;
  const uniqueVisitors = stats.uniqueVisitors || 0;
  const avgClicksPerVisitor = uniqueVisitors > 0 ? (totalClicks / uniqueVisitors).toFixed(1) : "0";

  const referrerData = (selectedLinkId ? linkStats.clicksByReferrer : profileStats.clicksByReferrer) || [];
  const utmSourceData = (selectedLinkId ? linkStats.clicksByUTMSource : profileStats.clicksByUTMSource) || [];
  const utmMediumData = (selectedLinkId ? linkStats.clicksByUTMMedium : profileStats.clicksByUTMMedium) || [];
  const utmCampaignData = (selectedLinkId ? linkStats.clicksByUTMCampaign : profileStats.clicksByUTMCampaign) || [];

  const deviceData = linkStats.clicksByDevice
    ? linkStats.clicksByDevice.map((item) => ({
        name: item.device,
        value: item.clicks,
      }))
    : [];

  const browserData = linkStats.clicksByBrowser
    ? linkStats.clicksByBrowser.map((item) => ({
        name: item.browser,
        value: item.clicks,
      }))
    : [];

  const osData = linkStats.clicksByOS
    ? linkStats.clicksByOS.map((item) => ({
        name: item.os,
        value: item.clicks,
      }))
    : [];

  const countryData = linkStats.clicksByCountry
    ? linkStats.clicksByCountry.slice(0, 10).map((item) => ({
        name: item.country,
        value: item.clicks,
      }))
    : [];

  const totalForShare = (data: Array<{ clicks?: number; value?: number }>) => {
    return data.reduce((sum, item) => sum + (item.clicks || item.value || 0), 0) || 1;
  };

  const getShare = (clicks: number, total: number) => {
    return total > 0 ? ((clicks / total) * 100).toFixed(2) : "0";
  };

  const clicksOverTimeData = stats.clicksOverTime
    ? stats.clicksOverTime.map((item: { date: string; clicks: number; sessions?: number; visitors?: number }) => ({
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        clicks: item.clicks,
        sessions: item.sessions || 0,
        visitors: item.visitors || 0,
        fullDate: item.date,
      }))
    : [];

  const sessions = linkStats.sessions || 0;
  const bounceRate = linkStats.bounceRate || 0;
  const avgSessionDuration = linkStats.avgSessionDuration || 0;
  const clicksChange = linkStats.clicksChange || 0;
  const sessionsChange = linkStats.sessionsChange || 0;
  const visitorsChange = linkStats.visitorsChange || 0;
  const bounceRateChange = linkStats.bounceRateChange || 0;
  const sessionDurationChange = linkStats.sessionDurationChange || 0;

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 w-full sm:max-w-sm">
            <Select value={selectedLinkId || ""} onValueChange={(value) => setSelectedLinkId(value || null)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedLinkId ? selectedLink?.title : "Select a link to view analytics"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Links</SelectItem>
                {links.map((link) => (
                  <SelectItem key={link.id} value={link.id}>
                    {link.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoadingStats || isRefreshing}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingStats || isRefreshing ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">Refresh</span>
                </Button> as React.ReactElement
              }
            />
            <TooltipPopup>Refresh analytics data</TooltipPopup>
          </Tooltip>
        </div>

        {!selectedLinkId ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Clicks"
              value={formatNumber(totalClicks)}
              icon={MousePointerClick}
              iconColor="text-blue-500"
            />
            <MetricCard
              title="Unique Visitors"
              value={formatNumber(uniqueVisitors)}
              icon={Users}
              iconColor="text-emerald-500"
            />
            <MetricCard
              title="Avg. Clicks/Visitor"
              value={avgClicksPerVisitor}
              icon={TrendingUp}
              iconColor="text-purple-500"
            />
            <MetricCard
              title="Active Links"
              value={links.filter((l) => l.isActive !== false).length.toString()}
              icon={Globe}
              iconColor="text-amber-500"
            />
                </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <MetricCard
              title="Pageviews"
              value={formatNumber(totalClicks)}
              change={clicksChange}
              icon={Eye}
              iconColor="text-blue-500"
            />
            <MetricCard
              title="Sessions"
              value={formatNumber(sessions)}
              change={sessionsChange}
              icon={Activity}
              iconColor="text-emerald-500"
            />
            <MetricCard
              title="Visitors"
              value={formatNumber(uniqueVisitors)}
              change={visitorsChange}
              icon={User}
              iconColor="text-purple-500"
            />
            <MetricCard
              title="Bounce Rate"
              value={`${bounceRate.toFixed(1)}%`}
              change={bounceRateChange}
              icon={BarChart3}
              iconColor="text-amber-500"
              isPositive={(c) => c <= 0}
            />
            <MetricCard
              title="Session Duration"
              value={formatDuration(avgSessionDuration)}
              change={sessionDurationChange}
              icon={Clock}
              iconColor="text-indigo-500"
            />
              </div>
        )}

        <TrafficTrendsChart
          data={clicksOverTimeData}
          isLoading={isLoadingStats}
          showMultipleLines={!!selectedLinkId}
        />

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <TrafficSourcesSection
          referrers={referrerData.map((item) => ({ referrer: item.referrer, clicks: item.clicks }))}
          utmSources={utmSourceData.map((item) => ({ source: item.source, clicks: item.clicks }))}
          utmMediums={utmMediumData.map((item) => ({ medium: item.medium, clicks: item.clicks }))}
          utmCampaigns={utmCampaignData.map((item) => ({ campaign: item.campaign, clicks: item.clicks }))}
        />

        {selectedLinkId && (
          <PagesSection
            link={{
              title: selectedLink?.title || "",
              url: selectedLink?.url || "",
              clicks: totalClicks,
              sessions: sessions,
            }}
            timeAnalysis={clicksOverTimeData.map((item: { date: string; clicks: number; sessions: number; visitors: number }) => ({
              date: item.date,
              clicks: item.clicks,
              sessions: item.sessions,
              visitors: item.visitors,
            }))}
          />
        )}

        {!selectedLinkId && (
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {topLinksWithDetails.length > 0 ? (
                <div className="space-y-2">
                  {topLinksWithDetails.slice(0, 10).map((item: { link_id: string; title: string; url: string; clicks: number }) => {
                    const total = totalForShare(topLinksWithDetails);
                    const share = getShare(item.clicks, total);
                    return (
                      <div
                        key={item.link_id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedLinkId(item.link_id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.url}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <span className="text-sm text-muted-foreground">
                            {item.clicks}
                          </span>
                          <span className="text-sm font-medium w-16 text-right">
                            {share}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Globe />
                    </EmptyMedia>
                    <EmptyTitle>No data yet</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {selectedLinkId && (
        <>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <DeviceBreakdown data={deviceData} />
            <BrowserBreakdown data={browserData} />
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <OSBreakdown data={osData} />
            <VisitorLocations data={countryData} />
          </div>
        </>
      )}
      </div>
    </TooltipProvider>
  );
}
