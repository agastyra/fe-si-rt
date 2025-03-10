import { createContext, useState, useContext } from 'react';

const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
    const [selectedBulan, setSelectedBulan] = useState({id: null, value: null})
    const [selectedTahun, setSelectedTahun] = useState(null)
    const bulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]
    const tahun = [
        "2023", "2024", "2025"
    ]

    const value = {
        selectedBulan,
        setSelectedBulan,
        selectedTahun,
        setSelectedTahun,
        bulan,
        tahun
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export default DashboardProvider