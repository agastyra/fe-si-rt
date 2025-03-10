import NavigationBar from "../Fragments/Navbar.jsx";
import FooterBar from "../Fragments/FooterBar.jsx";

function DashboardLayout({title, children}) {
    return (
        <>
            <NavigationBar/>
            <div className="container mx-auto mt-10">
                <h1 className={"font-bold mb-4 text-3xl"}>{title}</h1>
                <DashboardBreadcump />

                {children}
            </div>

            <FooterBar />
        </>
    )
}

function DashboardBreadcump({children}) {
    return (
        <>{children}</>
    )
}

DashboardLayout.Breadcump = DashboardBreadcump

export default DashboardLayout