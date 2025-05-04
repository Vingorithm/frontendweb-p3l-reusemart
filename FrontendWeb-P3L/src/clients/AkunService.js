import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllAkun = async () => {
    const response = await apiClient.get(ENDPOINTS.GET_ALL_AKUN);
    return response.data
}

export const GetAkunById = async (id) => {
    const response = await apiClient.get(ENDPOINTS.SHOW_AKUN(id));
    return response.data;
}

export const CreateAkun = async (data) => {
    const response = await apiClient.get(ENDPOINTS.CREATE_AKUN, data);
    return response.data;
}