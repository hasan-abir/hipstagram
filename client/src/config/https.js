import axios from "axios";
import { store } from "../store";

export default () => {
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        store.logout();
      } else {
        return Promise.reject(error);
      }
    }
  );
};
