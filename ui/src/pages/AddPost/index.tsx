import { useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { UserContext } from "../../components/UserWrapper";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Substitute, User, UserType } from "../../models/user";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toasts from "../../components/Toasts";
import { Grade, PrimarySchoolSubject, SecondarySchoolSubject } from "../../models/postings";
import { subQuery } from "../../api/queries/subQueries";
import { AddPostingMutation } from "../../api/mutations/postMutations";
import { School } from "../../models/schools";
import { Typeahead } from "react-bootstrap-typeahead";
import { allGrades, primarySubjects, secondarySubjects } from "../../utils/consts";
import { stringToGrades, stringToPrimary, stringToSecondary } from "../../components/stringToDataType";
import 'react-bootstrap-typeahead/css/Typeahead.css';

interface TypeaheadValue {
    name: string,
    value: string
}

interface Props {
    selection: TypeaheadValue[]
    setSelection: Dispatch<SetStateAction<TypeaheadValue[]>>
    values: any[]
    title: string
    placeholder: string
}

function MultipleSelection({ values, title, placeholder, selection, setSelection }: Props) {
    const setSelections = (vals: any) => {
        setSelection(vals);
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label>{title}</Form.Label>
            <Typeahead
                id={placeholder}
                labelKey="name"
                multiple
                onChange={setSelections}
                options={values}
                placeholder={placeholder}
                selected={selection}
            />
        </Form.Group>
    );
}

