import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllOrganisasiAmal = () =>
    apiClient.get(ENDPOINTS.GET_ALL_ORGANISASI_AMAL);

export const GetOrganisasiAmalById = (id) =>
    apiClient.get(ENDPOINTS.SHOW_ORGANISASI_AMAL(id));

export const UpdateOrganisasiAmal = (id, formData) => {
    const response = apiClient.put(ENDPOINTS.UPDATE_ORGANISASI_AMAL(id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
    }).then(response => {
        // Menangani response jika sukses
        return response.data; // Mengembalikan data response untuk digunakan lebih lanjut
    }).catch(error => {
        // Menangani error jika request gagal
        console.error("Gagal mengupdate data organisasi amal:", error);
        throw error; // Melempar error agar bisa ditangani di tempat lain
    });
    return response;
}

export const DeleteOrganisasiAmal = (id) =>
    apiClient.delete(ENDPOINTS.DELETE_ORGANISASI_AMAL(id));

export const CreateOrganisasiAmal = (data) =>
    apiClient.post(ENDPOINTS.CREATE_ORGANISASI_AMAL, data);