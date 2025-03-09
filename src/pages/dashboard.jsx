import DashboardLayout from "../components/Layouts/DashboardLayout.jsx";
import {Card, Dropdown} from "flowbite-react";
import apiClient from "../services/apiClient.js";
import {useEffect, useState} from "react";
import {HiClipboardList, HiCurrencyDollar} from "react-icons/hi";
import {Link} from "react-router-dom"
import MonthlyBillingSummary from "../components/Fragments/MonthlyBillingSummary.jsx";
import {useDashboard} from "../context/DashboardContext.jsx";

function Dashboard() {
    const [masterData, setMasterData] = useState({
        rumah: 0,
        penghuni: 0,
        tipe_transaksi: 0
    })
    const { selectedBulan, selectedTahun } = useDashboard()

    const masterDataCount = async () => {
        try {
            const response = await apiClient.get("/report/master-data-count");
            setMasterData(response.data.data);
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    useEffect(() => {
        masterDataCount();
    }, [selectedBulan, selectedTahun])

    return (
        <DashboardLayout title={"Welcome back Pak RT!"}>
            <div className="flex justify-between items-center mt-10 mb-5">
                <p className={"text-lg font-medium"}>Berikut laporan administrasi selama anda pergi</p>
                <Dropdown label="Catatan baru">
                    <Link to={"/pembayaran-iuran"}>
                        <Dropdown.Item icon={HiCurrencyDollar} className={"text-green-600"}>Pembayaran
                            Iuran</Dropdown.Item>
                    </Link>
                    <Link to={"/pengeluaran-bulanan"}>
                        <Dropdown.Item icon={HiCurrencyDollar} className={"text-red-500"}>Pengeluaran
                            Bulanan</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon={HiClipboardList}>History Penghuni Rumah</Dropdown.Item>
                </Dropdown>
            </div>
            <div className="grid grid-cols-3 gap-6 w-full">
                {masterData && Object.entries(masterData).map(([key, value]) => (
                    <Card className="w-full" key={key}>
                        <div className="flex items-center space-x-4">
                            {key === "rumah" && (
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    ></path>
                                </svg>
                            )}
                            {key === "penghuni" && (
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    ></path>
                                </svg>
                            )}
                            {key === "tipe_transaksi" && (
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            )}
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {key.replace(/_/g, ' ').replace(/^([a-z])|\s+([a-z])/g, ($1) => $1.toUpperCase())}: {value}
                            </h5>
                        </div>
                    </Card>
                ))}
            </div>

            <MonthlyBillingSummary />

        </DashboardLayout>
    );
}

export default Dashboard