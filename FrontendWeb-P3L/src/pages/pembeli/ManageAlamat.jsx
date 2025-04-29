import React from 'react';

const ManageAlamat = () => {
    return <>
      {/* Main Section */}
      <main className="max-w-5xl mx-auto mt-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Halaman Kelola Alamat</h1>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Cari riwayat..."
            className="w-full max-w-md px-4 py-2 border rounded-full shadow-sm"
          />
          <button className="ml-4 text-gray-600 text-sm flex items-center">
            Urutkan berdasarkan waktu
            <span className="ml-1">&#9432;</span>
          </button>
        </div>

        {/* Tambah Alamat */}
        <div className="flex justify-end mb-6">
          <button className="bg-green-600 text-white px-6 py-2 rounded shadow">
            Tambah Alamat
          </button>
        </div>

        {/* Alamat Cards */}
        <div className="space-y-4">
          {/* Ulangi card ini sesuai jumlah alamat */}
          <div className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg">Rumah</h2>
              <p className="text-gray-600 text-sm">Jalan Babarsari No 69</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Edit
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Hapus
              </button>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2 text-sm">
          <button className="text-gray-500">&lt;</button>
          <button className="text-orange-500 font-semibold">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>
          <button className="text-gray-500">&gt;</button>
        </div>
      </main>
    </>
}

export default ManageAlamat;