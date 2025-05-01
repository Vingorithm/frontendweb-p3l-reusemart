import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const GetAllReviewProduk = () => 
  apiClient.get(ENDPOINTS.GET_ALL_REVIEW_PRODUK);

export const GetReviewProdukById = (id) => 
  apiClient.get(ENDPOINTS.SHOW_REVIEW_PRODUK(id));

export const GetReviewProdukByIdTransaksi = (id) => 
  apiClient.get(`${ENDPOINT.GET_REVIEW_BY_ID_TRANSAKSI}/byIdTransaksi/${id}`);

export const GetReviewProdukByIdBarang = (id) => 
  apiClient.get(`${ENDPOINTS.GET_REVIEW_BY_ID_BARANG}/byIdBarang/${id}`);

export const CreateReviewProduk = (data) => 
  apiClient.post(ENDPOINTS.CREATE_REVIEW_PRODUK, data);