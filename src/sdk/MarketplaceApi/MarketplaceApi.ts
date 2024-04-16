import QueryService from './QueryService';
import NetworkService from './NetworkService';
import ResponseHandler from './ResponseHandler';
import constants from './constants';

class MarketplaceApi {
  latitude: number;
  longitude: number;
  radiusKm: number;
  city: string;
  searchSlug: string;
  itemCount: number;
  docId: string;
  baseQuery: { count: number; cursor: string | null; params: { bqf: { callsite: string; query: string; }; browse_request_params: { commerce_enable_local_pickup: boolean; commerce_enable_shipping: boolean; commerce_search_and_rp_available: boolean; commerce_search_and_rp_category_id: never[]; commerce_search_and_rp_condition: null; commerce_search_and_rp_ctime_days: null; filter_price_lower_bound: number; filter_price_upper_bound: number; }; custom_request_params: { browse_context: null; contextual_filters: never[]; referral_code: null; saved_search_strid: null; search_vertical: null; seo_url: string; surface: string; virtual_contextual_filters: never[]; }; }; };
  constructor({ latitude, longitude, radiusKm, city, searchSlug, itemCount }:any) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.radiusKm = radiusKm;
    this.city = city;
    this.searchSlug = searchSlug;
    this.itemCount = itemCount || 24;
    this.docId = '';
    this.baseQuery = {
      count: 10,
      cursor: null,
      params: {
        bqf: { callsite: "COMMERCE_MKTPLACE_SEO", query: "" },
        browse_request_params: {
          commerce_enable_local_pickup: true,
          commerce_enable_shipping: true,
          commerce_search_and_rp_available: true,
          commerce_search_and_rp_category_id: [],
          commerce_search_and_rp_condition: null,
          commerce_search_and_rp_ctime_days: null,
          filter_price_lower_bound: 0,
          filter_price_upper_bound: 214748364700
        },
        custom_request_params: {
          "browse_context": null,
          "contextual_filters": [],
          "referral_code": null,
          "saved_search_strid": null,
          "search_vertical": null,
          "seo_url": "acura",
          "surface": "TOPIC_PAGE",
          "virtual_contextual_filters": []
        }
      }
    };
  }

  async getDocId() {
    const url = `${constants.urlMarketplace}/${this.city}/${this.searchSlug}`;  // Construir URL dinámicamente
    const response = await fetch(url, {
      headers: {
        "sec-fetch-site": "same-origin",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      }
    });
    const data = await response.text();
    const pattern = /adp_CometMarketplaceSearchContentContainerQueryRelayPreloader_(?:.*?)","queryID":"(.*?)","variables/m;
    const match = pattern.exec(data);
    if (!match) {
      throw new Error('No match regex pattern');
    }
    this.docId = match[1];
  }

  async searchQuery() {
    if (!this.docId) {
      await this.getDocId();
    }
    console.log(this.docId)
    const query = QueryService.buildQuery(this.baseQuery, {
      latitude: this.latitude,
      longitude: this.longitude,
      radiusKm: this.radiusKm
    });
    const data = await this.fetchData(query);
    return ResponseHandler.processItems(data);
  }

  async searchQueryPagination(cursor:string) {
    if (!this.docId) {
      await this.getDocId();
    }
    this.baseQuery.cursor = cursor;
    const query = QueryService.buildQuery(this.baseQuery, {
      latitude: this.latitude,
      longitude: this.longitude,
      radiusKm: this.radiusKm
    });
    const data = await this.fetchData(query, true);
    return ResponseHandler.processItems(data);
}
  async fetchData(query:any, isNextPage = false) {
    const rawQuery = encodeURIComponent(JSON.stringify(query));
    const queryParam = isNextPage ? 'CometMarketplaceSearchContentPaginationQuery' : 'CometMarketplaceSearchContentContainerQuery';
    const options = {
      method: 'POST',
      headers: constants.defaultHeaders,
      body: `fb_api_caller_class=RelayModern&fb_api_req_friendly_name=${queryParam}&variables=${rawQuery}&server_timestamps=true&doc_id=${this.docId}`
    };
    return await NetworkService.fetchData(constants.urlApi, options);
  }

}

export default MarketplaceApi;
