import axios, { AxiosError } from "axios";

const BASE_URL = "YOUR BASEURL HERE";

export const client = axios.create({
  baseURL: BASE_URL,
  // headers: getContextHeaders()
});

// Add a response interceptor
client.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.warn("API ERROR DATA", error.response.data);
      console.warn("API ERROR STATUS", error.response.status);
      console.warn("API ERROR HEADERS", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.warn("API ERROR REQUEST", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.warn("API ERROR MESSAGE", error.message);
    }
    console.warn("API ERROR CONFIG", error.config);

    return Promise.reject(error);
  }
);
