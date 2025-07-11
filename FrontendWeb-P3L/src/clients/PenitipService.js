import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllPenitip = async () => {
    const response = await apiClient.get(ENDPOINTS.GET_ALL_PENITIP);
    return response;
}

export const GetAllPenitipCustom = async () => {
    const response = await apiClient.get(ENDPOINTS.GET_ALL_PENITIP_CUSTOM);
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

export const AddPenitip = (data) =>
    apiClient.post(ENDPOINTS.CREATE_PENITIP, data);

export const DeletePenitip = async (id) => {
    const response = await apiClient.delete(ENDPOINTS.DELETE_PENITIP(id));
    return response;
}

export const UpdateTotalPoinPenitip = (id, newPoin) =>
    apiClient.put(ENDPOINTS.UPDATE_PENITIP(id), { total_poin: newPoin });

export const AddKeuntunganPenitip = (id, tambahan_keuntungan) =>
    apiClient.put(ENDPOINTS.ADD_KEUNTUNGAN_PENITIP(id), { tambahan_keuntungan });

export const TarikSaldoPenitip = async (id, data) => {
    try {
        const response = await apiClient.put(ENDPOINTS.TARIK_SALDO_PENITIP(id), data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in TarikSaldoPenitip:', error);
        throw error;
    }
}

export const UpdateKeuntunganPenitip = async (id_penitip, tambahan_keuntungan) => {
  try {
    // Ambil data penitip saat ini
    const currentPenitip = await GetPenitipById(id_penitip);
    const currentKeuntungan = parseFloat(currentPenitip.data.keuntungan || 0);
    
    // Hitung keuntungan baru
    const newKeuntungan = currentKeuntungan + parseFloat(tambahan_keuntungan);
    
    // Update keuntungan penitip
    return await UpdatePenitip(id_penitip, { keuntungan: newKeuntungan });
  } catch (error) {
    console.error('Error updating keuntungan penitip:', error);
    throw error;
  }
};
