import { useQuery } from "@tanstack/react-query"
import { LogInRequest, LogInQuery } from "../../api/logInQuery";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner"
import { Stack } from "react-bootstrap";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function LogIn() {
    const navigate = useNavigate();
    const [logInFormData, setLogInFormData] = useState<LogInRequest | null>(null);

    const { isLoading, error, data } = useQuery({
        queryKey: ['LogIn1235'],
        queryFn: () => {
            if (logInFormData != null) {
                var result = LogInQuery(logInFormData)
                setLogInFormData(null)
                return result
            }
        },
        enabled: () => logInFormData != null
    })

    const handleSubmit = (event: any) => {
        console.log('Log In Form was submitted');
        console.log(event);
        event.preventDefault();

        setLogInFormData({
            Email: event.target[0].value,
            Password: event.target[1].value,
        })
    }

    useEffect(() => {
        if (data === null || data === undefined) return;
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);

        const expiresAt = Date.now() + data.expiresIn * 1000;
        sessionStorage.setItem("tokenExpiry", expiresAt.toString());
        navigate('/');
    })

    if (isLoading)
        return (<LoadingSpinner />);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}