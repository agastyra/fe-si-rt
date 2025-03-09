import {Link} from "react-router-dom";
import { Navbar } from "flowbite-react";

function NavigationBar() {
    return (
        <Navbar fluid rounded>
            <Navbar.Brand as={Link} href="https://flowbite-react.com">
                <img src="/vite.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SI Administrasi Iuran RT </span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link as={Link} to="/" active={window.location.pathname === "/" || window.location.pathname === "/pembayaran-iuran" || window.location.pathname === "/pengeluaran-bulanan"}>
                    Dashboard
                </Navbar.Link>
                <Navbar.Link as={Link} to="/penghuni" active={window.location.pathname === "/penghuni"}>
                    Penghuni
                </Navbar.Link>
                <Navbar.Link as={Link} to="/rumah" active={window.location.pathname === "/rumah"}>Rumah</Navbar.Link>
                <Navbar.Link as={Link} to="/tipe-transaksi" active={window.location.pathname === "/tipe-transaksi"}>Tipe Transaksi</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar