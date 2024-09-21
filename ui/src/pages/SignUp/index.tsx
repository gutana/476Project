import { useMutation } from "@tanstack/react-query"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { RegistrationMutation } from "../../api/mutations/userMutations";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Alert, Form } from "react-bootstrap";
import { InformationModal } from "../../components/InformationModal";
import { Region, UserType } from "../../models/user";

export default function SignUp() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const registrationMutation = useMutation({
        mutationFn: RegistrationMutation,
        onSuccess: (data, variables, context) => {
            setShowModal(true);
        },
        onError: (data, variables, context) => {
            setErrorMessage("Unable to sign up. Please try again later.");
            registrationMutation.reset();
        }
    })


    const handleSubmit = (event: any) => {
        event.preventDefault();
        let data = {
            FirstName: event.target[0].value,
            LastName: event.target[1].value,
            Email: event.target[2].value,
            Password: event.target[3].value,
            Region: event.target[4].value,
            UserType: event.target[5].value
        }

        if (data.Region === "-1" || data.UserType === "-1") {
            setErrorMessage("Region/Account Type has to be selected!");
            return;
        }

        registrationMutation.mutate(data);
    }

    const handleClose = () => {
        navigate("/");
    }

    if (registrationMutation.isPending) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <>
            <div className="container-md">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" aria-describedby="emailHelp" required />
                        <Form.Text id="emailHelp" muted>
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Region</Form.Label>
                        <Form.Select defaultValue="-1" required>
                            <option value="-1" disabled>Select your region</option>
                            <option value={Region.Regina}>Regina</option>
                            <option value={Region.Saskatoon}>Saskatoon</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Account Type</Form.Label>
                        <Form.Select defaultValue="-1" required>
                            <option value="-1" disabled>Select account type</option>
                            <option value={UserType.Teacher}>Substitute</option>
                            <option value={UserType.Requestor}>Teacher</option>
                            <option value={UserType.Administrator}>Administrator</option>
                        </Form.Select>
                    </Form.Group>

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>

            <InformationModal
                showModal={showModal}
                handleClose={handleClose}
                title="Your sign up request was received"
                body="Please allow up to 5 business days for your request to be reviewed and approved."
                closeButtonText="Sounds good!"
            />
        </>
    )
}