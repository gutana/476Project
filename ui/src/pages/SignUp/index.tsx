import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { RegistrationMutation } from "../../api/mutations/userMutations";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Alert, Form } from "react-bootstrap";
import { InformationModal } from "../../components/InformationModal";
import { Region, UserType } from "../../models/user";
import {
    formatPhoneNumberOnChange,
    sanitizeNumber,
} from "../../components/PhoneNumberFormat";
import { GetAllSchools } from "../../api/queries/schoolQueries";
import { School } from "../../models/schools";
import { stringToRegion, stringToUserType } from "../../components/stringToDataType";
import validator from "validator";

export default function SignUp() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [last, setLast] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorMessagePass, setErrorMessagePass] = useState<string | null>(null);
    const [errorMessageEmail, setErrorMessageEmail] = useState<string | null>(null);
    const [errorMessagePassConfirm, setErrorMessagePassConfirm] = useState<string | null>(null);
    // const [schoolsQueryEnabled, setSchoolsQueryEnabled] = useState(false);
    const [region, setRegion] = useState<Region | null>(null);

    const [allSchools, setAllSchools] = useState<School[]>([]);
    const [userType, setUserType] = useState<UserType | null>(null);

    //const [pass, setPass] = useState<string>("");
    //const [confirmPass, setConfirmPass] = useState<string>("");

    // const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => GetAllSchools(),
        queryKey: ["getAllSchools"],
    });

    const registrationMutation = useMutation({
        mutationFn: RegistrationMutation,
        onSuccess: (data, variables, context) => {
            setShowModal(true);
        },
        onError: (data, variables, context) => {
            setErrorMessage("Unable to sign up. Please try again later.");
            registrationMutation.reset();
        },
    });

    const handlePasswordClear = (event: any) => {
        let item = event.target.value;
        let validPassword = false;
        //console.log(item);
        if (item === "") {
            //setErrorMessagePass("Please enter a password");
        }
        if (validator.isStrongPassword(event.target.value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 0
        })) {
            setErrorMessagePass("")
            validPassword = true;
        }
        else {
            //setErrorMessagePass("Password not strong enough, must include: 8 characters, 1 uppercase, 1 number.");
        }
    }

    const handlePasswordSet = (event: any) => {
        let item = event.target.value;
        if (item === "") {
            setErrorMessagePass("Please enter a password");
        }
        if (validator.isStrongPassword(item, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 0
        }) === false && item.length > 0) {
            setErrorMessagePass("Password not strong enough, must include: 8 characters, 1 uppercase, 1 number.");
        }
    }

    /*const handlePasswordConfirm = (event: any) => {
        if (event.target[4].value !== event.target[5].value) {  --> does not work
            setErrorMessagePassConfirm("Passwords do not match");
        }

        if (event.target[4].value === event.target[5].value) {
            setErrorMessagePassConfirm("");
        }
    } */

    const handleEmailClear = (event: any) => {
        let item = event.target.value;
        let validEmail = false;
        //console.log(item);
        if (validator.isEmail(item)) {
            validEmail = true;
            setErrorMessageEmail("");
        }

        if (item === "") {
            validEmail = false;
            //setErrorMessageEmail("Please enter an email");
        }

        if (validator.isEmail(item) === false && item.length > 0) {
            validEmail = false;
            //setErrorMessageEmail("Not a valid email");
        }
    }

    const handleEmailSet = (event: any) => {
        let item = event.target.value;

        if (item === "") {
            setErrorMessageEmail("Please enter an email address");
        }

        if (validator.isEmail(item) === false && item.length > 0) {
            setErrorMessageEmail("Email address is not valid");
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        setErrorMessage("");

        let sanitizedNumber = sanitizeNumber(phoneNumber);
        if (sanitizedNumber.length !== 10) {
            setErrorMessage("Invalid Phone Number!");
            return;
        }

        let passConfirm = event.target[5].value;
        if (passConfirm !== event.target[4].value) {
            setErrorMessagePassConfirm("Passwords do not match");
            return;
        }

        if (passConfirm === event.target[4].value) {
            setErrorMessagePassConfirm("");
        }

        let data = {
            FirstName: event.target[0].value,
            LastName: event.target[1].value,
            Email: event.target[2].value,
            PhoneNumber: sanitizedNumber,
            Password: event.target[4].value,
            Region: event.target[6].value,
            UserType: event.target[7].value,
            SchoolId: event.target[8].value
        };

        console.log(event);

        if (data.Region === "-1" || data.UserType === "-1") {
            setErrorMessage("Region/Account Type has to be selected!");
            return;
        }

        if (data.SchoolId === "-1") {
            setErrorMessage("School has to be selected!");
            return;
        }

        if (validator.isEmail(data.Email) === false) {
            return;
        }

        if (validator.isStrongPassword(data.Password, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 0
        }) === false) {
            return;
        }

        registrationMutation.mutate(data);
    };

    const onNumberChange = (e: any) => {
        e.target.value = formatPhoneNumberOnChange(
            e.target.value,
            phoneNumber,
            last
        );
        setLast(e.target.value.slice(-1) ? e.target.value.slice(-1) : "");
        setPhoneNumber(e.target.value);
    };

    useEffect(() => {
        if (data === undefined) return;
        setAllSchools(data);
    }, [data])

    const onRegionChange = (event: any) => {
        setRegion(event.target.value as Region);
    }

    const handleClose = () => {
        navigate("/");
    };

    if (registrationMutation.isPending) {
        return <LoadingSpinner />;
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
                        <Form.Control
                            type="email"
                            aria-describedby="emailHelp"
                            required
                            onChange={handleEmailClear}
                            onBlur={handleEmailSet}                        />
                        <Form.Text id="emailHelp" muted>
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    {errorMessageEmail && <Alert variant="danger">{errorMessageEmail}</Alert>}

                    <Form.Group className="mb-3" controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={phoneNumber}
                            onChange={onNumberChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            onChange={handlePasswordClear}
                            onBlur={handlePasswordSet}
                        />
                    </Form.Group>
                    {errorMessagePass && <Alert variant="danger">{errorMessagePass}</Alert>}

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            //onChange={handlePasswordConfirm}
                        />
                    </Form.Group>
                    {errorMessagePassConfirm && <Alert variant="danger">{errorMessagePassConfirm}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Region</Form.Label>
                        <Form.Select defaultValue="-1" onChange={onRegionChange} required>
                            <option value="-1" disabled>
                                Select your region
                            </option>
                            <option value={Region.Regina}>Regina</option>
                            <option value={Region.Saskatoon}>Saskatoon</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Account Type</Form.Label>
                        <Form.Select onChange={(e) => setUserType(stringToUserType(e.target.value))} defaultValue="-1" required>
                            <option value="-1" disabled>
                                Select account type
                            </option>
                            <option value={UserType.Teacher}>Teacher</option>
                            <option value={UserType.Substitute}>Substitute</option>
                            <option value={UserType.Administrator}>Administrator</option>
                        </Form.Select>
                    </Form.Group>

                    {!isLoading && region && userType && userType === UserType.Teacher && (
                        <Form.Group className="mb-3">
                            <Form.Label>School</Form.Label>
                            <Form.Select defaultValue="-1" required>
                                <option value="-1" disabled>
                                    Select a school
                                </option>
                                {allSchools.map((school) => {
                                    if (stringToRegion(school.region) !== stringToRegion(region)) return;
                                    return <option key={school.id} value={school.id}>{school.schoolName}</option>;
                                })}
                            </Form.Select>
                        </Form.Group>
                    )}

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>

                    <Button style={{ fontWeight: 'normal', marginLeft: "6px"}} variant="secondary" href="/login">Already have an account?</Button>
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
    );
}
