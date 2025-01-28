import axios from "axios";
import { store } from "../store";

export default () => {
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;

      if (error.response.status === 401) {
        store.logout();
      } else if (error.response.status === 503) {
        if (!originalRequest.__retryCount) {
          originalRequest.__retryCount = 0;
        }

        if (originalRequest.__retryCount < 2) {
          originalRequest.__retryCount += 1;

          const delay = new Promise((resolve) => setTimeout(resolve, 3000));
          await delay;

          return axios(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );
};
