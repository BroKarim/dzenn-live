import dynamic from "next/dynamic";

export { MetricCard } from "./metric-card";
export const TrafficTrendsChart = dynamic(() => import("./traffic-trends-chart").then((m) => m.TrafficTrendsChart), { ssr: false });
export { TrafficSourcesSection } from "./traffic-sources-section";
export { PagesSection } from "./pages-section";
export const DeviceBrowserCharts = dynamic(() => import("./device-browser-charts").then((m) => m.DeviceBrowserCharts), { ssr: false });
export { DeviceBreakdown } from "./device-breakdown";
export { BrowserBreakdown } from "./browser-breakdown";
export { OSBreakdown } from "./os-breakdown";
export { VisitorLocations } from "./visitor-locations";
export { OperatingSystemsList } from "./operating-systems-list";
export const CountriesChart = dynamic(() => import("./countries-chart").then((m) => m.CountriesChart), { ssr: false });
export { getReferrerIcon, getOSIcon, getDeviceIcon, getBrowserIcon } from "./analytics-icons";
