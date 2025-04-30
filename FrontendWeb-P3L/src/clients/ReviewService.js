import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllReviewProduk = () =>
    apiClient.get(ENDPOINTS.GET_ALL_REVIEW_PRODUK);

export const GetReviewProdukByIdBarang = (id) =>
    apiClient.get(ENDPOINTS.SHOW_REVIEW_PRODUK(id));