// pages/api/qenergy.ts
import type { NextApiRequest, NextApiResponse } from "next";

const HOST = "https://admin.qenergy.ai";
const LOGIN_ENDPOINT = "/api/auth/login/";
const SITE_ENDPOINTS = [
  { id: "708", name: "EIU Block 5" },
  { id: "709", name: "EIU Block 4" },
  { id: "710", name: "EIU Block 8" },
  { id: "711", name: "EIU Block 10" },
  { id: "712", name: "EIU Block 11A" },
  { id: "713", name: "EIU Block 11B" },
  { id: "716", name: "EIU Block 3" },
  { id: "717", name: "EIU Block 6" },
  { id: "714", name: "EIU Garage" },
];

const START_DATE = "2025-01-01";
const END_DATE = "2025-12-01";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("🔐 Logging in...");

    const loginRes = await fetch(`${HOST}${LOGIN_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: 0,
        email: "eiu@qenergy.ai",
        password: "Qbots2022",
      }),
    });

    if (!loginRes.ok) {
      console.error("❌ Login failed with status", loginRes.status);
      return res.status(401).json({ error: "Login failed" });
    }

    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log("✅ Logged in. Token received.");

    const results = await Promise.all(
      SITE_ENDPOINTS.map(async (site) => {
        const url = `${HOST}/api/site/${site.id}/consumption/profile/${START_DATE}/${END_DATE}`;
        try {
          console.log(`📡 Fetching ${site.name} (${site.id})...`);
          const dataRes = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!dataRes.ok) {
            console.warn(`⚠️ Failed to fetch ${site.name} (${site.id}) with status ${dataRes.status}`);
            return { ...site, actual: 0, carbon_emission: 0, error: true };
          }

          const data = await dataRes.json();
          const blockData = Array.isArray(data) ? data[0] : data;
          console.log(`✅ Success ${site.name} (${site.id}):`, blockData);

          return { ...site, ...blockData };
        } catch (err) {
          console.error(`❌ Error fetching ${site.name} (${site.id}):`, err);
          return { ...site, actual: 0, carbon_emission: 0, error: true };
        }
      })
    );

    console.log("🚀 Final result:", results);
    res.status(200).json(results);
  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
}
