import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const apiKeranjang = {
    getKeranjangByIdPembeli: async (id) => {
        const response = await apiClient.get(ENDPOINTS.SHOW_KERANJANG_BY_ID_PEMBELI(id));
        return response.data;
    },
}