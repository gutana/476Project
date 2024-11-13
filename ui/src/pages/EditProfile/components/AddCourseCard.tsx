import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import { allGrades, primarySubjects, secondarySubjects } from "../../../utils/consts"
import { ReactElement, useContext, useEffect, useState } from "react"
import { UserContext } from "../../../components/UserWrapper"
import { Grade, MapGradeNameToGrade, PrimarySchoolSubject, SecondarySchoolSubject } from "../../../models/postings"
import { useMutation } from "@tanstack/react-query"
import { AddCourseToProfileMutation } from "../../../api/mutations/accountMutations"
import { SchoolType } from "../../../models/schools"
import { Token, Typeahead } from "react-bootstrap-typeahead"
import { Option, RenderTokenProps, TypeaheadProps } from "react-bootstrap-typeahead/types/types"


export const AddCourseCard = () => {

    const [grades, setGrades] = useState<string[]>([]);
    const [subject, setSubject] = useState<PrimarySchoolSubject | SecondarySchoolSubject | null>();
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [infoText, setInfoText] = useState<string | null>("");

    const [user, refetch] = useContext(UserContext);
    const isPrimarySchoolTeacher = user?.school?.schoolType === "Primary";

    const addCourseMutation = useMutation({
        mutationFn: AddCourseToProfileMutation,
        onSuccess: (data, variables, context) => {
            console.log("Great success!");
            if (refetch !== null)
                refetch();
        },
        onError: (data, variables, context) => {

        }
    })

    const setGradeSelection = (e: Option[]) => {
        console.log(e);
        setGrades(e as string[]);
    }
    const setSubjectSelection = (e: any) => {
        setSubject(e.target.selectedIndex)
    }
    const setStartTimeSelection = (e: any) => {
        setStartTime(e.target.value);
    }
    const setEndTimeSelection = (e: any) => {
        setEndTime(e.target.value);
    }
    const setInfoTextSelection = (e: any) => {
        setInfoText(e.target.value);
    }

    // Set our state variables at the start so they aren't undefined
    // if the user wants the default value
    useEffect(() => {
        if (user?.school?.schoolType === SchoolType.Primary) {
            setSubject(PrimarySchoolSubject.FrenchImmersion)
        }
        else {
            setSubject(SecondarySchoolSubject.English)
        }
    }, [user])

    const submit = () => {
        if (grades.length === 0 || subject === null || !startTime || !endTime) {
            console.log("Not all fields selected when adding course.");
            return;
        }

        if (isPrimarySchoolTeacher) {
            addCourseMutation.mutate({
                grades: grades.map(grade => MapGradeNameToGrade(grade)),
                startTime: startTime,
                endTime: endTime,
                primarySchoolSubject: subject as PrimarySchoolSubject,
                information: infoText
            })
        }
        else {
            addCourseMutation.mutate({
                grades: grades.map(grade => MapGradeNameToGrade(grade)),
                startTime: startTime,
                endTime: endTime,
                secondarySchoolSubject: subject as SecondarySchoolSubject,
                information: infoText
            })
        }
    }

    const props: {
        multiple?: boolean,
        renderToken?: (option: any, { onRemove }: RenderTokenProps, index: any) => React.JSX.Element
    } = {};

    props.multiple = true;
    props.renderToken = (option, tokenProps: RenderTokenProps, index) => {
        return (
            <Token key={index} {...tokenProps} option={option}>
                {`${option}`}
            </Token>
        )
    }


    return (
        <Card style={{ marginTop: '10px' }}>
            <Card.Body>
                <Container>
                    <Row>
                        <Col className="d-flex flex-column">
                            <h3>Add a Course</h3>
                            <Form.Label className="mt-auto">Grade(s):</Form.Label>
                            <Typeahead
                                {...props}
                                id="SelectedGrades"
                                onChange={setGradeSelection}
                                options={isPrimarySchoolTeacher ?
                                    allGrades.slice(0, 10).map(grade =>
                                        grade.name
                                    ) :
                                    allGrades.slice(10).map(grade =>
                                        grade.name
                                    )
                                }
                                selected={grades}
                            />
                        </Col>
                        <Col className="d-flex flex-column">
                            <Form.Label className="mt-auto">Subject:</Form.Label>
                            <Form.Select
                                onChange={setSubjectSelection}>
                                {isPrimarySchoolTeacher ?
                                    primarySubjects.map(subject =>
                                        <option key={subject.value} value={subject.value}>
                                            {subject.name}
                                        </option>
                                    ) :
                                    secondarySubjects.map(grade =>
                                        <option key={grade.value} value={grade.value}>
                                            {grade.name}
                                        </option>
                                    )
                                }
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Label>Start time</Form.Label>
                            <Form.Control
                                type="time"
                                onChange={setStartTimeSelection}
                            />
                            <Form.Label>End time</Form.Label>
                            <Form.Control
                                type="time"
                                onChange={setEndTimeSelection}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "5px" }}>
                        <Form.Group>
                            <Form.Label>Additional Information</Form.Label>
                            <Form.Control onChange={setInfoTextSelection} placeholder="Helpful info, such as location." as="textarea" rows={2}></Form.Control>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Button onClick={submit} style={{ marginTop: "10px" }}>Add</Button>
                    </Row>
                </Container>
            </Card.Body>
        </Card >)

}