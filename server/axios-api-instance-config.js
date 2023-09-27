/* Dedicated pool for API requests, which are constant and frequent. */
import axiosInstance from "axios";
import { HttpsAgent } from "agentkeepalive";

const httpsKeepaliveAgent = new HttpsAgent({
  maxSockets: 128, // max SNAT ports per endpoint is 128
  maxFreeSockets: 10,
  timeout: 60000, // active socket keepalive for 60 seconds
  freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
});

const axiosPoolForApi = axiosInstance.create({
  timeout: 12000, // http request timeout
  httpsAgent: httpsKeepaliveAgent,
});

/* axiosPoolForGraphQL.interceptors.request.use((request) => {
  console.log("Request", JSON.stringify(request, null, 2));
  console.log("Agent status: %j", httpsKeepaliveAgent.getCurrentStatus());
  return request;
}); */

export default axiosPoolForApi;
