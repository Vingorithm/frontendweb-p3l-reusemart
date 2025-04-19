import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ManagePegawaiPage from "../pages/admin/ManagePegawaiPage";
import ManageOrganisasiPage from "../pages/admin/ManageOrganisasiPage";
import ManageMerchandisePage from "../pages/admin/ManageMerchandisePage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Tidak Ditemukan!</div>,
  },
  {
    // Main Layout: Layout buat halaman utama
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/pegawai",
        element: <ManagePegawaiPage />,
      },
      {
        path: "/organisasi",
        element: <ManageOrganisasiPage />,
      },
      {
        path: "/merchandise",
        element: <ManageMerchandisePage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return (
    <>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
