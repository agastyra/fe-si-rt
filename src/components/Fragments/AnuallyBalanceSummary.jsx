import {Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import {fetchBalanceSummary} from "../../services/apiClient.js";
import {useDashboard} from "../../context/DashboardContext.jsx";

function AnuallyBalanceSummary() {
    const {selectedTahun, bulan} = useDashboard()
    const [balanceSummary, setBalanceSummary] = useState([])

    const getBalanceSummary = async () => {
        try {
            const response = await fetchBalanceSummary({
                periode_tahun: selectedTahun ?? new Date().getFullYear(),
            })
            setBalanceSummary(response.data.data)
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getBalanceSummary()
    }, [selectedTahun]);

    return (
        <>
            <div className="flex justify-between items-center mt-5 mb-10">
                <h2 className={"font-bold text-2xl"}>Grafik Ringkasan Pendapatan dan Pengeluaran per Tahun ({selectedTahun ?? new Date().getFullYear()})</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart width={1000} height={300} data={balanceSummary} margin={{left: 50}}>
                    <YAxis
                        tickFormatter={(value) => value.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0})}
                        stroke="#666"
                    />
                    <XAxis
                        dataKey="periode_bulan"
                        tickFormatter={(index) => bulan[index - 1]}
                        stroke="#666"
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

                    <Legend
                        wrapperStyle={{paddingTop: 10}}
                        iconType="circle"
                    />
                    <Tooltip content={<CustomTooltip bulan={bulan}/>} />

                    <Bar
                        barSize={30}
                        dataKey="total_pemasukan"
                        name="Total Pemasukan"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                    />

                    <Bar
                        barSize={30}
                        dataKey="total_pengeluaran"
                        name="Total Pengeluaran"
                        fill="#d55858"
                        radius={[4, 4, 0, 0]}
                    />

                    <Line
                        strokeWidth={2}
                        dataKey="saldo_awal"
                        name="Saldo Awal"
                        stroke="#0891b2"
                        dot={{ stroke: '#0891b2', strokeWidth: 2, r: 4, fill: 'white' }}
                        activeDot={{ r: 6 }}
                        type="monotone"
                    />

                    <Line
                        strokeWidth={2}
                        dataKey="saldo_akhir"
                        name="Saldo Akhir"
                        stroke="#f59e0b"
                        dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4, fill: 'white' }}
                        activeDot={{ r: 6 }}
                        type="monotone"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </>
    )
}

const CustomTooltip = ({active, payload, label, bulan}) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
                <p className="text-medium text-lg text-white">Bulan {bulan[label - 1]}</p>
                <p className="text-sm text-blue-400">
                    Total Pemasukan:
                    <span className="font-bold text-white ml-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(payload[0].value)}</span>
                </p>
                <p className="text-sm text-blue-400">
                    Total Pengeluaran:
                    <span className="font-bold text-white ml-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(payload[1].value)}</span>
                </p>
                <p className="text-sm text-blue-400">
                    Saldo Awal:
                    <span className="font-bold text-white ml-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(payload[2].value)}</span>
                </p>
                <p className="text-sm text-blue-400">
                    Saldo Akhir:
                    <span className="font-bold text-white ml-2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(payload[3].value)}</span>
                </p>
            </div>
        );
    }
}

export default AnuallyBalanceSummary