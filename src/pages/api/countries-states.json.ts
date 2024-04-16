import type { APIRoute } from "astro";
import json from "../../libs/geo/countries_states_cleaned.json";

export const GET: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    return new Response(JSON.stringify(json), { status: 200 });
  }
  return new Response(null, { status: 400 });
}