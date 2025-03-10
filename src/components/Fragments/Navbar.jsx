import {Link} from "react-router-dom";
import {Avatar, Dropdown, Navbar} from "flowbite-react";
import {useEffect, useState} from "react";
import {logoutRequest} from "../../services/apiClient.js";

function NavigationBar() {
    const [user, setUser] = useState("")

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")))
    }, []);

    async function handleLogOut() {
        try {
            const response = await logoutRequest()
            alert(response.data.message)

            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("user")

            window.location.href = "/login"
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <Navbar fluid rounded>
            <Navbar.Brand as={Link} href="https://flowbite-react.com">
                <img src="/vite.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SI Administrasi Iuran RT </span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{user.name}</span>
                        <span className="block truncate text-sm font-medium">{user.email}</span>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item className={"text-red-500"} onClick={handleLogOut}>Sign out</Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link as={Link} to="/" active={window.location.pathname === "/" || window.location.pathname === "/pembayaran-iuran" || window.location.pathname === "/pengeluaran-bulanan" || window.location.pathname === "/penghuni-rumah"}>
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