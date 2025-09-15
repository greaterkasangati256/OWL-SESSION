import { google } from "googleapis";

export async function GET() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const peopleService = google.people({ version: "v1", auth: oAuth2Client });

  const res = await peopleService.people.connections.list({
    resourceName: "people/me",
    personFields: "names,phoneNumbers",
  });

  const contacts =
    res.data.connections?.map((c) => ({
      name: c.names?.[0]?.displayName || "Unnamed",
      number: c.phoneNumbers?.[0]?.value || "",
    })) || [];

  return Response.json(contacts);
}