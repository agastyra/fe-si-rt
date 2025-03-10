import {Link} from "react-router-dom"
import DashboardLayout from "../components/Layouts/DashboardLayout.jsx";
import {Breadcrumb, Table, Pagination, Alert, TextInput, Button, Modal, Label, Select} from "flowbite-react";
import {HiHome, HiOutlineExclamationCircle} from "react-icons/hi";
import apiClient, {
    deletePenghuniRumah,
    deleteTipeTransaksi, fetchPenghuni, fetchPenghuniRumah, fetchRumah,
    fetchTipeTransaksi, postPenghuniRumah,
    postTipeTransaksi, putPenghuniRumah,
    putTipeTransaksi
} from "../services/apiClient.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";

function PenghuniRumah() {
    const [response, setResponse] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [penghuniRumah_id, setPenghuniRumah_id] = useState(null)
    const [search, setSearch] = useState("")

    const [form, setForm] = useState({
        id: null,
        rumah_id: null,
        penghuni_id: null,
        periode_bulan_mulai: null,
        periode_bulan_selesai: null,
        periode_tahun_mulai: null,
        periode_tahun_selesai: null,
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

    const [penghuni, setPenghuni] = useState([])
    const [rumah, setRumah] = useState([])

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
            rumah_id: null,
            penghuni_id: null,
            periode_bulan_mulai: null,
            periode_bulan_selesai: null,
            periode_tahun_mulai: null,
            periode_tahun_selesai: null,
        });
    }

    const showAlert = (message) => {
        return openAlert && (
            <Alert color="success" onDismiss={() => setOpenAlert(false)}>
                {message}
            </Alert>
        )
    }

    const filteredData = response.data?.filter(value =>
        value.penghuni.nama_lengkap.toLowerCase().includes(search.toLowerCase())
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

    const getPenghuni = async () => {
        try {
            const response = await fetchPenghuni({all: true});
            setPenghuni(response.data.data);
        } catch (e) {
            if (e.name !== "AbortError") {
                console.error(e.message);
            }
        }
    };

    const getPenghuniRumah = async () => {
        try {
            const response = await fetchPenghuniRumah();
            setResponse(response.data);
        } catch (e) {
            if (e.name !== "AbortError") {
                console.error(e.message);
            }
        }
    };

    const getDetailPenghuniRumah = async (id) => {
        try {
            const response = await apiClient.get(`/penghuni-rumah/${id}`);
            const {rumah, penghuni, periode_bulan_mulai, periode_bulan_selesai, periode_tahun_mulai, periode_tahun_selesai} = response.data.data
            setForm({id, rumah_id: rumah.id, penghuni_id: penghuni.id, periode_bulan_mulai, periode_bulan_selesai, periode_tahun_mulai, periode_tahun_selesai});
        } catch (e) {
            console.error(e.message);
        }
    }

    async function submit(e) {
        e.preventDefault();
        if (!form.id) {
            try {
                await postPenghuniRumah(form)
                setOpenModal(false)
                setOpenAlert(true)
                setAlertMessage("Store data 'Penghuni Rumah' successfully!")

                resetForm()
                await getPenghuniRumah()
            } catch (e) {
                console.error(e.message)
            }
        } else {
            await updateData(e);
        }
    }

    const updateData = async (e) => {
        e.preventDefault();
        try {
            await putPenghuniRumah(form.id, form)
            setOpenModal(false)
            setOpenAlert(true)
            setAlertMessage("Update data 'Penghuni Rumah' successfully!")

            resetForm()
            await getPenghuniRumah()
        } catch (e) {
            console.error(e.message)
        }
    };

    const deleteData = async (id) => {
        try {
            await deletePenghuniRumah(id);
            setOpenConfirmationModal(false);
            setOpenAlert(true);
            setAlertMessage("Delete data 'Penghuni Rumah' successfully!");
            await getPenghuniRumah();
        } catch (e) {
            console.error(e.message);
        }
    }

    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login")
        }
        getPenghuniRumah();
        getRumah()
        getPenghuni()
    }, []);

    return (
        <>
            <DashboardLayout title={"History Penghuni Rumah"}>
                <DashboardLayout.Breadcump>
                    <Breadcrumb>
                        <Link to={"/"}>
                            <Breadcrumb.Item icon={HiHome}>
                                Dashboard
                            </Breadcrumb.Item>
                        </Link>
                        <Breadcrumb.Item as={Link} to="/penghuni-rumah">History Penghuni Rumah</Breadcrumb.Item>
                    </Breadcrumb>
                </DashboardLayout.Breadcump>

                <section className={"my-10"}>
                    {showAlert(alertMessage)}
                    <div className="flex justify-between items-center mt-5">
                        <TextInput id="small"
                                   type="text"
                                   sizing="sm"
                                   placeholder={"Ketik untuk mencari berdasarkan nama..."}
                                   className={"mb-5 w-1/2"}
                                   onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={() => setOpenModal(true)} className={"mb-5"}>Penghuni Rumah Baru</Button>
                    </div>
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell className="w-1/4">Penghuni</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Rumah</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Periode</Table.HeadCell>
                            <Table.HeadCell className="w-1/12">Action</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {filteredData?.length > 0 ? filteredData.map((item, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell className="w-1/4">{item.penghuni.nama_lengkap}</Table.Cell>
                                    <Table.Cell className="w-1/4">{item.rumah.blok}</Table.Cell>
                                    {item.periode_bulan_mulai && item.periode_bulan_selesai && item.periode_tahun_mulai && item.periode_tahun_selesai && (
                                        <Table.Cell className="w-1/4">{bulan[item.periode_bulan_mulai - 1]}, {item.periode_tahun_mulai} - {bulan[item.periode_bulan_selesai - 1]}, {item.periode_tahun_selesai}</Table.Cell>
                                    )}
                                    <Table.Cell className="w-1/12 flex gap-5">
                                        <a href="#"
                                           className="font-medium text-[#0e7490] dark:text-blue-500 hover:underline"
                                           onClick={async (e) => {
                                               e.preventDefault();
                                               await getDetailPenghuniRumah(item.id);
                                               setOpenModal(true);
                                           }}>Edit</a>
                                        <a href="#"
                                           className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                           onClick={(e) => {
                                               e.preventDefault();
                                               setOpenConfirmationModal(true)
                                               setPenghuniRumah_id(item.id)
                                           }}>Delete</a>
                                    </Table.Cell>
                                </Table.Row>
                            )) : (
                                <Table.Row>
                                    <Table.Cell colSpan={3} className="text-center">
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

            <Modal show={openModal} size="lg" popup onClose={() => setOpenModal(false)}>
                <Modal.Header/>
                <Modal.Body>
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Data Penghuni Rumah</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="penghuni" value="Penghuni"/>
                                </div>
                                <Select id="penghuni_id" required
                                        value={form.penghuni_id}
                                        onChange={(e) => setForm({...form, penghuni_id: e.target.value})}>
                                    <option selected disabled>Pilih Penghuni</option>
                                    {penghuni.map((item, index) => (
                                        <option key={index} value={item.id}>{item.nama_lengkap}</option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="rumah" value="Rumah"/>
                                </div>
                                <Select id="rumah_id" required
                                        value={form.rumah_id}
                                        onChange={(e) => setForm({...form, rumah_id: e.target.value})}>
                                    <option selected disabled>Pilih Rumah</option>
                                    {rumah.map((item, index) => (
                                        <option key={index} value={item.id}>{item.blok}</option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="periode_bulan_mulai" value="Periode Masuk"/>
                                </div>
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <Select id="periode_bulan_mulai" required
                                            value={form.periode_bulan_mulai}
                                            onChange={(e) => setForm({...form, periode_bulan_mulai: e.target.value})}>
                                        <option selected disabled>Pilih Bulan</option>
                                        {bulan.map((item, index) => (
                                            <option key={index} value={index + 1}>{item}</option>
                                        ))}
                                    </Select>
                                    <TextInput type="number" value={form.periode_tahun_mulai} placeholder={"Tahun Masuk"}
                                               onChange={(e) => setForm(({...form, periode_tahun_mulai: e.target.value}))}/>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="periode_bulan_selesai" value="Periode Keluar"/>
                                </div>
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <Select id="periode_bulan_selesai" required
                                            value={form.periode_bulan_selesai}
                                            onChange={(e) => setForm({...form, periode_bulan_selesai: e.target.value})}>
                                        <option selected disabled>Pilih Bulan</option>
                                        {bulan.map((item, index) => (
                                            <option key={index} value={index + 1}>{item}</option>
                                        ))}
                                    </Select>
                                    <TextInput type="number" value={form.periode_tahun_selesai} placeholder={"Tahun" +
                                        " Keluar"}
                                               onChange={(e) => setForm(({...form, periode_tahun_selesai: e.target.value}))}/>
                                </div>
                            </div>

                            <div className="w-full">
                                <Button type={"submit"}>Simpan Data</Button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

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
                            <Button color="gray" onClick={() => deleteData(penghuniRumah_id)}>
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

export default PenghuniRumah