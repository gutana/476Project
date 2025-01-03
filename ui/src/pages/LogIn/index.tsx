import { useMutation } from "@tanstack/react-query"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { LogInMutation } from "../../api/mutations/userMutations";
import { Alert } from "react-bootstrap";

export default function LogIn() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>();
    const [loading, setLoading] = useState(false);

    const loginMutation = useMutation({
        mutationFn: LogInMutation,
        onSuccess: (data, variables, context) => {
            if (data === null) return;
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("refreshToken", data.refreshToken);

            const expiresAt = Date.now() + data.expiresIn * 1000;
            sessionStorage.setItem("tokenExpiry", expiresAt.toString());
            navigate('/');
        },
        onError: (data, variables, context) => {
            setErrorMessage("Unable to log in. Please check your email and password and try again.");
            loginMutation.reset();
        }
    })

    const handleSubmit = (event: any) => {
        event.preventDefault();

        loginMutation.mutate({
            Email: event.target[0].value,
            Password: event.target[1].value,
        })
    }

    if (loginMutation.isPending || loading)
        return (<LoadingSpinner />);

    return (
        <>
            <h3 style={{ justifyContent: 'center' }}>
                <img height="50vh" style={{ marginRight: "4px", marginTop: '-5px' }} src={`${process.env.PUBLIC_URL}/images/icon.png`} alt=""></img>
                    SubSystem
                </h3>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                {/* <div className="mb-3">Don't have an account?
                    <Link to="/signup">Sign up!</Link></div> */}
                {errorMessage && <Alert variant="warning">{errorMessage}</Alert>}
                <Button variant="primary" type="submit">
                    Submit
                </Button>

                <Button style={{ fontWeight: 'normal', marginLeft: "6px" }} variant="secondary" href="/signup">Don't have an account?</Button>
                </Form>
        </>
    )
}