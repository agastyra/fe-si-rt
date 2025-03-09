import {Link} from "react-router-dom"
import DashboardLayout from "../components/Layouts/DashboardLayout.jsx";
import {
    Breadcrumb,
    Table,
    Pagination,
    Button,
    Label,
    Modal,
    TextInput,
    Select,
    Radio,
    FileInput, Alert
} from "flowbite-react";
import {HiHome, HiOutlineExclamationCircle} from "react-icons/hi";
import apiClient, {deletePenghuni, fetchPenghuni, postPenghuni, putPenghuni} from "../services/apiClient.js";
import {useEffect, useState} from "react";

function Penghuni() {
    const [response, setResponse] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [penghuni_id, setPenghuni_id] = useState(null)
    const [search, setSearch] = useState("")

    const [form, setForm] = useState({
        id: null,
        nama_lengkap: "",
        status_penghuni: undefined,
        nomor_telepon: "",
        jenis_kelamin: "Laki-laki",
        menikah: "1",
        foto_ktp: null
    });

    useEffect(() => {
        if (!openModal) {
            resetForm()
        }
    }, [openModal]);

    const onPageChange = async (page) => {
        setCurrentPage(page);

        try {
            const response = await apiClient.get("/penghuni", {
                params: {page}
            })
            setResponse(response.data);
        } catch (e) {
            console.error(e.message);
        }
    };

    const resetForm = () => {
        setForm({
            nama_lengkap: "",
            status_penghuni: undefined,
            nomor_telepon: "",
            jenis_kelamin: "Laki-laki",
            menikah: "1",
            foto_ktp: null
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
        value.nama_lengkap.toLowerCase().includes(search.toLowerCase())
    );

    const getPenghuni = async () => {
        try {
            const response = await fetchPenghuni();
            setResponse(response.data);
        } catch (e) {
            if (e.name !== "AbortError") {
                console.error(e.message);
            }
        }
    };

    const getDetailPenghuni = async (id) => {
        try {
            const response = await apiClient.get(`/penghuni/${id}`);
            const {nama_lengkap, status_penghuni, nomor_telepon, jenis_kelamin, menikah, foto_ktp} = response.data.data
            setForm({id, nama_lengkap, status_penghuni, nomor_telepon, jenis_kelamin, menikah, foto_ktp});
        } catch (e) {
            console.error(e.message);
        }
    }

    async function submit(e) {
        e.preventDefault();
        if (!form.id) {
            try {
                const formData = new FormData();
                Object.keys(form).forEach(key => {
                    if (key === 'foto_ktp') {
                        if (typeof form.foto_ktp === 'object' && form.foto_ktp) {
                            formData.append(key, form.foto_ktp, form.foto_ktp.name);
                        }
                    } else {
                        formData.append(key, form[key]);
                    }
                })

                const response = await postPenghuni(formData)
                setOpenModal(false)
                setOpenAlert(true)
                setAlertMessage(response.data.message)

                resetForm()
                await getPenghuni()
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
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (key === 'foto_ktp') {
                    if (typeof form.foto_ktp === 'object' && form.foto_ktp) {
                        formData.append(key, form.foto_ktp, form.foto_ktp.name);
                    }
                } else {
                    formData.append(key, form[key]);
                }
            })

            formData.append("_method", "PUT");

            const response = await putPenghuni(form.id, formData)
            setOpenModal(false)
            setOpenAlert(true)
            setAlertMessage(response.data.message)

            resetForm()
            await getPenghuni()
        } catch (e) {
            console.error(e.message)
        }
    };

    const deleteData = async (id) => {
        try {
            await deletePenghuni(id);
            setOpenConfirmationModal(false);
            setOpenAlert(true);
            setAlertMessage("Delete data 'Penghuni' successfully!");
            await getPenghuni();
        } catch (e) {
            console.error(e.message);
        }
    }

    useEffect(() => {
        getPenghuni();
    }, []);

    return (
        <>
            <DashboardLayout title={"Penghuni"}>
                <DashboardLayout.Breadcump>
                    <Breadcrumb>
                        <Link to={"/"}>
                            <Breadcrumb.Item icon={HiHome}>
                                Dashboard
                            </Breadcrumb.Item>
                        </Link>
                        <Breadcrumb.Item as={Link} to="/penghuni">Penghuni</Breadcrumb.Item>
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
                        <Button onClick={() => setOpenModal(true)} className={"mb-5"}>Penghuni Baru</Button>
                    </div>
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell className="w-1/4">Nama Lengkap</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Status Penghuni</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Jenis Kelamin</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Nomor Telepon</Table.HeadCell>
                            <Table.HeadCell className="w-1/4">Status</Table.HeadCell>
                            <Table.HeadCell className="w-1/12">Action</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {filteredData?.length > 0 ? filteredData.map((item, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell className="w-1/4">{item.nama_lengkap}</Table.Cell>
                                    <Table.Cell className="w-1/4">{item.status_penghuni}</Table.Cell>
                                    <Table.Cell className="w-1/4">{item.jenis_kelamin}</Table.Cell>
                                    <Table.Cell className="w-1/4">{item.nomor_telepon}</Table.Cell>
                                    <Table.Cell
                                        className="w-1/4">{item.menikah ? "Menikah" : "Belum Menikah"}</Table.Cell>
                                    <Table.Cell className="w-1/12 flex gap-5">
                                        <a href="#"
                                           className="font-medium text-[#0e7490] dark:text-blue-500 hover:underline"
                                           onClick={async (e) => {
                                               e.preventDefault();
                                               await getDetailPenghuni(item.id);
                                               setOpenModal(true);
                                           }}>Edit</a>
                                        <a href="#"
                                           className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                           onClick={(e) => {
                                               e.preventDefault();
                                               setOpenConfirmationModal(true)
                                               setPenghuni_id(item.id)
                                           }}>Delete</a>
                                    </Table.Cell>
                                </Table.Row>
                            )) : (
                                <Table.Row>
                                    <Table.Cell colSpan={6} className="text-center">
                                        Tidak ada data
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </section>

                <div className="flex overflow-x-auto sm:justify-center">
                    <Pagination layout="table" currentPage={currentPage}
                                totalPages={response.meta && response.meta.last_page} onPageChange={onPageChange}
                                showIcons/>
                </div>
            </DashboardLayout>

            <Modal show={openModal} size="lg" popup onClose={() => setOpenModal(false)}>
                <Modal.Header/>
                <Modal.Body>
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Penghuni Baru</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="nama_lengkap" value="Nama Lengkap"/>
                                </div>
                                <TextInput id="nama_lengkap" type="text" placeholder="John Doe" required
                                           value={form.nama_lengkap}
                                           onChange={(e) => setForm({...form, nama_lengkap: e.target.value})}/>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="status_penghuni" value="Status Penghuni"/>
                                </div>
                                <Select id="status_penghuni" required
                                        value={form.status_penghuni}
                                        onChange={(e) => setForm({...form, status_penghuni: e.target.value})}>
                                    <option selected disabled>Pilih Status Penghuni</option>
                                    <option value={"Tetap"}>Tetap</option>
                                    <option value={"Kontrak"}>Kontrak</option>
                                </Select>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="nomor_telepon" value="Nomor Telepon"/>
                                </div>
                                <TextInput id="nomor_telepon" type="text" placeholder="085xxxxxx"
                                           inputMode="numeric" pattern="[0-9]*" max="13" required
                                           value={form.nomor_telepon}
                                           onChange={(e) => setForm({...form, nomor_telepon: e.target.value})}
                                />
                            </div>
                            <div>
                                <fieldset className="flex max-w-md flex-row gap-4">
                                    <legend className="mb-4">Jenis Kelamin</legend>
                                    <div className="flex items-center gap-2">
                                        <Radio id="laki-laki" name="jenis_kelamin"
                                               value="Laki-laki" defaultChecked
                                               checked={form.jenis_kelamin === "Laki-laki"}
                                               onChange={(e) => setForm({...form, jenis_kelamin: e.target.value})}
                                        />
                                        <Label htmlFor="laki-laki">Laki-laki</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Radio id="perempuan" name="jenis_kelamin"
                                               value="Perempuan" checked={form.jenis_kelamin === "Perempuan"}
                                               onChange={(e) => setForm({...form, jenis_kelamin: e.target.value})}/>
                                        <Label htmlFor="perempuan">Perempuan</Label>
                                    </div>
                                </fieldset>
                            </div>
                            <div>
                                <fieldset className="flex max-w-md flex-row gap-4">
                                    <legend className="mb-4">Status</legend>
                                    <div className="flex items-center gap-2">
                                        <Radio id="status_menikah" name="menikah"
                                               value="1" defaultChecked
                                               checked={form.menikah == "1"}
                                               onChange={(e) => setForm({...form, menikah: e.target.value})}
                                        />
                                        <Label htmlFor="status_menikah">Menikah</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Radio id="status_belum_menikah" name="menikah"
                                               value="0" checked={form.menikah == "0"}
                                               onChange={(e) => setForm({...form, menikah: e.target.value})}/>
                                        <Label htmlFor="status_belum_menikah">Belum Menikah</Label>
                                    </div>
                                </fieldset>
                            </div>
                            <div id="uploadFotoKtp" className="max-w-md">
                                <div className="mb-2 block">
                                    <Label htmlFor="foto_ktp" value="Unggah foto"/>
                                </div>
                                <FileInput id="foto_ktp"
                                           helperText="Foto KTP digunakan untuk verifikasi kepemilikan."
                                           accept="image/jpeg, image/png, image/jpg"
                                           onChange={(e) => setForm({...form, foto_ktp: e.target.files[0]})}
                                />

                                {form.foto_ktp instanceof File ? (
                                    <img
                                        src={URL.createObjectURL(form.foto_ktp)}
                                        className="object-contain aspect-square w-full h-48 mt-2"
                                        alt="Preview"
                                    />
                                ) : (
                                    <img
                                        src={form.foto_ktp}
                                        className={`object-contain aspect-square w-full h-48 mt-2 ${form.foto_ktp ? "" : "hidden"}`}
                                        alt="Preview"
                                    />
                                )}
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
                            <Button color="gray" onClick={() => deleteData(penghuni_id)}>
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

export default Penghuni