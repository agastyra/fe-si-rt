import {Modal, Button, TextInput, Select, Label} from 'flowbite-react';
import {useTransaction} from "../../context/TransactionContext.jsx";
const TransactionModal = ({children, openModal, setOpenModal}) => {
        return (
        <Modal show={openModal} size="3xl" popup onClose={() => setOpenModal(false)} position="top-center">
            <Modal.Header/>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
};

const TransactionTable = ({tipeTransaksi}) => {
    const {transaksiDetail, setTransaksiDetail} = useTransaction()

    const bulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ]

    const handleTableChange = (index, key, value) => {
        const newData = [...transaksiDetail];
        newData[index][key] = value;
        setTransaksiDetail(newData);
    };

    const addRow = () => {
        setTransaksiDetail([...transaksiDetail, {tipe_transaksi_id: null, periode_bulan: null, periode_tahun: null, nominal: 0}]);
    };

    const removeRow = (index) => {
        const newData = transaksiDetail.filter((_, i) => i !== index);
        setTransaksiDetail(newData);
    };

    return (
        <div>
            <Label value="Rincian Pembayaran"/>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-4 py-2">Tipe Transaksi</th>
                    <th scope="col" className="px-4 py-2">Bulan</th>
                    <th scope="col" className="px-4 py-2">Tahun</th>
                    <th scope="col" className="px-4 py-2">Nominal</th>
                    <th scope="col" className="px-4 py-2">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {transaksiDetail.map((row, index) => (
                    <tr key={index} className="bg-white dark:bg-gray-800">
                        <td className="px-4 py-2">
                            <Select id="tipe_transaksi_id" required
                                    value={row.tipe_transaksi_id}
                                    onChange={(e) => handleTableChange(index, 'tipe_transaksi_id', e.target.value)}>
                                <option selected disabled>Pilih Tipe Transaksi</option>
                                {tipeTransaksi.map((item, index) => (
                                    <option key={index} value={item.id}>{item.nama}</option>
                                ))}
                            </Select>
                        </td>
                        <td className="px-4 py-2">
                            <Select id="periode_bulan" required
                                    value={row.periode_bulan}
                                    onChange={(e) => handleTableChange(index, 'periode_bulan', e.target.value)}>
                                <option selected disabled>Pilih Bulan</option>
                                {bulan.map((item, index) => (
                                    <option key={index} value={index + 1}>{item}</option>
                                ))}
                            </Select>
                        </td>
                        <td className="px-4 py-2">
                            <TextInput type="number" value={row.periode_tahun}
                                       onChange={(e) => handleTableChange(index, 'periode_tahun', e.target.value)}/>
                        </td>
                        <td className="px-4 py-2">
                            <TextInput type="number" value={row.nominal}
                                       onChange={(e) => handleTableChange(index, 'nominal', e.target.value)}/>
                        </td>
                        <td className="px-4 py-2">
                            <Button color="failure" size="xs" onClick={() => removeRow(index)}>Hapus</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Button color="blue" size="sm" className="mt-2" onClick={addRow}>Tambah Baris</Button>
        </div>
    )
}

TransactionModal.Table = TransactionTable

export default TransactionModal;
