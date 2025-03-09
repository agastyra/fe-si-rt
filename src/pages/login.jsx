import FormLogin from "../components/Fragments/FormLogin";
import AuthLayouts from "../components/Layouts/AuthLayouts";

const LoginPage = () => {
    return (
        <div className="flex justify-center min-h-screen items-center">
            <AuthLayouts title="Login" type="login">
                <FormLogin />
            </AuthLayouts>
        </div>
    );
};

export default LoginPage;
