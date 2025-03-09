import Button from "../Elements/Button";
import InputForm from "../Elements/Input";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router";

const FormLogin = () => {
    const [errors, setErrors] = useState({email: null, password: null})
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            navigate("/")
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = e.target;

        await login({ email: email.value, password: password.value });
    };

    async function login({ email, password }) {
        const BASE_URL = "http://127.0.0.1:8000"

        fetch(`${BASE_URL}/sanctum/csrf-cookie`)
            .then(() => {})
            .then(async () => {
                const response = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                })
                const {accessToken, refreshToken, errors, user} = await response.json()
                if (errors) return handleErrors(errors)

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/")
            })
    }

    function handleErrors(errors) {
        setErrors({email: errors.email ? errors.email[0] : null, password: errors.password ? errors.password[0] : null})
    }

    return (
        <form action="" onSubmit={handleSubmit}>
            <InputForm
                label="Email:"
                type="email"
                placeholder="email@example.com"
                name="email"
                id="email"
                error={errors.email}
            />
            <InputForm
                label="Password:"
                type="password"
                placeholder="********"
                name="password"
                id="password"
                error={errors.password}
            />
            <Button type="submit" className="bg-blue-600 w-full text-white mb-4">
                Login
            </Button>
        </form>
    );
};

export default FormLogin;
