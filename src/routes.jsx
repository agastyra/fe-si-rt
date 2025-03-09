import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import LoginPage from "./pages/login.jsx";
import ErrorPage from "./pages/error.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Rumah from "./pages/rumah.jsx";
import Penghuni from "./pages/penghuni.jsx";
import TipeTransaksi from "./pages/tipeTransaksi.jsx";
import TransaksiIuran from "./pages/transaksiIuran.jsx";
import TransactionProvider from "./context/TransactionContext.jsx";
import TransaksiPengeluaran from "./pages/transaksiPengeluaran.jsx";
import DashboardProvider from "./context/DashboardContext.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardProvider>
            <Dashboard />
        </DashboardProvider>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/rumah",
        element: <Rumah />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/penghuni",
        element: <Penghuni/>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/tipe-transaksi",
        element: <TipeTransaksi/>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/pembayaran-iuran",
        element: <TransactionProvider>
            <TransaksiIuran/>
        </TransactionProvider>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/pengeluaran-bulanan",
        element: <TransactionProvider>
            <TransaksiPengeluaran />
        </TransactionProvider>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    }
]);

const Routes = () => {
    return <RouterProvider router={router} />;
};

export default Routes;
