export function getAccessToken(): Promise<string>;
export function fetchSiteData(accessToken: string, siteId: string): Promise<any>;
export function fetchSiteData_ConsumptionSummary(accessToken: string, siteId: string, startDate: string, endDate: string): Promise<any>; 