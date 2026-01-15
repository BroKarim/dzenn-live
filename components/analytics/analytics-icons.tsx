import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaSearch,
  FaGlobe,
  FaArrowRight,
  FaWindows,
  FaApple,
  FaAndroid,
  FaLinux,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaOpera,
} from "react-icons/fa";
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineComputerDesktop,
  HiOutlineDeviceTablet,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

export function getReferrerIcon(referrer: string): IconType {
  const lower = referrer.toLowerCase();
  if (lower.includes("twitter") || lower.includes("x.com")) return FaTwitter;
  if (lower.includes("linkedin")) return FaLinkedin;
  if (lower.includes("facebook")) return FaFacebook;
  if (lower.includes("youtube")) return FaYoutube;
  if (lower.includes("google") || lower.includes("bing")) return FaSearch;
  if (lower === "direct") return FaArrowRight;
  return FaGlobe;
}

export function getOSIcon(os: string): IconType {
  const lower = os.toLowerCase();
  if (lower.includes("windows")) return FaWindows;
  if (lower.includes("macos") || lower.includes("mac")) return FaApple;
  if (lower.includes("android")) return FaAndroid;
  if (lower.includes("ios")) return HiOutlineDevicePhoneMobile;
  if (lower.includes("linux")) return FaLinux;
  return HiOutlineComputerDesktop;
}

export function getDeviceIcon(device: string): IconType {
  const lower = device.toLowerCase();
  if (lower.includes("mobile")) return HiOutlineDevicePhoneMobile;
  if (lower.includes("tablet")) return HiOutlineDeviceTablet;
  if (lower.includes("laptop")) return HiOutlineComputerDesktop;
  return HiOutlineComputerDesktop;
}

export function getBrowserIcon(browser: string): IconType {
  const lower = browser.toLowerCase();
  if (lower.includes("chrome")) return FaChrome;
  if (lower.includes("firefox")) return FaFirefox;
  if (lower.includes("safari")) return FaSafari;
  if (lower.includes("edge")) return FaEdge;
  if (lower.includes("opera")) return FaOpera;
  if (lower.includes("twitter")) return FaTwitter;
  if (lower.includes("linkedin")) return FaLinkedin;
  if (lower.includes("facebook")) return FaFacebook;
  return FaGlobe;
}

