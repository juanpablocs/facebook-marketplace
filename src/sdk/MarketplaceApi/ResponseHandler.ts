import constants from "./constants";

class ResponseHandler {
  static processItems(data:any) {
    const isNextPage = !!data.data?.marketplace_search?.feed_units?.page_info?.has_next_page;
    const encodeNextPage = data.data?.marketplace_search?.feed_units?.page_info?.end_cursor;
    const edges = data.data?.marketplace_search?.feed_units?.edges || [];
    const items = edges.map((edge:any) => ({
      nodeId: edge.node?.id,
      id: edge.node?.listing?.id,
      is_live: edge.node?.listing?.is_live,
      is_sold: edge.node?.listing?.is_sold,
      title: edge.node?.listing?.marketplace_listing_title,
      seller: edge.node?.listing?.marketplace_listing_seller,
      price: edge.node?.listing?.listing_price,
      price_old: edge.node?.listing?.strikethrough_price || { amount: '', formatted_amount: '' },
      image: edge.node?.listing?.primary_listing_photo?.image?.uri,
      url: `${constants.urlMarketplace}/item/${edge.node?.listing?.id}`,
      location: edge.node?.listing?.location,
    })).filter((item:any) => !!item.id);
    return { isNextPage, encodeNextPage, items };
  }
}

export default ResponseHandler;
