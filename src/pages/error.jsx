import { Link } from "react-router-dom";
import InformationLayouts from "../components/Layouts/InformationLayouts";
import { useRouteError } from "react-router-dom";
import Button from "../components/Elements/Button";

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <InformationLayouts info={`Oops! ${error.statusText || error.message}!`}>
            <Link to="/">
                <Button className="block bg-blue-600 text-white">OK!</Button>
            </Link>
        </InformationLayouts>
    );
};

export default ErrorPage;
