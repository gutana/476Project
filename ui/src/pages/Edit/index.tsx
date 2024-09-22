import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/UserWrapper";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Region } from "../../models/user";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatPhoneNumber, formatPhoneNumberOnChange, sanitizeNumber } from "../../components/PhoneNumberFormat";
import { useMutation } from "@tanstack/react-query";
import { EditInformationMutation } from "../../api/mutations/userMutations";

export default function Edit() {
    const user = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
    const [region, setRegion] = useState<Region | string | undefined>();
    const [last, setLast] = useState("");
    const [isLoading, setLoading] = useState(false);

    const editMutation = useMutation({
        mutationFn: EditInformationMutation,
        onSuccess: (data, variables, context) => {
            setTimeout(() => window.location.reload(), 2000);
        },
        onError: (data, variables, context) => {
            console.error("Data: ", data, "Varaibles: ", variables, "Context: ", context);
            setLoading(false);
            editMutation.reset();
        }
    })

    const handleSubmit = (e: any) => {
        e.preventDefault();
        let sanitizedNumber = sanitizeNumber(phoneNumber);
        let newVals = [firstName, lastName, email, sanitizedNumber, region];
        let oldVals = [user?.firstName, user?.lastName, user?.email, user?.phoneNumber, stringToRegion(user?.region)];
        if (newVals.toString() === oldVals.toString()) return;

        if (sanitizedNumber && sanitizedNumber.length !== 10) {
            alert("Phone number has to be 10 digits!")
            return;
        }

        let realRegion = stringToRegion(region);
        if (realRegion === undefined) {
            realRegion = Region.Regina;
        }
        
        setLoading(true);
        editMutation.mutate({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            PhoneNumber: sanitizedNumber,
            Region: realRegion
        })
    }

    const onNumberChange = (e: any) => {
        e.target.value = formatPhoneNumberOnChange(e.target.value, phoneNumber, last);
        setLast(e.target.value.slice(-1) ? e.target.value.slice(-1) : "");
        setPhoneNumber(e.target.value);
    }

    const stringToRegion = (region: string | Region | undefined) => {
        if (!(typeof region === "string")) {
            return region;
        }
        
        switch (region.toLowerCase()) {
            case "regina":
            case "0":
                return Region.Regina;
            case "saskatoon":
            case "1":
                return Region.Saskatoon;
            default:
                return Region.Regina;
        }
    }

    useEffect(() => {
        if (!user) return;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhoneNumber(formatPhoneNumber(user.phoneNumber));
        setRegion(stringToRegion(user.region));
    }, [user])

    if (!user) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <div className="p-3">
            <h3 className="pb-2">Edit User Information</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" aria-describedby="emailHelp" required value={email} onChange={(e) => setEmail(e.target.value)} />
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

                <Button variant="primary" disabled={isLoading} type="submit">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </Form>
        </div>
    )
}