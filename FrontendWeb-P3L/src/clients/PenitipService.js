import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllPenitip = async () => {
    const response = await apiClient.get(ENDPOINTS.GET_ALL_PENITIP);
    return response;
}

export const GetPenitipById = async (id) => {
    const response = await apiClient.get(ENDPOINTS.SHOW_PENITIP(id));
    return response;
}

export const GetPenitipByIdAkun = async (id) => {
    const response = await apiClient.get(ENDPOINTS.SEARCH_PENITIP_BY_AKUN(id));
    return response.data.penitip;
}

export const UpdatePenitip = (id, data) =>
    apiClient.put(ENDPOINTS.UPDATE_PENITIP(id), data);
    