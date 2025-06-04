import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllPengiriman = () =>
    apiClient.get(ENDPOINTS.GET_ALL_PENGIRIMAN);

export const GetPengirimanById = (id) =>
    apiClient.get(ENDPOINTS.SHOW_PENGIRIMAN(id));

export const CreatePengiriman = (data) => 
  apiClient.post(ENDPOINTS.CREATE_PENGIRIMAN, data);

export const UpdatePengirimanStatus = (id, status_pengiriman, tanggal_mulai, tanggal_berakhir, id_pengkonfirmasi) =>
  apiClient.put(ENDPOINTS.UPDATE_PENGIRIMAN(id), {
    id_pembelian: null, // Optional, set if needed
    id_pengkonfirmasi: null, // Optional, set if needed,
    tanggal_mulai: null, // Optional, set if needed,
    tanggal_berakhir: null, // Optional, set if needed,
    status_pengiriman,
    jenis_pengiriman: 'Ambil di gudang', // Match your data
  });