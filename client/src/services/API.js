// Function to fetch site data
export const fetchSiteData = async (accessToken, siteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/site-data?siteId=${siteId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Site data response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching site data:", error);
    return null;
  }
};

// Function to fetch consumption summary
export const fetchSiteData_ConsumptionSummary = async (
  accessToken,
  siteId,
  startDate,
  endDate
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/site-data/consumption-summary?siteId=${siteId}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Consumption summary response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching consumption summary:", error);
    return null;
  }
};

export const fetchCostConsumptionSummary = async (accessToken) => {
  try {
    const response = await fetch(`https://admin.qenergy.ai/api/site/all/cost_consumption_summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data === 'object' && data.total_cost !== undefined) {
      return data;
    } else {
      console.warn("fetchCostConsumptionSummary: Unexpected data format", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching site data:", error);
    return null;
  }
};