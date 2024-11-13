import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/UserWrapper";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Region, UserType } from "../../models/user";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { formatPhoneNumber, formatPhoneNumberOnChange, sanitizeNumber } from "../../components/PhoneNumberFormat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EditInformation, EditInformationMutation } from "../../api/mutations/userMutations";
import Toasts from "../../components/Toasts";
import { stringToRegion } from "../../components/stringToDataType";
import { School } from "../../models/schools";
import { GetAllSchools } from "../../api/queries/schoolQueries";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { EditCoursesPanel } from "./components/EditCoursesPanel";

export default function EditProfilePage() {
    const [user] = useContext(UserContext);

    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: "Personal Information", value: '1' },
        { name: "Course Schedule", value: '2' },
    ]

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [region, setRegion] = useState<Region | string | undefined>("");
    const [school, setSchool] = useState<string>("");
    const [allSchools, setAllSchools] = useState<School[]>([]);

    const [last, setLast] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const result = useQuery({
        queryKey: ["getAllSchools"], queryFn: () => GetAllSchools()
    })

    useEffect(() => {
        if (result.data === undefined) return;
        setAllSchools(result.data);
    }, [result.data])

    const editMutation = useMutation({
        mutationFn: EditInformationMutation,
        onSuccess: (data, variables, context) => {
            setShow(true);
            setLoading(false);
            updateUser(variables);
        },
        onError: (data, variables, context) => {
            if (`${data}` === "Account has to be verified by an administrator.") {
                setErrorMessage(`${data}`);
            }
            console.error("Data: ", data, "Variables: ", variables, "Context: ", context);
            setLoading(false);
            editMutation.reset();
        }
    })

    const updateUser = (vars: EditInformation) => {
        if (!user) {
            window.location.href = "/";
            return;
        }
        user.firstName = vars.FirstName;
        user.lastName = vars.LastName;
        user.email = vars.Email;
        user.phoneNumber = vars.PhoneNumber;
        user.region = vars.Region;
        user.school = allSchools.find(school => school.id === vars.SchoolId);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setErrorMessage("");
        let sanitizedNumber = sanitizeNumber(phoneNumber);
        let realRegion = stringToRegion(region);

        if (!user) {
            window.location.href = "/";
            return;
        }

        let newVals = [firstName, lastName, email, sanitizedNumber, realRegion, school];
        let oldVals = [user.firstName, user.lastName, user.email, user.phoneNumber, stringToRegion(user.region), user?.school ? user.school.id : ""];
        if (newVals.toString() === oldVals.toString()) return;

        if (sanitizedNumber && sanitizedNumber.length !== 10) {
            setErrorMessage("Phone number has to be 10 digits!")
            return;
        }

        if (user.userType === UserType.Teacher && (!school || school.length === 0)) {
            setErrorMessage("School has to be selected!");
            return;
        }

        if (realRegion === undefined) {
            setErrorMessage("Select Region.");
            return;
        }

        setLoading(true);
        editMutation.mutate({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            PhoneNumber: sanitizedNumber,
            Region: realRegion,
            SchoolId: school
        })
    }

    const onNumberChange = (e: any) => {
        e.target.value = formatPhoneNumberOnChange(e.target.value, phoneNumber, last);
        setLast(e.target.value.slice(-1) ? e.target.value.slice(-1) : "");
        setPhoneNumber(e.target.value);
    }

    useEffect(() => {
        if (!user) {
            window.location.href = "/";
            return;
        }
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhoneNumber(formatPhoneNumber(user.phoneNumber));
        setRegion(stringToRegion(user.region));
        setSchool(user?.school ? user.school.id : "");
    }, [user])

    if (result.isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <>
            <Toasts show={show} setShow={setShow} variant="success" title="Success!" message="Account Info has been updated!" />
            <h3 className="pb-2">Edit User Information</h3>

            {user?.userType === UserType.Teacher &&
                <ButtonGroup style={{ width: '100%' }}>
                    {radios.map((radio, i) => {
                        return (
                            <ToggleButton
                                key={i}
                                id={`radio-${i}`}
                                type="radio"
                                value={radio.value}
                                checked={radioValue === radio.value}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}
                            >
                                {radio.name}
                            </ToggleButton>
                        )
                    })}
                </ButtonGroup>
            }

            {radioValue === '1' ?

                <div className="p-3">
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

                        {user && user.userType === UserType.Teacher && <Form.Group className="mb-3">
                            <Form.Label>School</Form.Label>
                            <Form.Select onChange={(e) => setSchool(e.target.value)} value={school} required>
                                {allSchools.map((school) => {
                                    if (stringToRegion(school.region) !== stringToRegion(region)) return null;
                                    return <option key={school.id} value={school.id}>{school.schoolName}</option>
                                })}
                            </Form.Select>
                        </Form.Group>}

                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                        <Button variant="primary" disabled={isLoading} type="submit">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Form>
                </div>
                :
                <EditCoursesPanel />}
        </>
    )
}