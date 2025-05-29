import axios from "axios";
import { NAMES_CONSTANTS } from "../constants";

export const baseURL = process.env.REACT_APP_API_URL;
export const blockChainURL = process.env.REACT_APP_BLOCK_CHAIN_URL;

export const stripeIntegrationURL =
  process.env.REACT_APP_STRIPE_INTEGRATION_API_URL;

export const axiosInstanceBlockChain = axios.create({
  blockChainURL,
});

export const axiosInstance = axios.create({
      baseURL
    , responseType: "json"
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    async config => {
        config.headers = { 
            'Authorization': `Bearer ${ localStorage.getItem(NAMES_CONSTANTS.USER_ACCESS_TOKEN) }`
        }
        return config;
    }
    , error => {
      Promise.reject(error)
});

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    }
    , async function (error) {
        if (error.response.status === 401) {
            localStorage.removeItem('magicprovide')
            localStorage.removeItem('tokenbalance');
            localStorage.removeItem(NAMES_CONSTANTS.USER_ACCESS_TOKEN);
            localStorage.removeItem(NAMES_CONSTANTS.USER_WALLET_DETAILS);
            localStorage.removeItem('network');

            // window.location.replace('/')
        }

        return Promise.reject(error);
    }
);

export default axios.create({
  baseURL,
  responseType: "json",
});