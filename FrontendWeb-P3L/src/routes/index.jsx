import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "../layouts/MainLayout";
import LoginLayout from "../layouts/LoginLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import OwnerPage from "../pages/owner/OwnerPage";
import AdminPage from "../pages/admin/AdminPage";
import PegawaiGudangPage from "../pages/pegawai-gudang/PegawaiGudangPage";
import PembeliPage from "../pages/pembeli/PembeliPage";
import PenitipPage from "../pages/penitip/PenitipPage";
import CsPage from "../pages/cs/CsPage";
import OrganisasiPage from "../pages/organisasi/OrganisasiPage";
import ManagePegawaiPage from "../pages/admin/ManagePegawaiPage";
import ManageOrganisasiPage from "../pages/admin/ManageOrganisasiPage";
import ManageMerchandisePage from "../pages/admin/ManageMerchandisePage";
import PenitipProfile from "../pages/penitip/PenitipProfile";
import PenitipHistory from "../pages/penitip/PenitipHistory";
import ManageAlamat from "../pages/pembeli/ManageAlamat";
import ResetPassword from "../pages/ResetPassword";

const mainRoutes = [
  // Halaman Utama
  { path: "/", element: <HomePage /> },

  // Halama Reset Password 
  { path: "/reset-password", element: <ResetPassword /> },

  // Halaman Owner
  { path: "/owner", element: <OwnerPage /> },

  // Halaman Admin
  { path: "/admin", element: <AdminPage /> },

  // Halaman Pegawai Gudang
  { path: "/pegawai-gudang", element: <PegawaiGudangPage /> },

  // Halaman Pembeli
  { path: "/pembeli", element: <PembeliPage /> },
  {  path: "/pembeli/alamat", element: <ManageAlamat />},

  // Halaman penitip
  { path: "/penitip", element: <PenitipPage /> },
  { path: "/penitip/profile", element: <PenitipProfile /> },
  { path: "/penitip/history", element: <PenitipHistory /> },

  // Halaman Customer Service
  { path: "/cs", element: <CsPage /> },

  // Halaman Organisasi
  { path: "/organisasi", element: <OrganisasiPage /> },

  // Halaman Admin
  { path: "/admin/pegawai", element: <ManagePegawaiPage /> },
  { path: "/admin/organisasi", element: <ManageOrganisasiPage /> },
  { path: "/admin/merchandise", element: <ManageMerchandisePage /> },
];

const loginRoutes = [
  { path: "/login", element: <LoginPage /> },
]

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Tidak Ditemukan!</div>,
  },
  {
    element: <MainLayout />,
    children: mainRoutes,
  },
  {
    element: <LoginLayout />,
    children: loginRoutes,
  },
]);

const AppRouter = () => (
  <>
    <Toaster position="top-center" richColors />
    <RouterProvider router={router} />
  </>
);

export default AppRouter;
