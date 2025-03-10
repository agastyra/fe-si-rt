import {Link} from "react-router-dom"
import DashboardLayout from "../components/Layouts/DashboardLayout.jsx";
import {Breadcrumb, Table, Pagination, Alert, TextInput, Button, Modal, Label, Select} from "flowbite-react";
import {HiHome, HiOutlineExclamationCircle} from "react-icons/hi";
import apiClient, {
    deleteTipeTransaksi,
    fetchTipeTransaksi,
    postTipeTransaksi,
    putTipeTransaksi
} from "../services/apiClient.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";

function TipeTransaksi() {
    const [response, setResponse] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [tipeTransaksi_id, setTipeTransaksi_id] = useState(null)
    const [search, setSearch] = useState("")

    const [form, setForm] = useState({
        id: null,
        nama: "",
        jenis: undefined,
    });

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
            nama: "",
            jenis: undefined,
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
        value.nama.toLowerCase().includes(search.toLowerCase())
    );

    const getTipeTransaksi = async () => {
        try {
            const response = await fetchTipeTransaksi();
            setResponse(response.data);
        } catch (e) {
            if (e.name !== "AbortError") {
                console.error(e.message);
            }
        }
    };

    const getDetailTipeTransaksi = async (id) => {
        try {
            const response = await apiClient.get(`/tipe-transaksi/${id}`);
            const {nama, jenis} = response.data.data
            setForm({id, nama, jenis });
        } catch (e) {
            console.error(e.message);
        }
    }

    async function submit(e) {
        e.preventDefault();
        if (!form.id) {
            try {
                const response = await postTipeTransaksi(form)
                setOpenModal(false)
                setOpenAlert(true)
                setAlertMessage(response.data.message)

                resetForm()
                await getTipeTransaksi()
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
            const response = await putTipeTransaksi(form.id, form)
            setOpenModal(false)
            setOpenAlert(true)
            setAlertMessage(response.data.message)

            resetForm()
            await getTipeTransaksi()
        } catch (e) {
            console.error(e.message)
        }
    };

    const deleteData = async (id) => {
        try {
            await deleteTipeTransaksi(id);
            setOpenConfirmationModal(false);
            setOpenAlert(true);
            setAlertMessage("Delete data 'Tipe Transaksi' successfully!");
            await getTipeTransaksi();
        } catch (e) {
            console.error(e.message);
        }
    }

    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login")
        }
        getTipeTransaksi();
    }, []);

    return (
        <>
            <DashboardLayout title={"Tipe Transaksi"}>
                <DashboardLayout.Breadcump>
                    <Breadcrumb>
                        <Link to={"/"}>
                            <Breadcrumb.Item icon={HiHome}>
                                Dashboard
                            </Breadcrumb.Item>
                        </Link>
                        <Breadcrumb.Item as={Link} to="/tipe-transaksi">Tipe Transaksi</Breadcrumb.Item>
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
                        <Button onClick={() => setOpenModal(true)} className={"mb-5"}>Tipe Transaksi Baru</Button>
                    </div>
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell className="w-1/4">Nama</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Jenis</Table.HeadCell>
                            <Table.HeadCell className="w-1/12">Action</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {filteredData?.length > 0 ? filteredData.map((item, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell className="w-1/4">{item.nama}</Table.Cell>
                                    <Table.Cell className="w-1/4">{item.jenis}</Table.Cell>
                                    <Table.Cell className="w-1/12 flex gap-5">
                                        <a href="#"
                                           className="font-medium text-[#0e7490] dark:text-blue-500 hover:underline"
                                           onClick={async (e) => {
                                               e.preventDefault();
                                               await getDetailTipeTransaksi(item.id);
                                               setOpenModal(true);
                                           }}>Edit</a>
                                        <a href="#"
                                           className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                           onClick={(e) => {
                                               e.preventDefault();
                                               setOpenConfirmationModal(true)
                                               setTipeTransaksi_id(item.id)
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
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Data Tipe Transaksi</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="nama" value="Nama"/>
                                </div>
                                <TextInput id="nama" type="text" placeholder="Iuran Satpam" required
                                           value={form.nama}
                                           onChange={(e) => setForm({...form, nama: e.target.value})}/>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="jenis" value="Jenis"/>
                                </div>
                                <Select id="jenis" required
                                        value={form.jenis}
                                        onChange={(e) => setForm({...form, jenis: e.target.value})}>
                                    <option selected disabled>Pilih Jenis</option>
                                    <option value={"Pemasukan"}>Pemasukan</option>
                                    <option value={"Pengeluaran"}>Pengeluaran</option>
                                </Select>
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
                            <Button color="gray" onClick={() => deleteData(tipeTransaksi_id)}>
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

export default TipeTransaksi