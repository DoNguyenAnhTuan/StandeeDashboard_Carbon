// Constants
const HOST = "https://admin.qenergy.ai";
const LOGIN_ENDPOINT = "/api/auth/login/";

// Function to get access token
async function getAccessToken() {
    const loginUrl = `${HOST}${LOGIN_ENDPOINT}`;
    const payload = {
        role: 0,
        password: "Qbots2022",
        email: "eiu@qenergy.ai"
    };

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            return data.access_token;
        } else {
            console.error("Login Failed:", response.status, await response.text());
            return null;
        }
    } catch (error) {
        console.error("Error during login:", error);
        return null;
    }
}

// Function to fetch site data
/**
 * @param {string} accessToken - The access token for authentication
 * @param {string} siteId - The site ID to fetch data for
 * @returns {Promise<Object|null>} The site data or null if there was an error
 */
async function fetchSiteData(accessToken, siteId) {
    if (!siteId || siteId === "all") {
        siteId = "712"; // Mặc định là Block 11A nếu không có trang web nào được chọn hoặc ALL SITES
    }
    const siteUrl = `${HOST}/api/site/${siteId}/`;

    try {
        const response = await fetch(siteUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error:", response.status, await response.text());
            return null;
        }
    } catch (error) {
        console.error("Error fetching site data:", error);
        return null;
    }
}

/**
 * @param {string} accessToken - The access token for authentication
 * @param {string} siteId - The site ID to fetch data for
 * @param {string} startDate - The start date for the consumption data
 * @param {string} endDate - The end date for the consumption data
 * @returns {Promise<Array|null>} The consumption data or null if there was an error
 */
async function fetchSiteData_ConsumptionSummary(accessToken, siteId, startDate, endDate) {
    if (!siteId || siteId === "all") {
        siteId = "712"; // Default to Block 11A if no site selected or ALL SITES
    }
    const siteUrl = `${HOST}/api/site/${siteId}/consumption/profile/${startDate}/${endDate}`;

    try {
        const response = await fetch(siteUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            } else {
                console.warn("Consumption Summary is empty or invalid:", data);
                return null;
            }
        } else {
            console.error("Error:", response.status, await response.text());
            return null;
        }
    } catch (error) {
        console.error("Error fetching site consumption summary:", error);
        return null;
    }
}

/**
 * @param {string} accessToken - The access token for authentication
 * @param {string} siteId - The site ID to fetch data for
 * @param {string} date - The date to fetch hourly data for
 * @returns {Promise<Array>} The hourly data
 */
async function fetchHourlyData(accessToken, siteId, date) {
    if (!siteId || siteId === "all") {
        siteId = "712"; // Default to Block 11A if no site selected or ALL SITES
    }
    const hourlyUrl = `${HOST}/api/site/${siteId}/consumption/hourly/${date}`;

    try {
        const response = await fetch(hourlyUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data || [];
        } else {
            console.error("Error:", response.status, await response.text());
            return [];
        }
    } catch (error) {
        console.error("Error fetching hourly data:", error);
        return [];
    }
}

async function fetchCostConsumptionSummary(accessToken) {
    const siteUrl = `${HOST}/api/site/all/cost_consumption_summary`;

    try {
        const response = await fetch(siteUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Trả về data nếu là object và có thuộc tính total_cost
            if (data && typeof data === 'object' && data.total_cost !== undefined) {
                return data;
            } else {
                console.warn("fetchCostConsumptionSummary: Unexpected data format", data);
                return null;
            }
        } else {
            console.error("Error:", response.status, await response.text());
            return null;
        }
    } catch (error) {
        console.error("Error fetching site consumption summary:", error);
        return null;
    }
}

// Main function
async function main() {
    // Get the access token
    const accessToken = await getAccessToken();
    if (accessToken) {
        console.log("Access Token retrieved successfully.");
        // Fetch site data using the token
        const siteData = await fetchSiteData(accessToken, "711"); // Default to Block 11A
        const siteData1 = await fetchSiteData_ConsumptionSummary(accessToken, "711", "2025-04-01", "2025-04-30");
        const costConsumptionSummary = await fetchCostConsumptionSummary(accessToken);
        if (siteData) {
            // console.log("Live Power:", siteData.live_power);
            // console.log("ID:", siteData.id);
            console.log("costConsumptionSummary1:", costConsumptionSummary.total_cost);
            console.log("costConsumptionSummary2:", costConsumptionSummary.total_consumption);
            
        } else {
            console.log("Failed to retrieve site data.");
        }
    } else {
        console.log("Unable to authenticate.");
    }
}

// Execute main function
main();

// Export the functions
export { getAccessToken, fetchSiteData, fetchSiteData_ConsumptionSummary, fetchHourlyData, fetchCostConsumptionSummary };