export default function AddPostPage() {
    let user = useContext(UserContext);

    const [desc, setDesc] = useState("");
    const [requestedSub, setRequestedSub] = useState<any>([]);
    const [grades, setGrades] = useState<TypeaheadValue[]>([]);
    const [primary, setPrimary] = useState<TypeaheadValue[]>([]);
    const [secondary, setSecondary] = useState<TypeaheadValue[]>([]);

    const [variant, setVariant] = useState("success");
    const [title, setTitle] = useState("Success!");
    const [message, setMessage] = useState("");

    const [schools, setSchools] = useState<School[]>([]);
    const [subs, setSubs] = useState<Substitute[]>([]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const { data, isLoading, isError, error } = useQuery({
        queryFn: () => subQuery(),
        queryKey: ["getSubQuery"]
    })

    const capitalizeFirst = (value: string) => {
        return value.slice(0, 1).toUpperCase() + value.slice(1);
    }

    const translateToSub = (users: User[]): Substitute[] => {
        let subs: Substitute[] = [];
        users.forEach(user => {
            let a: Substitute = {
                id: user.id,
                name: capitalizeFirst(user.firstName) + " " + capitalizeFirst(user.lastName),
                region: user.region
            }

            subs.push(a);
        });

        return subs;
    }

    useEffect(() => {
        if (data == undefined)
            return;

        setSubs(translateToSub(data ?? []));
    }, [data])

    useEffect(() => {
        if (error != null)
            handleQueryErrors(error);
    }, [error])

    const postMutation = useMutation({
        mutationFn: AddPostingMutation,
        onSuccess: (data, variables, context) => {
            notifyUser(data, true);
        },
        onError: (data, variables, context) => {
            notifyUser(data.toString(), false);
            console.error("Data: ", data, "Variables: ", variables, "Context: ", context);
            postMutation.reset();
        }
    })

    const translateGrade = (primary: boolean): any => {
        if (grades.length === 0) return -1;
        let translatedGrade: Grade[] = [];
        let gradesValue: string[] = [];

        grades.forEach(grade => {
            gradesValue.push(grade.value);
        })

        for (let i = 0; i < gradesValue.length; i++) {
            let grade = gradesValue[i];
            let translated = stringToGrades(grade);
            if (translated === null) return -1;
            if (Number(grade) > 9 && primary) return -2;
            if (Number(grade) < 10 && !primary) return -3;
            translatedGrade.push(translated);
        }

        return translatedGrade;
    }

    const translatePrimary = (): any => {
        let translatedPrimary: PrimarySchoolSubject[] = [];
        let primaryValue: string[] = [];
        primary.forEach(p => {
            primaryValue.push(p.value);
        })

        for (let i = 0; i < primaryValue.length; i++) {
            let p = primaryValue[i];
            let translated = stringToPrimary(p);
            if (translated === null) return -1;
            translatedPrimary.push(translated);
        }

        return translatedPrimary;
    }

    const translateSecondary = (): any => {
        let translatedSecondary: SecondarySchoolSubject[] = [];
        let secondaryValue: string[] = [];
        secondary.forEach(s => {
            secondaryValue.push(s.value);
        })

        for (let i = 0; i < secondaryValue.length; i++) {
            let s = secondaryValue[i];
            let translated = stringToSecondary(s);
            if (translated === null) return -1;
            translatedSecondary.push(translated);
        }

        return translatedSecondary;
    }

    const notifyUser = (data: string, success: boolean) => {
        if (success) {
            setVariant("success");
            setTitle("Success!")
        } else {
            setVariant("danger");
            setTitle("Error");
        }

        setMessage(data);
        setShow(true);
    }

    const handleQueryErrors = (e: Error) => {
        let reason = "Unknown Error Occured!";
        reason = e.message ?? "Unknown Error Occured!";
        notifyUser(reason, false);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setErrorMessage("");

        if (!user) {
            window.location.href = "/";
            return;
        }

        let school: School | undefined = user?.school;
        let reqSub: Substitute | undefined = requestedSub[0];

        if (school) {
            let sType = school.schoolType.toString();
            if (sType === "Primary" && primary.length === 0) {
                setErrorMessage("Set a Primary School Subject.");
                return;
            }
            else if (school.schoolType.toString() === "Secondary" && secondary.length === 0) {
                setErrorMessage("Set a Secondary School Subject.");
                return;
            }
        } else {
            setErrorMessage("Choose a school.");
            return;
        }

        let sType = school.schoolType.toString();
        let grade: Grade[] | number = translateGrade(sType === "Primary");

        if (grade === -1) {
            setErrorMessage(`Select a ${sType} Grade.`);
            return;
        }
        if (grade === -2) {
            setErrorMessage("Invalid Primary Grade.");
            return;
        }
        if (grade === -3) {
            setErrorMessage("Invalid Secondary Grade.")
            return;
        }

        if (typeof grade === "number") {
            setErrorMessage("Invalid grade.");
            return;
        }

        let realPrimary = translatePrimary();
        let realSecondary = translateSecondary();

        if (realPrimary === -1 && sType === "Primary") {
            setErrorMessage("Primary Subject Error.");
            return;
        } else if (realSecondary === -1 && sType === "Secondary") {
            setErrorMessage("Secondary Subject Error.");
            return;
        }

        if (sType === "Primary")
            realSecondary = null;
        else
            realPrimary = null;

        console.log({
            schoolId: school.id,
            requestedSub: reqSub ? reqSub.id : "",
            postDescription: desc,
            private: requestedSub.length !== 0,
            grades: grade,
            primarySchoolSubjects: realPrimary,
            secondarySchoolSubjects: realSecondary
        });

        postMutation.mutate({
            requestedSub: reqSub ? reqSub.id : "",
            schoolId: school.id,
            postDescription: desc,
            private: requestedSub.length !== 0,
            grades: grade,
            primarySchoolSubjects: realPrimary,
            secondarySchoolSubjects: realSecondary
        })
    }

    const changeSub = (e: any) => {
        setRequestedSub(e);
    }

    if (!user || isLoading || postMutation.isPending) {
        return (
            <LoadingSpinner />
        )
    }

    if ((!isLoading && !user) || (user && user.userType === UserType.Teacher)) {
        window.location.href = "/";
    }

    return (
        <>
            <Toasts show={show} setShow={setShow} variant={variant} title={title} message={message} />
            <div className="p-3">
                <h3 className="pb-2">Add New Posting for {user?.school?.schoolName}</h3>
                <Form onSubmit={handleSubmit}>

                    {user?.school && <MultipleSelection values={user.school.schoolType.toString() === "Primary" ? allGrades.slice(0, 10) : allGrades.slice(10)} title="Grade(s)" placeholder="Select grades..." selection={grades} setSelection={setGrades} />}
                    {user?.school && user.school.schoolType.toString() === "Primary" &&
                        <MultipleSelection values={primarySubjects} title="Primary School Subject(s)" placeholder="Select primary subject..." selection={primary} setSelection={setPrimary} />}
                    {user?.school && user.school.schoolType.toString() === "Secondary" &&
                        <MultipleSelection values={secondarySubjects} title="Secondary School Subject(s)" placeholder="Select secondary subject..." selection={secondary} setSelection={setSecondary} />}

                    <Form.Group className="mb-3" controlId="substitute">
                        <Form.Label>Request Substitute</Form.Label>
                        <Typeahead labelKey="name" selected={requestedSub} options={subs} id="1" placeholder="Search substitute..." onChange={changeSub} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={5} required value={desc} onChange={(e) => setDesc(e.target.value)} />
                    </Form.Group>

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Button variant="primary" disabled={isLoading} type="submit">
                        {isLoading ? 'Adding...' : 'Add Posting'}
                    </Button>
                </Form>
            </div>
        </>
    )
}