import type { APIRoute } from "astro";
import MarketplaceApi from "../../sdk/MarketplaceApi";

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const encodeNextPage = body.encodeNextPage;
    const config = {
      latitude: -12.0611,
      longitude: -77.0353,
      radiusKm: 65,
      city: "lima",
      searchSlug: "acura",
      itemCount: 10
    };
    try {
      let itemsCount = 0;
      let items: any[] = [];
      let _encodeNextPage = '';
      const api = new MarketplaceApi(config);

      if (encodeNextPage) {
        const result = await api.searchQueryPagination(encodeNextPage);
        console.log('Result Pagination:', result);
        itemsCount += result.items.length;
        items = items.concat(result.items);
        _encodeNextPage = result.encodeNextPage;
        console.log('Items count:', itemsCount);
        return new Response(JSON.stringify({
          message: "ok",
          error: false,
          data: { items, itemsCount, encodeNextPage: _encodeNextPage },
        }), { status: 200 });
      }
      const result = await api.searchQuery();
      console.log('Result:', result);
      itemsCount += result.items.length;
      items = items.concat(result.items);
      _encodeNextPage = result.encodeNextPage;
      console.log('Items count:', itemsCount);
      return new Response(JSON.stringify({
        message: "ok",
        error: false,
        data: { items, itemsCount, encodeNextPage: _encodeNextPage },
      }), { status: 200 });

    } catch (error: any) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        message: error.message,
        error: true
      }), { status: 500 });
    }

  }

  return new Response(null, { status: 400 });
}