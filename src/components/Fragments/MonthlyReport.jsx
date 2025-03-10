import {Badge, Pagination, Table} from "flowbite-react";
import {useEffect, useState} from "react";
import {fetchMonthlyTransaction} from "../../services/apiClient.js";
import {useDashboard} from "../../context/DashboardContext.jsx";

function MonthlyReport() {
    const [currentPage, setCurrentPage] = useState(1)
    const [monthlyTransaction, setMonthlyTransaction] = useState([])
    const  {selectedBulan, selectedTahun, bulan} = useDashboard()

    const onPageChange = async (page) => {
        setCurrentPage(page);

        try {
            const response = await getMonthlyTransaction(page)
            setMonthlyTransaction(response.data.data)
        } catch (e) {
            // console.error(e.message);
        }
    };

    const getMonthlyTransaction = async (page = 1) => {
        try {
            const response = await fetchMonthlyTransaction({
                periode_bulan: selectedBulan.id ?? new Date().getMonth() + 1,
                periode_tahun: selectedTahun ?? new Date().getFullYear(),
                per_page: 10,
                page
            })
            setMonthlyTransaction(response.data.data)
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getMonthlyTransaction()
        setCurrentPage(1)
    }, [selectedBulan, selectedTahun]);

    return (
        <>
            <div className="flex justify-between items-center my-10 mb-5">
                <h2 className={"font-bold text-2xl"}>Mutasi Bulan {selectedBulan.value ?? bulan[new Date().getMonth()]} {selectedTahun ?? new Date().getFullYear()}</h2>
            </div>

            <Table striped>
                <Table.Head>
                    <Table.HeadCell className="w-1/4">Tanggal Transaksi</Table.HeadCell>
                    <Table.HeadCell className="w-1/4">Periode</Table.HeadCell>
                    <Table.HeadCell className="w-1/4">Transaksi</Table.HeadCell>
                    <Table.HeadCell className="w-1/4">Jenis</Table.HeadCell>
                    <Table.HeadCell className="w-1/4">Nominal</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                    {monthlyTransaction.results?.length > 0 ? monthlyTransaction.results?.map((item, index) => (
                        <Table.Row key={index}>
                            <Table.Cell className="w-1/4">{item.tanggal_transaksi}</Table.Cell>
                            <Table.Cell
                                className="w-1/4">{bulan[item.periode_bulan - 1]} {item.periode_tahun}</Table.Cell>
                            <Table.Cell className="w-1/4">{item.nama}</Table.Cell>
                            {item.status_pembayaran === "Lunas" && (<Badge color="success" className={"w-max"}>{item.status_pembayaran}</Badge>)}
                            <Table.Cell className="w-1/4">
                                {item.jenis === "Pemasukan" && (<Badge color="success" className={"w-max"}>{item.jenis}</Badge>)}
                                {item.jenis === "Pengeluaran" && (<Badge color="failure" className={"w-max"}>{item.jenis}</Badge>)}
                            </Table.Cell>
                            <Table.Cell className="w-1/4">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.nominal)}</Table.Cell>
                        </Table.Row>
                    )) : (
                        <Table.Row>
                            <Table.Cell colSpan={5} className="text-center">
                                Tidak ada data
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            <div className="flex overflow-x-auto sm:justify-end my-10">
                <Pagination layout="table" currentPage={currentPage}
                            totalPages={monthlyTransaction && monthlyTransaction.last_page} onPageChange={onPageChange}
                            showIcons/>
            </div>
        </>
    )
}

export default MonthlyReport