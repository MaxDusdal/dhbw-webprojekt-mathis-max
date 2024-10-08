import { type GeoIPResponse, type UserAgentInfo } from "./types";

export const getLocation = async (ip: string): Promise<string> => {
  const response = await fetch(
    `http://ip-api.com/json/${ip}?fields=status,message,country,region,regionName,city,zip&lang=de`,
  );
  const data = await response.json();

  if (data.city && data.country) {
    return `${data.city}, ${data.country}`;
  } else if (data.country) {
    return data.country;
  } else {
    return "Unknown";
  }
};

export const getDeviceString = (userAgentInfo: UserAgentInfo): string => {
  const { browser, os, device } = userAgentInfo;

  if (
    device?.vendor &&
    device?.model &&
    os?.name &&
    os?.version &&
    browser?.name
  ) {
    return `${device.vendor} ${device.model}, ${os.name} v${os.version} ${browser.name}`;
  }

  if (os?.name && os?.version && browser?.name) {
    return `${os.name} v${os.version} ${browser.name}`;
  }

  return userAgentInfo.ua || "Unknown";
};
