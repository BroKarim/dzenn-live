"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface CountryItem {
  name: string;
  value: number;
}

interface VisitorLocationsProps {
  data: CountryItem[];
}

const getCountryCode = (countryInput: string): string => {
  const trimmed = countryInput.trim().toUpperCase();
  
  if (trimmed.length === 2) {
    return trimmed;
  }
  
  const countryMap: Record<string, string> = {
    "united states": "US",
    "usa": "US",
    "united kingdom": "GB",
    "uk": "GB",
    "india": "IN",
    "bangladesh": "BD",
    "nigeria": "NG",
    "turkey": "TR",
    "canada": "CA",
    "australia": "AU",
    "germany": "DE",
    "france": "FR",
    "japan": "JP",
    "china": "CN",
    "brazil": "BR",
    "russia": "RU",
    "south korea": "KR",
    "spain": "ES",
    "italy": "IT",
    "mexico": "MX",
    "indonesia": "ID",
    "philippines": "PH",
    "vietnam": "VN",
    "thailand": "TH",
    "pakistan": "PK",
    "egypt": "EG",
    "south africa": "ZA",
    "poland": "PL",
    "netherlands": "NL",
    "belgium": "BE",
    "sweden": "SE",
    "norway": "NO",
    "denmark": "DK",
    "finland": "FI",
    "switzerland": "CH",
    "austria": "AT",
    "portugal": "PT",
    "greece": "GR",
    "ireland": "IE",
    "new zealand": "NZ",
    "singapore": "SG",
    "malaysia": "MY",
    "argentina": "AR",
    "chile": "CL",
    "colombia": "CO",
    "peru": "PE",
    "venezuela": "VE",
  };
  
  const lower = countryInput.toLowerCase().trim();
  return countryMap[lower] || trimmed.substring(0, 2);
};

const getCountryName = (countryCode: string, originalName: string): string => {
  const codeMap: Record<string, string> = {
    "US": "United States",
    "GB": "United Kingdom",
    "IN": "India",
    "BD": "Bangladesh",
    "NG": "Nigeria",
    "TR": "Turkey",
    "CA": "Canada",
    "AU": "Australia",
    "DE": "Germany",
    "FR": "France",
    "JP": "Japan",
    "CN": "China",
    "BR": "Brazil",
    "RU": "Russia",
    "KR": "South Korea",
    "ES": "Spain",
    "IT": "Italy",
    "MX": "Mexico",
    "ID": "Indonesia",
    "PH": "Philippines",
    "VN": "Vietnam",
    "TH": "Thailand",
    "PK": "Pakistan",
    "EG": "Egypt",
    "ZA": "South Africa",
    "PL": "Poland",
    "NL": "Netherlands",
    "BE": "Belgium",
    "SE": "Sweden",
    "NO": "Norway",
    "DK": "Denmark",
    "FI": "Finland",
    "CH": "Switzerland",
    "AT": "Austria",
    "PT": "Portugal",
    "GR": "Greece",
    "IE": "Ireland",
    "NZ": "New Zealand",
    "SG": "Singapore",
    "MY": "Malaysia",
    "AR": "Argentina",
    "CL": "Chile",
    "CO": "Colombia",
    "PE": "Peru",
    "VE": "Venezuela",
  };
  
  return codeMap[countryCode] || originalName;
};

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export function VisitorLocations({ data }: VisitorLocationsProps) {
  if (data.length === 0) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  const getShare = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(0) : "0";
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Visitor Locations</CardTitle>
        <CardDescription>Geographic distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          <div className="text-xs font-medium text-muted-foreground mb-4 pb-2 border-b">
            TOP COUNTRIES
          </div>
          {sortedData.map((item) => {
            const countryCode = getCountryCode(item.name);
            const countryName = getCountryName(countryCode, item.name);
            const flag = getCountryFlag(countryCode);
            const share = getShare(item.value, total);
            
            return (
              <div
                key={item.name}
                className="grid grid-cols-[auto_1fr_60px_50px] sm:grid-cols-[auto_1fr_80px_60px] gap-2 sm:gap-4 items-center px-2 py-2 sm:py-3 rounded-lg transition-colors hover:bg-muted/50"
              >
                <div className="text-xl sm:text-2xl shrink-0">
                  {flag}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium truncate">{countryName}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{countryCode}</div>
                </div>
                <div className="text-xs sm:text-sm font-medium text-right">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm font-medium text-right">
                  {share}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

