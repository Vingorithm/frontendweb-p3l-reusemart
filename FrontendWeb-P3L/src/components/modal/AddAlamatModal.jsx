const AddAlamatModal = ({ id_pembeli, onAdd }) => {

    const handleAdd = async () => {
      await onAdd();
    };

    return <form action="">
      <div className="modal fade" id="add-alamat-modal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Tambah Alamat</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label for="nama-alamat" className="form-label fw-semibold">Nama Alamat</label>
                  <input type="text" className="form-control" id="nama-alamat" name="nama_alamat" />
                </div>

                <div className="mb-3">
                  <label for="alamat-lengkap" className="form-label fw-semibold">Alamat Lengkap</label>
                  <input type="text" className="form-control" id="alamat-lengkap" name="alamat_lengkap" />
                </div>

                <div className="mb-3">
                  <input type="checkbox" className="form-check-input" id="is-main-address" name="is_main_address" />
                  <label for="is-main-address" className="ms-2 form-check-label">Jadikan alamat utama?</label>
                </div>

                <input type="hidden" value={id_pembeli} name="id_pembeli" id="id-pembeli"/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" className="btn btn-success" onClick={handleAdd} data-bs-dismiss="modal" aria-label="Close">Tambah</button>
              </div>
            </div>
          </div>
      </div>
    </form>
}

export default AddAlamatModal;