import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllPenitipan = () =>
    apiClient.get(ENDPOINTS.GET_ALL_PENITIPAN);

export const GetPenitipanById = (id) =>
    apiClient.get(ENDPOINTS.SHOW_PENITIPAN(id));