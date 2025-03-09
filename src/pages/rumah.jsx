import {Link} from "react-router-dom"
import DashboardLayout from "../components/Layouts/DashboardLayout.jsx";
import {
    Breadcrumb,
    Table,
    Pagination,
    Alert,
    TextInput,
    Button,
    Modal,
    Label,
    Select,
    Radio,
    FileInput
} from "flowbite-react";
import {HiHome, HiOutlineExclamationCircle} from "react-icons/hi";
import apiClient, {
    deleteRumah,
    fetchRumah, postRumah, putRumah,
} from "../services/apiClient.js";
import {useEffect, useState} from "react";

function Rumah() {
    const [response, setResponse] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [rumah_id, setRumah_id] = useState(null)
    const [search, setSearch] = useState("")

    const [form, setForm] = useState({
        id: null,
        blok: "",
        status_rumah: undefined,
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
            blok: "",
            status_rumah: undefined,
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
        value.blok.toLowerCase().includes(search.toLowerCase())
    );

    const getRumah = async () => {
        try {
            const response = await fetchRumah();
            setResponse(response.data);
        } catch (e) {
            if (e.name !== "AbortError") {
                console.error(e.message);
            }
        }
    };

    const getDetailRumah = async (id) => {
        try {
            const response = await apiClient.get(`/rumah/${id}`);
            const {blok, status_rumah} = response.data.data[0]
            setForm({id, blok, status_rumah });
        } catch (e) {
            console.error(e.message);
        }
    }

    async function submit(e) {
        e.preventDefault();
        if (!form.id) {
            try {
                const response = await postRumah(form)
                setOpenModal(false)
                setOpenAlert(true)
                setAlertMessage(response.data.message)

                resetForm()
                await getRumah()
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
            const response = await putRumah(form.id, form)
            setOpenModal(false)
            setOpenAlert(true)
            setAlertMessage(response.data.message)

            resetForm()
            await getRumah()
        } catch (e) {
            console.error(e.message)
        }
    };

    const deleteData = async (id) => {
        try {
            await deleteRumah(id);
            setOpenConfirmationModal(false);
            setOpenAlert(true);
            setAlertMessage("Delete data 'Rumah' successfully!");
            await getRumah();
        } catch (e) {
            console.error(e.message);
        }
    }

    useEffect(() => {
        getRumah();
    }, []);

    return (
        <>
            <DashboardLayout title={"Rumah"}>
                <DashboardLayout.Breadcump>
                    <Breadcrumb>
                        <Link to={"/"}>
                            <Breadcrumb.Item icon={HiHome}>
                                Dashboard
                            </Breadcrumb.Item>
                        </Link>
                        <Breadcrumb.Item as={Link} to="/rumah">Rumah</Breadcrumb.Item>
                    </Breadcrumb>
                </DashboardLayout.Breadcump>

                <section className={"my-10"}>
                    {showAlert(alertMessage)}
                    <div className="flex justify-between items-center mt-5">
                        <TextInput id="small"
                                   type="text"
                                   sizing="sm"
                                   placeholder={"Ketik untuk mencari berdasarkan blok..."}
                                   className={"mb-5 w-1/2"}
                                   onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={() => setOpenModal(true)} className={"mb-5"}>Rumah Baru</Button>
                    </div>
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell className="w-1/4">Blok</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Status Rumah</Table.HeadCell>
                            <Table.HeadCell className="w-1/12">Action</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {filteredData?.length > 0 ? filteredData.map((item, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell className="w-1/4">{item.blok}</Table.Cell>
                                    <Table.Cell className="w-1/4">{item.status_rumah}</Table.Cell>
                                    <Table.Cell className="w-1/12 flex gap-5">
                                        <a href="#"
                                           className="font-medium text-[#0e7490] dark:text-blue-500 hover:underline"
                                           onClick={async (e) => {
                                               e.preventDefault();
                                               await getDetailRumah(item.id);
                                               setOpenModal(true);
                                           }}>Edit</a>
                                        <a href="#"
                                           className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                           onClick={(e) => {
                                               e.preventDefault();
                                               setOpenConfirmationModal(true)
                                               setRumah_id(item.id)
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
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Data Rumah</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="blok" value="Blok"/>
                                </div>
                                <TextInput id="blok" type="text" placeholder="EG-01" required
                                           value={form.blok}
                                           onChange={(e) => setForm({...form, blok: e.target.value})}/>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="status_rumah" value="Status Rumah"/>
                                </div>
                                <Select id="status_rumah" required
                                        value={form.status_rumah}
                                        onChange={(e) => setForm({...form, status_rumah: e.target.value})}>
                                    <option selected disabled>Pilih Status Rumah</option>
                                    <option value={"Dihuni"}>Dihuni</option>
                                    <option value={"Tidak dihuni"}>Tidak dihuni</option>
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
                            <Button color="gray" onClick={() => deleteData(rumah_id)}>
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

export default Rumah