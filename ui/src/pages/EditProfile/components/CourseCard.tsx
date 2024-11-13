import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { PrimarySchoolCourse, SecondarySchoolCourse } from "../../../models/courseSchedule";
import { FormatDateForDisplayAsTimeOnly } from "../../../utils/miscUtils";
import { TrashIcon } from "../../../components/Icons";
import { useMutation } from "@tanstack/react-query";
import { DeleteCourseMutation } from "../../../api/mutations/accountMutations";
import { useContext } from "react";
import { UserContext } from "../../../components/UserWrapper";

interface Props {
    course: PrimarySchoolCourse | SecondarySchoolCourse
    setCourses: React.Dispatch<React.SetStateAction<(PrimarySchoolCourse | SecondarySchoolCourse)[]>>
}

export const CourseCard = ({ course, setCourses }: Props) => {

    const [_, refetch] = useContext(UserContext);

    const deleteMutation = useMutation({
        mutationFn: DeleteCourseMutation,
        onSuccess: () => {
            setCourses(prev => prev.filter(elem => elem.id !== course.id))
            if (refetch !== null)
                refetch();
        },
        onError: () => {

        }
    });

    return (
        <Card style={{ marginTop: "10px", padding: "15px" }}>
            <Row>
                <Col lg={3}>
                    <Container>
                        <h5 className="mt-1">{course.subject}</h5>
                    </Container>
                </Col>
                <Col lg={9}>
                    <Row>
                        <Col>{<b>Grade(s): </b>}{course.grades.join(", ")}</Col>
                        <Col>{<b>Start time: </b>} {FormatDateForDisplayAsTimeOnly(course.startTime)}</Col>
                        <Col>{<b>End time: </b>} {FormatDateForDisplayAsTimeOnly(course.endTime)}</Col>
                    </Row>
                    <Row>
                        <Col style={{ marginTop: "5px" }}>
                            {<b>Additional Info: </b>} {course.location}
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="outline-danger"
                                    className="ml-auto"
                                    style={{ marginTop: '-10px' }}
                                    onClick={() => { deleteMutation.mutate(course.id) }}
                                >
                                    {deleteMutation.isPending ? <Spinner size="sm" /> : <TrashIcon size="20" />}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card >
    )
}



