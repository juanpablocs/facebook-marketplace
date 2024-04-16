class QueryService {
  static buildQuery(baseParams:any, { latitude, longitude, radiusKm }:any) {
    return {
      ...baseParams,
      buyLocation: { latitude, longitude },
      params: {
        ...baseParams.params,
        browse_request_params: {
          ...baseParams.params.browse_request_params,
          filter_location_latitude: latitude,
          filter_location_longitude: longitude,
          filter_radius_km: radiusKm
        }
      }
    };
  }
}

export default QueryService;