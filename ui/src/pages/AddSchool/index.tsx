import { useContext, useState } from "react";
import { UserContext } from "../../components/UserWrapper";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Region, UserType } from "../../models/user";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatPhoneNumberOnChange, sanitizeNumber } from "../../components/PhoneNumberFormat";
import { useMutation } from "@tanstack/react-query";
import Toasts from "../../components/Toasts";
import { SchoolType } from "../../models/schools";
import { AddSchoolMutation } from "../../api/mutations/schoolMutations";
import { stringToRegion, stringToSchoolType } from "../../components/stringToDataType";

export default function AddSchoolPage() {
    const [user] = useContext(UserContext);

    const [schoolName, setSchoolName] = useState("");
    const [schoolType, setSchoolType] = useState<SchoolType | string>("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [region, setRegion] = useState<Region | string>("");
    const [postalCode, setPostalCode] = useState("");

    const [variant, setVariant] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const [last, setLast] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const schoolMutation = useMutation({
        mutationFn: AddSchoolMutation,
        onSuccess: (data, variables, context) => {
            setLoading(false);
            notifyUser(data);
        },
        onError: (data, variables, context) => {
            if (`${data}` === "Account has to be verified by an administrator.") {
                setErrorMessage(`${data}`);
            }
            console.error("Data: ", data, "Variables: ", variables, "Context: ", context);
            setLoading(false);
            schoolMutation.reset();
        }
    })

    const notifyUser = (data: string) => {
        if (data === "This school already exists.") {
            setVariant("primary");
            setTitle("Info");
        } else {
            setVariant("success");
            setTitle("Success")
        }
        setMessage(data);
        setShow(true);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        let sanitizedNumber = sanitizeNumber(phoneNumber);
        let realRegion = stringToRegion(region);
        let realSchoolType = stringToSchoolType(schoolType);

        if (!user || user.userType !== UserType.Administrator) {
            window.location.href = "/";
            return;
        }

        if (sanitizedNumber && sanitizedNumber.length !== 10) {
            setErrorMessage("Phone number has to be 10 digits!")
            return;
        }

        setLoading(true);
        schoolMutation.mutate({
            SchoolType: realSchoolType,
            SchoolName: schoolName,
            PhoneNumber: sanitizedNumber,
            Address: address,
            City: city,
            PostalCode: postalCode,
            Region: realRegion
        })
    }

    const onNumberChange = (e: any) => {
        e.target.value = formatPhoneNumberOnChange(e.target.value, phoneNumber, last);
        setLast(e.target.value.slice(-1) ? e.target.value.slice(-1) : "");
        setPhoneNumber(e.target.value);
    }

    if (!user || (user && user.userType !== UserType.Administrator)) {
        window.location.href = "/";
    }

    return (
        <>
            <Toasts show={show} setShow={setShow} variant={variant} title={title} message={message} />
            <div className="p-3">
                <h3 className="pb-2">Add School</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="schoolName">
                        <Form.Label>School Name</Form.Label>
                        <Form.Control type="text" required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" required value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" required value={city} onChange={(e) => setCity(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="postalCode">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" value={phoneNumber} onChange={onNumberChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Region</Form.Label>
                        <Form.Select onChange={(e) => setRegion(e.target.value)} value={region} required>
                            <option value={Region.Regina}>Regina</option>
                            <option value={Region.Saskatoon}>Saskatoon</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>School Type</Form.Label>
                        <Form.Select onChange={(e) => setSchoolType(e.target.value)} value={schoolType} required>
                            <option value={SchoolType.Primary}>Primary</option>
                            <option value={SchoolType.Secondary}>Secondary</option>
                        </Form.Select>
                    </Form.Group>

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Button variant="primary" disabled={loading} type="submit">
                        {loading ? 'Adding...' : 'Add School'}
                    </Button>
                </Form>
            </div>
        </>
    )
}