import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllRequestDonasi = () =>
    apiClient.get(ENDPOINTS.GET_ALL_REQUEST_DONASI);

export const GetRequestDonasiById = (id) =>
    apiClient.get(ENDPOINTS.SHOW_REQUEST_DONASI(id));

export const UpdateRequestDonasi = (id, data) =>
    apiClient.put(ENDPOINTS.UPDATE_REQUEST_DONASI(id), data);

export const DeleteRequestDonasi = (id) =>
    apiClient.delete(ENDPOINTS.DELETE_REQUEST_DONASI(id));
