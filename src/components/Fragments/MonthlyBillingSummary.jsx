import {Badge, Dropdown, Pagination, Table} from "flowbite-react";
import {useEffect, useState} from "react";
import {fetchMonthlyBillingSummary} from "../../services/apiClient.js";
import {useDashboard} from "../../context/DashboardContext.jsx";

function MonthlyBillingSummary() {
    const [monthlyBillingSummary, setMonthlyBillingSummary] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const { selectedBulan, selectedTahun, setSelectedBulan, setSelectedTahun } = useDashboard()

    const bulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]
    const tahun = [
        "2023", "2024", "2025"
    ]

    const getMonthlyBillingSummary = async (page = 1) => {
        try {
            const response = await fetchMonthlyBillingSummary({
                periode_bulan: selectedBulan.id ?? new Date().getMonth() + 1,
                periode_tahun: selectedTahun ?? new Date().getFullYear(),
                per_page: 10,
                page
            })
            setMonthlyBillingSummary(response.data.data)
        } catch (e) {
            console.error(e.message)
        }
    }

    const onPageChange = async (page) => {
        setCurrentPage(page);

        try {
            const response = await getMonthlyBillingSummary(page)
            setMonthlyBillingSummary(response.data.data)
            console.log(response)
        } catch (e) {
            // console.error(e.message);
        }
    };

    useEffect(() => {
        getMonthlyBillingSummary()
    }, [selectedBulan, selectedTahun]);

    return (
        <>
            <div className="flex justify-between items-center my-10 mb-5">
                <h2 className={"font-bold text-2xl"}>Tagihan bulanan Iuran</h2>
                <section className={"filter-container flex gap-4"}>
                    <Dropdown color={"light"} label={selectedBulan.value ?? "Bulan"}>
                        {bulan.map((value, index) => (
                            <Dropdown.Item key={index} onClick={() => {
                                setSelectedBulan({id: index + 1, value})
                                setCurrentPage(1)
                            }}>{value}</Dropdown.Item>
                        ))}
                    </Dropdown>
                    <Dropdown color={"light"} label={selectedTahun ?? "Tahun"}>
                        {tahun.map((value, index) => (
                            <Dropdown.Item key={index} onClick={() => {
                                setSelectedTahun(value)
                                setCurrentPage(1)
                            }}>{value}</Dropdown.Item>
                        ))}
                    </Dropdown>
                </section>
            </div>

            <Table striped>
                <Table.Head>
                    <Table.HeadCell className="w-1/4">Blok</Table.HeadCell>
                    <Table.HeadCell className="w-1/4">Periode</Table.HeadCell>
                    <Table.HeadCell className="w-1/4">Keterangan</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                    {monthlyBillingSummary.results ? monthlyBillingSummary.results.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell className="w-1/4">{item.blok}</Table.Cell>
                            <Table.Cell
                                className="w-1/4">{bulan[item.periode_bulan - 1]} {item.periode_tahun}</Table.Cell>
                            <Table.Cell className="w-1/4">
                                {item.status_pembayaran === "Lunas" && (<Badge color="success" className={"w-max"}>{item.status_pembayaran}</Badge>)}
                                {item.status_pembayaran === "Belum Lunas" && (<Badge color="warning" className={"w-max"}>{item.status_pembayaran}</Badge>)}
                                {item.status_pembayaran === "Belum Bayar" && (<Badge color="failure" className={"w-max"}>{item.status_pembayaran}</Badge>)}
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

            <div className="flex overflow-x-auto sm:justify-end my-10">
                <Pagination layout="table" currentPage={currentPage}
                            totalPages={monthlyBillingSummary && monthlyBillingSummary.last_page} onPageChange={onPageChange}
                            showIcons/>
            </div>
        </>
    )
}

export default MonthlyBillingSummary