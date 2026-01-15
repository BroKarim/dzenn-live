"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty";
import { Clock } from "lucide-react";

interface Page {
  title: string;
  url: string;
  clicks?: number;
  sessions?: number;
}

interface TimeAnalysisItem {
  date: string;
  clicks: number;
  sessions: number;
  visitors: number;
}

interface PagesSectionProps {
  link?: Page;
  timeAnalysis?: TimeAnalysisItem[];
}

export function PagesSection({ link, timeAnalysis = [] }: PagesSectionProps) {
  if (!link) return null;

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Pages</CardTitle>
        <p className="text-sm text-muted-foreground">Top pages and entry/exit points</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="top-pages">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
            <TabsTrigger value="top-pages">Top Pages (1)</TabsTrigger>
            <TabsTrigger value="entry-pages">Entry Pages (1)</TabsTrigger>
            <TabsTrigger value="exit-pages">Exit Pages (1)</TabsTrigger>
            <TabsTrigger value="time-analysis">
              Time Analysis ({timeAnalysis.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top-pages" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-sm text-muted-foreground">{link.clicks || 0}</span>
                  <span className="text-sm font-medium w-16 text-right">100%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="entry-pages" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-sm text-muted-foreground">{link.sessions || 0}</span>
                  <span className="text-sm font-medium w-16 text-right">100%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exit-pages" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-sm text-muted-foreground">{link.sessions || 0}</span>
                  <span className="text-sm font-medium w-16 text-right">100%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time-analysis" className="mt-4">
            {timeAnalysis.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {timeAnalysis.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-sm text-muted-foreground">{item.clicks} clicks</span>
                      <span className="text-sm text-muted-foreground">{item.sessions} sessions</span>
                      <span className="text-sm text-muted-foreground">{item.visitors} visitors</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Clock />
                        </EmptyMedia>
                        <EmptyTitle>No time analysis data</EmptyTitle>
                      </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

