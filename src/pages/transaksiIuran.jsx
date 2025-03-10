import {Link} from "react-router-dom"
import DashboardLayout from "../components/Layouts/DashboardLayout.jsx";
import {
    Alert,
    Breadcrumb,
    Button,
    Label,
    Modal,
    Pagination,
    Select,
    Table,
    TextInput,
} from "flowbite-react";
import {HiHome, HiOutlineExclamationCircle} from "react-icons/hi";
import apiClient, {
    deleteTransaksi,
    fetchRumah,
    fetchTipeTransaksi,
    fetchTransaksi,
    postTransaksi,
    putTransaksi,
} from "../services/apiClient.js";
import {Fragment, useEffect, useState} from "react";
import TransactionModal from "../components/Fragments/TransactionModal.jsx";
import {useTransaction} from "../context/TransactionContext.jsx";
import {useNavigate} from "react-router";

function TransaksiIuran() {
    const [response, setResponse] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [search, setSearch] = useState("")
    const [openRowId, setOpenRowId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [transaksi_id, setTransaksi_id] = useState(null)
    const [rumah, setRumah] = useState([])
    const [tipeTransaksi, setTipeTransaksi] = useState([])
    const { transaksiDetail, setTransaksiDetail } = useTransaction()

    const [form, setForm] = useState({
        id: null,
        rumah_id: undefined,
        tanggal_transaksi: new Date().toISOString().split('T')[0],
        no_transaksi: "",
        transaksi_detail: []
    });

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

    useEffect(() => {
        if (!openModal) {
            resetForm()
        }
    }, [openModal]);

    const onPageChange = async (page) => {
        setCurrentPage(page);

        try {
            const response = await apiClient.get("/rumah", {
                params: {page}
            })
            setResponse(response.data);
        } catch (e) {
            console.error(e.message);
        }
    };

    const resetForm = () => {
        setForm({
            id: null,
            rumah_id: undefined,
            tanggal_transaksi: new Date().toISOString().split('T')[0],
            no_transaksi: "",
            transaksi_detail: []
        });
        setTransaksiDetail([])
    }

    const showAlert = (message) => {
        return openAlert && (
            <Alert color="success" onDismiss={() => setOpenAlert(false)}>
                {message}
            </Alert>
        )
    }

    const toggleRow = (id) => {
        setOpenRowId(openRowId === id ? null : id);
    };

    const filteredData = response.data?.filter(value =>
        value.no_transaksi.toLowerCase().includes(search.toLowerCase())
    );

    const getRumah = async () => {
        try {
            const response = await fetchRumah({all: true});
            setRumah(response.data.data);
        } catch (e) {
            if (e.name !== "AbortError") {
                console.error(e.message);
            }
        }
    };

    const getTipeTransaksi = async () => {
        try {
            const response = await fetchTipeTransaksi({all: true, jenis: "Pemasukan"});
            setTipeTransaksi(response.data.data);
        } catch (e) {
            if (e.name !== "AbortError") {
                console.error(e.message);
            }
        }
    }

    const getTransaksi = async () => {
        try {
            const response = await fetchTransaksi({jenis: "Pemasukan"});
            setResponse(response.data);
            setForm((prevForm) => ({
                ...prevForm,
                no_transaksi: response.data.transaction_number
            }));
        } catch (e) {
            console.error(e.message);
        }
    };


    const getDetailTransaksi = async (id) => {
        try {
            const response = await apiClient.get(`/transaksi/${id}`);
            const {rumah, no_transaksi,  tanggal_transaksi,  transaksi_detail} = response.data.data[0]

            transaksi_detail.forEach((value) => {
                setTransaksiDetail((prev) => [...prev, {tipe_transaksi_id: value.tipe_transaksi.id, nominal: parseInt(value.nominal), ...value}])
            })

            setForm({id, rumah_id: rumah.id, no_transaksi,  tanggal_transaksi, transaksi_detail: transaksi_detail});
        } catch (e) {
            console.error(e.message);
        }
    }

    useEffect(() => {
        const submit = async () => {
            if (isSubmitted && form.transaksi_detail.length > 0) {
                try {
                    if (!form.id) {
                        const response = await postTransaksi(form);
                        setOpenModal(false);
                        setOpenAlert(true);
                        setAlertMessage(response.data.message);

                        resetForm();
                        await getTransaksi();
                    } else {
                        await updateData(form.id, form);
                    }
                } catch (e) {
                    console.error(e.message);
                } finally {
                    setIsSubmitted(false);
                }
            }
        };

        submit()
        return  () => {
            setIsSubmitted(false)
        }
    }, [form, isSubmitted]);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitted(true)
        setForm((prevForm) => {
            return {...prevForm, transaksi_detail: transaksiDetail}
        })
    }

    const updateData = async (id, data) => {
        try {
            const response = await putTransaksi(id, data)
            setOpenModal(false)
            setOpenAlert(true)
            setAlertMessage(response.data.message)

            resetForm()
            await getTransaksi()
        } catch (e) {
            console.error(e.message)
        }
    };

    const deleteData = async (id) => {
        try {
            await deleteTransaksi(id);
            setOpenConfirmationModal(false);
            setOpenAlert(true);
            setAlertMessage("Delete data 'Transaksi' successfully!");
            await getTransaksi();
        } catch (e) {
            console.error(e.message);
        }
    }

    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login")
        }
        getRumah()
        getTipeTransaksi()
        getTransaksi();
    }, []);

    return (
        <>
            <DashboardLayout title={"Pembayaran Iuran"}>
                <DashboardLayout.Breadcump>
                    <Breadcrumb>
                        <Link to={"/"}>
                            <Breadcrumb.Item icon={HiHome}>
                                Dashboard
                            </Breadcrumb.Item>
                        </Link>
                        <Breadcrumb.Item as={Link} to="/pembayaran-iuran">Pembayaran Iuran</Breadcrumb.Item>
                    </Breadcrumb>
                </DashboardLayout.Breadcump>

                <section className={"my-10"}>
                    {showAlert(alertMessage)}
                    <div className="flex justify-between items-center mt-5">
                        <TextInput id="small"
                                   type="text"
                                   sizing="sm"
                                   placeholder={"Ketik untuk mencari berdasarkan nomor transaksi..."}
                                   className={"mb-5 w-1/2"}
                                   onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={() => setOpenModal(true)} className={"mb-5"}>Pembayaran Baru</Button>
                    </div>
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell className="w-1/4">No. Transaksi</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Tanggal Transaksi</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Rumah</Table.HeadCell>
                            <Table.HeadCell className="w-1/12">Action</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {filteredData?.length > 0 ? filteredData.map((item, index) => (
                                <Fragment key={index}>
                                    <Table.Row onClick={() => toggleRow(item.id)} className="cursor-pointer hover:bg-gray-100">
                                        <Table.Cell className="w-1/4">{item.no_transaksi}</Table.Cell>
                                        <Table.Cell className="w-1/4">{item.tanggal_transaksi}</Table.Cell>
                                        <Table.Cell className="w-1/4">{item.rumah.blok}</Table.Cell>
                                        <Table.Cell className="w-1/12 flex gap-5">
                                            <a href="#" className="text-blue-500 hover:underline"
                                               onClick={(e) => { e.stopPropagation(); getDetailTransaksi(item.id); setOpenModal(true); }}>
                                                Edit
                                            </a>
                                            <a href="#" className="text-red-600 hover:underline"
                                               onClick={(e) => { e.stopPropagation(); setOpenConfirmationModal(true); setTransaksi_id(item.id); }}>
                                                Delete
                                            </a>
                                        </Table.Cell>
                                    </Table.Row>

                                    {openRowId === item.id && item.transaksi_detail && item.transaksi_detail.map((detail, indexDetail) => (
                                        <Table.Row key={indexDetail} className="bg-gray-50">
                                            <Table.Cell className="w-1/4 pl-12">{detail.tipe_transaksi.nama}</Table.Cell>
                                            <Table.Cell className="w-1/4">{bulan[detail.periode_bulan - 1]}</Table.Cell>
                                            <Table.Cell className="w-1/4">{detail.periode_tahun}</Table.Cell>
                                            <Table.Cell className="w-1/4">{Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0
                                            }).format(detail.nominal)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Fragment>
                            )) : (
                                <Table.Row>
                                    <Table.Cell colSpan={4} className="text-center">
                                        Tidak ada data
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </section>

                <div className="flex overflow-x-auto sm:justify-center">
                    <Pagination layout="table" currentPage={currentPage}
                                totalPages={response.meta && response.meta.last_page} onPageChange={onPageChange} showIcons/>
                </div>
            </DashboardLayout>

            <TransactionModal openModal={openModal} setOpenModal={setOpenModal}>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Pembayaran Iuran</h3>
                        <div>
                            <Label htmlFor="no_transaksi" value="No. Transaksi"/>
                            <TextInput id="no_transaksi" type="text" placeholder="TRX-xx" required readOnly
                                       value={form.no_transaksi}
                                       onChange={(e) => setForm({...form, no_transaksi: e.target.value})}/>
                        </div>
                        <div>
                            <Label htmlFor="tanggal_transaksi" value="Tanggal Transaksi"/>
                            <input
                                type="date"
                                id="datepicker"
                                value={form.tanggal_transaksi}
                                onChange={(e) => setForm({...form, tanggal_transaksi: e.target.value})}
                                className="bg-white block w-full text-gray-900 border border-gray-300 rounded-lg focus:ring-[#0891b2] focus:border-[#0891b2]"
                            />
                        </div>
                        <div>
                            <Label htmlFor="rumah_id" value="Rumah"/>
                            <Select id="rumah_id" required
                                    value={form.rumah_id}
                                    onChange={(e) => setForm({...form, rumah_id: e.target.value})}>
                                <option selected disabled>Pilih Rumah</option>
                                {rumah?.map((item, index) => (
                                    <option key={index} value={item.id}>{item.blok}</option>
                                ))}
                            </Select>
                        </div>

                        <TransactionModal.Table tipeTransaksi={tipeTransaksi} />

                        <div className="w-full">
                            <Button type="submit">Simpan Data</Button>
                        </div>
                    </div>
                </form>
            </TransactionModal>

            <Modal show={openConfirmationModal} size="md" onClose={() => setOpenConfirmationModal(false)} popup>
                <Modal.Header/>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah anda yakin ingin menghapus data ini?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="gray" onClick={() => deleteData(transaksi_id)}>
                                {"Ya, saya yakin"}
                            </Button>
                            <Button color="failure" onClick={() => setOpenConfirmationModal(false)}>
                                Tidak, batal
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default TransaksiIuran