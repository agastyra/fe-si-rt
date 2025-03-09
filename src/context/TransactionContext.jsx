import { createContext, useState, useContext } from 'react';

const TransactionContext = createContext();

const TransactionProvider = ({ children }) => {
    const [transaksiDetail, setTransaksiDetail] = useState([]);

    const value = {
        transaksiDetail,
        setTransaksiDetail
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};

export default TransactionProvider