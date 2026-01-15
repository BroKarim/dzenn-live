import { db } from "../db";
import { Prisma } from "../generated/prisma/client";

export const analyticsService = {
  async getLinkStats(linkId: string, startDate?: Date, endDate?: Date, includeBots = false) {
    const where: Prisma.LinkClickWhereInput = { 
      linkId,
      ...(includeBots ? {} : { isBot: false }),
    };
    
    if (startDate || endDate) {
      where.clickedAt = {};
      if (startDate) where.clickedAt.gte = startDate;
      if (endDate) where.clickedAt.lte = endDate;
    }

    const [
      totalClicks,
      uniqueVisitors,
      allClicks,
      clicksByCountry,
      clicksByDevice,
      clicksByBrowser,
      clicksByOS,
      clicksByReferrer,
      clicksByUTMSource,
      clicksByUTMMedium,
      clicksByUTMCampaign,
    ] = await Promise.all([
      db.linkClick.count({ where }),
      db.linkClick.groupBy({
        by: ["sessionFingerprint"],
        where: { ...where, sessionFingerprint: { not: null } },
        _count: true,
      }),
      db.linkClick.findMany({
        where,
        select: { clickedAt: true, sessionFingerprint: true },
        orderBy: { clickedAt: "asc" },
      }),
      db.linkClick.groupBy({
        by: ["country"],
        where: { ...where, country: { not: null } },
        _count: true,
        orderBy: { _count: { country: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["device"],
        where: { ...where, device: { not: null } },
        _count: true,
        orderBy: { _count: { device: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["browser"],
        where: { ...where, browser: { not: null } },
        _count: true,
        orderBy: { _count: { browser: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["operatingSystem"],
        where: { ...where, operatingSystem: { not: null } },
        _count: true,
        orderBy: { _count: { operatingSystem: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["referrer"],
        where: { ...where, referrer: { not: null } },
        _count: true,
        orderBy: { _count: { referrer: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["utmSource"],
        where: { ...where, utmSource: { not: null } },
        _count: true,
        orderBy: { _count: { utmSource: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["utmMedium"],
        where: { ...where, utmMedium: { not: null } },
        _count: true,
        orderBy: { _count: { utmMedium: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["utmCampaign"],
        where: { ...where, utmCampaign: { not: null } },
        _count: true,
        orderBy: { _count: { utmCampaign: "desc" } },
      }),
    ]);

    const clicksByDate = new Map<string, number>();
    const sessionsByDate = new Map<string, Set<string>>();
    const visitorsByDate = new Map<string, Set<string>>();
    
    allClicks.forEach((click) => {
      const date = click.clickedAt.toISOString().split("T")[0];
      clicksByDate.set(date, (clicksByDate.get(date) || 0) + 1);
      
      if (click.sessionFingerprint) {
        if (!sessionsByDate.has(date)) {
          sessionsByDate.set(date, new Set());
        }
        sessionsByDate.get(date)!.add(click.sessionFingerprint);
        
        if (!visitorsByDate.has(date)) {
          visitorsByDate.set(date, new Set());
        }
        visitorsByDate.get(date)!.add(click.sessionFingerprint);
      }
    });

    const clicksOverTimeFormatted = Array.from(clicksByDate.entries())
      .map(([date, clicks]) => {
        const sessions = sessionsByDate.get(date)?.size || 0;
        const visitors = visitorsByDate.get(date)?.size || 0;
        return { date, clicks, sessions, visitors };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    const sessionStats = allClicks
      .filter((c) => c.sessionFingerprint)
      .reduce((acc, click) => {
        const sessionId = click.sessionFingerprint!;
        if (!acc[sessionId]) {
          acc[sessionId] = [];
        }
        acc[sessionId].push(click.clickedAt);
        return acc;
      }, {} as Record<string, Date[]>);

    const sessions = Object.keys(sessionStats).length;
    const bouncedSessions = Object.values(sessionStats).filter(
      (clicks) => clicks.length === 1
    ).length;
    const bounceRate = sessions > 0 ? (bouncedSessions / sessions) * 100 : 0;

    const sessionDurations = Object.values(sessionStats)
      .map((clicks) => {
        if (clicks.length < 2) return 0;
        const sorted = clicks.sort((a, b) => a.getTime() - b.getTime());
        return (sorted[sorted.length - 1].getTime() - sorted[0].getTime()) / 1000;
      })
      .filter((d) => d > 0);
    const avgSessionDuration = sessionDurations.length > 0
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
      : 0;

    const previousPeriodClicks = clicksOverTimeFormatted.length > 0
      ? clicksOverTimeFormatted.slice(0, Math.floor(clicksOverTimeFormatted.length / 2))
          .reduce((sum, d) => sum + d.clicks, 0)
      : 0;
    const currentPeriodClicks = clicksOverTimeFormatted.length > 0
      ? clicksOverTimeFormatted.slice(Math.floor(clicksOverTimeFormatted.length / 2))
          .reduce((sum, d) => sum + d.clicks, 0)
      : 0;
    const clicksChange = previousPeriodClicks > 0
      ? ((currentPeriodClicks - previousPeriodClicks) / previousPeriodClicks) * 100
      : 0;

    const previousPeriodSessions = clicksOverTimeFormatted.length > 0
      ? clicksOverTimeFormatted.slice(0, Math.floor(clicksOverTimeFormatted.length / 2))
          .reduce((sum, d) => sum + d.sessions, 0)
      : 0;
    const currentPeriodSessions = clicksOverTimeFormatted.length > 0
      ? clicksOverTimeFormatted.slice(Math.floor(clicksOverTimeFormatted.length / 2))
          .reduce((sum, d) => sum + d.sessions, 0)
      : 0;
    const sessionsChange = previousPeriodSessions > 0
      ? ((currentPeriodSessions - previousPeriodSessions) / previousPeriodSessions) * 100
      : 0;

    const previousPeriodVisitors = clicksOverTimeFormatted.length > 0
      ? clicksOverTimeFormatted.slice(0, Math.floor(clicksOverTimeFormatted.length / 2))
          .reduce((sum, d) => sum + d.visitors, 0)
      : 0;
    const currentPeriodVisitors = clicksOverTimeFormatted.length > 0
      ? clicksOverTimeFormatted.slice(Math.floor(clicksOverTimeFormatted.length / 2))
          .reduce((sum, d) => sum + d.visitors, 0)
      : 0;
    const visitorsChange = previousPeriodVisitors > 0
      ? ((currentPeriodVisitors - previousPeriodVisitors) / previousPeriodVisitors) * 100
      : 0;

    const clicksByCountryFormatted = clicksByCountry.map((item) => ({
      country: item.country || "Unknown",
      clicks: item._count,
    }));

    const clicksByDeviceFormatted = clicksByDevice.map((item) => ({
      device: item.device || "Unknown",
      clicks: item._count,
    }));

    const clicksByBrowserFormatted = clicksByBrowser.map((item) => ({
      browser: item.browser || "Unknown",
      clicks: item._count,
    }));

    const clicksByOSFormatted = clicksByOS.map((item) => ({
      os: item.operatingSystem || "Unknown",
      clicks: item._count,
    }));

    const clicksByReferrerFormatted = clicksByReferrer.map((item) => ({
      referrer: item.referrer || "Unknown",
      clicks: item._count,
    }));

    const clicksByUTMSourceFormatted = clicksByUTMSource.map((item) => ({
      source: item.utmSource || "Unknown",
      clicks: item._count,
    }));

    const clicksByUTMMediumFormatted = clicksByUTMMedium.map((item) => ({
      medium: item.utmMedium || "Unknown",
      clicks: item._count,
    }));

    const clicksByUTMCampaignFormatted = clicksByUTMCampaign.map((item) => ({
      campaign: item.utmCampaign || "Unknown",
      clicks: item._count,
    }));

    const previousPeriodBounceRate = clicksOverTimeFormatted.length > 0
      ? (() => {
          const prevClicks = allClicks.filter((c) => {
            const date = c.clickedAt.toISOString().split("T")[0];
            const dateIndex = clicksOverTimeFormatted.findIndex((d) => d.date === date);
            return dateIndex >= 0 && dateIndex < Math.floor(clicksOverTimeFormatted.length / 2);
          });
          const prevSessionStats = prevClicks
            .filter((c) => c.sessionFingerprint)
            .reduce((acc, click) => {
              const sessionId = click.sessionFingerprint!;
              if (!acc[sessionId]) acc[sessionId] = [];
              acc[sessionId].push(click.clickedAt);
              return acc;
            }, {} as Record<string, Date[]>);
          const prevSessions = Object.keys(prevSessionStats).length;
          const prevBounced = Object.values(prevSessionStats).filter((c) => c.length === 1).length;
          return prevSessions > 0 ? (prevBounced / prevSessions) * 100 : 0;
        })()
      : 0;
    const bounceRateChange = previousPeriodBounceRate > 0
      ? ((bounceRate - previousPeriodBounceRate) / previousPeriodBounceRate) * 100
      : bounceRate > 0 ? 100 : 0;

    const previousPeriodDuration = clicksOverTimeFormatted.length > 0
      ? (() => {
          const prevClicks = allClicks.filter((c) => {
            const date = c.clickedAt.toISOString().split("T")[0];
            const dateIndex = clicksOverTimeFormatted.findIndex((d) => d.date === date);
            return dateIndex >= 0 && dateIndex < Math.floor(clicksOverTimeFormatted.length / 2);
          });
          const prevSessionStats = prevClicks
            .filter((c) => c.sessionFingerprint)
            .reduce((acc, click) => {
              const sessionId = click.sessionFingerprint!;
              if (!acc[sessionId]) acc[sessionId] = [];
              acc[sessionId].push(click.clickedAt);
              return acc;
            }, {} as Record<string, Date[]>);
          const prevDurations = Object.values(prevSessionStats)
            .map((clicks) => {
              if (clicks.length < 2) return 0;
              const sorted = clicks.sort((a, b) => a.getTime() - b.getTime());
              return (sorted[sorted.length - 1].getTime() - sorted[0].getTime()) / 1000;
            })
            .filter((d) => d > 0);
          return prevDurations.length > 0
            ? prevDurations.reduce((a, b) => a + b, 0) / prevDurations.length
            : 0;
        })()
      : 0;
    const sessionDurationChange = previousPeriodDuration > 0
      ? ((avgSessionDuration - previousPeriodDuration) / previousPeriodDuration) * 100
      : avgSessionDuration > 0 ? 100 : 0;

    return {
      linkId,
      totalClicks,
      uniqueVisitors: uniqueVisitors.length,
      sessions,
      bounceRate,
      avgSessionDuration,
      clicksChange,
      sessionsChange,
      visitorsChange,
      bounceRateChange,
      sessionDurationChange,
      clicksOverTime: clicksOverTimeFormatted,
      clicksByCountry: clicksByCountryFormatted,
      clicksByDevice: clicksByDeviceFormatted,
      clicksByBrowser: clicksByBrowserFormatted,
      clicksByOS: clicksByOSFormatted,
      clicksByReferrer: clicksByReferrerFormatted,
      clicksByUTMSource: clicksByUTMSourceFormatted,
      clicksByUTMMedium: clicksByUTMMediumFormatted,
      clicksByUTMCampaign: clicksByUTMCampaignFormatted,
    };
  },

  async getProfileStats(profileId: string, startDate?: Date, endDate?: Date, includeBots = false) {
    const links = await db.link.findMany({
      where: { profileId },
      select: { id: true },
    });

    const linkIds = links.map((l) => l.id);
    
    const where: Prisma.LinkClickWhereInput = {
      linkId: { in: linkIds },
      ...(includeBots ? {} : { isBot: false }),
    };
    
    if (startDate || endDate) {
      where.clickedAt = {};
      if (startDate) where.clickedAt.gte = startDate;
      if (endDate) where.clickedAt.lte = endDate;
    }

    const [
      totalClicks,
      uniqueVisitors,
      clicksByLink,
      allClicks,
      clicksByReferrer,
      clicksByUTMSource,
      clicksByUTMMedium,
      clicksByUTMCampaign,
    ] = await Promise.all([
      db.linkClick.count({ where }),
      db.linkClick.groupBy({
        by: ["sessionFingerprint"],
        where: { ...where, sessionFingerprint: { not: null } },
        _count: true,
      }),
      db.linkClick.groupBy({
        by: ["linkId"],
        where,
        _count: true,
        orderBy: { _count: { linkId: "desc" } },
      }),
      db.linkClick.findMany({
        where,
        select: { clickedAt: true, sessionFingerprint: true },
        orderBy: { clickedAt: "asc" },
      }),
      db.linkClick.groupBy({
        by: ["referrer"],
        where: { ...where, referrer: { not: null } },
        _count: true,
        orderBy: { _count: { referrer: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["utmSource"],
        where: { ...where, utmSource: { not: null } },
        _count: true,
        orderBy: { _count: { utmSource: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["utmMedium"],
        where: { ...where, utmMedium: { not: null } },
        _count: true,
        orderBy: { _count: { utmMedium: "desc" } },
      }),
      db.linkClick.groupBy({
        by: ["utmCampaign"],
        where: { ...where, utmCampaign: { not: null } },
        _count: true,
        orderBy: { _count: { utmCampaign: "desc" } },
      }),
    ]);

    const topLinks = clicksByLink
      .map((item) => ({
        link_id: item.linkId,
        clicks: item._count,
      }))
      .slice(0, 10);

    const clicksByDate = new Map<string, number>();
    allClicks.forEach((click) => {
      const date = click.clickedAt.toISOString().split("T")[0];
      clicksByDate.set(date, (clicksByDate.get(date) || 0) + 1);
    });

    const clicksOverTimeFormatted = Array.from(clicksByDate.entries())
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const clicksByReferrerFormatted = clicksByReferrer.map((item) => ({
      referrer: item.referrer || "Unknown",
      clicks: item._count,
    }));

    const clicksByUTMSourceFormatted = clicksByUTMSource.map((item) => ({
      source: item.utmSource || "Unknown",
      clicks: item._count,
    }));

    const clicksByUTMMediumFormatted = clicksByUTMMedium.map((item) => ({
      medium: item.utmMedium || "Unknown",
      clicks: item._count,
    }));

    const clicksByUTMCampaignFormatted = clicksByUTMCampaign.map((item) => ({
      campaign: item.utmCampaign || "Unknown",
      clicks: item._count,
    }));

    return {
      profileId,
      totalClicks,
      uniqueVisitors: uniqueVisitors.length,
      topLinks,
      clicksOverTime: clicksOverTimeFormatted,
      clicksByReferrer: clicksByReferrerFormatted,
      clicksByUTMSource: clicksByUTMSourceFormatted,
      clicksByUTMMedium: clicksByUTMMediumFormatted,
      clicksByUTMCampaign: clicksByUTMCampaignFormatted,
    };
  },

  async getLinkClickCount(linkId: string, includeBots = false): Promise<number> {
    return db.linkClick.count({ 
      where: { 
        linkId,
        ...(includeBots ? {} : { isBot: false }),
      } 
    });
  },

  async getLinksClickCounts(linkIds: string[], includeBots = false): Promise<Record<string, number>> {
    const counts = await db.linkClick.groupBy({
      by: ["linkId"],
      where: { 
        linkId: { in: linkIds },
        ...(includeBots ? {} : { isBot: false }),
      },
      _count: true,
    });

    const result: Record<string, number> = {};
    linkIds.forEach((id) => {
      result[id] = 0;
    });
    counts.forEach((item) => {
      result[item.linkId] = item._count;
    });

    return result;
  },
};

