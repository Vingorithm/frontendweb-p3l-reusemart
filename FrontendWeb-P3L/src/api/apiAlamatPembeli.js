import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "./endpoints";

export const apiAlamatPembeli = {
    getAllAlamatPembeli: async () => {
        const response = await axiosInstance.get(ENDPOINTS.GET_ALL_ALAMAT_PEMBELI);
        return response.data;
    },
    getAlamatPembeliById: async (id) => {
        const response = await axiosInstance.get(ENDPOINTS.SHOW_ALAMAT_PEMBELI(id));
        return response.data;
    },
    getAlamatPembeliByIdPembeli: async (id) => {
        const response = await axiosInstance.get(ENDPOINTS.SEARCH_ALAMAT_PEMBELI_BY_PEMBELI(id));
        return response.data.alamat;
    },
    createAlamatPembeli: async (data) => {
        const response = await axiosInstance.post(ENDPOINTS.CREATE_ALAMAT_PEMBELI, data);
        return response.data;
    },
    updateAlamatPembeli: async (id, data) => {
        const response = await axiosInstance.put(ENDPOINTS.UPDATE_ALAMAT_PEMBELI(id), data);
        return response.data;
    },
    deleteAlamatPembeli: async (id) => {
        const response = await axiosInstance.delete(ENDPOINTS.DELETE_ALAMAT_PEMBELI(id));
        return response.data;
    }
};