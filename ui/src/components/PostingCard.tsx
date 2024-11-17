import {
  Accordion,
  Button,
  Col,
  Container,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";
import {
  MapSchoolSubjectToString,
  Post,
} from "../models/postings";
import { UserContext } from "./UserWrapper";
import { useContext, useState } from "react";
import { UserType } from "../models/user";
import {
  AcceptPostingMutation,
  CancelPostingMutation,
} from "../api/mutations/postMutations";
import { useMutation } from "@tanstack/react-query";
import Toasts from "./Toasts";
import { formatDate, formatTime } from "../utils/Time";
import {
  PrimarySchoolCourse,
  SecondarySchoolCourse,
} from "../models/courseSchedule";
import Form from "react-bootstrap/Form";

interface Props {
  post: Post;
  setPostings?: Function;
}

interface AccordionProps {
  course: PrimarySchoolCourse | SecondarySchoolCourse;
}

const AccordionCourse = ({ course }: AccordionProps) => {
  const [active, setActive] = useState(false);
  const handleSelect = (e: any) => {
    setActive((prev) => !prev);
  };

  return (
    <Accordion
      className="mb-3"
      style={{ width: "50%" }}
      onSelect={handleSelect}
      activeKey={active ? course.id : null}
    >
      <Accordion.Item eventKey={course.id} key={course.id}>
        <Accordion.Header as="div">{MapSchoolSubjectToString(course.subject.toString())}</Accordion.Header>
        <Accordion.Body>
          {`Grade(s): ${course.grades.join(", ")}`}
          <br></br>
          Time:{" "}
          {`${formatTime(course.startTime)} to ${formatTime(course.endTime)}`}
          <br></br>
          {course.location && `Information: ${course.location}`}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export const PostingCard = ({ post, setPostings }: Props) => {
  const [user] = useContext(UserContext);

  const showAcceptbutton: boolean =
    post.acceptedByUserId === null &&
    post.posterId !== user?.id &&
    user?.userType !== UserType.Administrator;
  const showCancelbutton: boolean =
    ((user?.userType === UserType.Administrator &&
      post.acceptedByUserId !== null) ||
      post.posterId === user?.id ||
      post.acceptedByUserId === user?.id) &&
    post.dateOfAbsence > Date.now().toString();

  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [active, setActive] = useState(true);

  const acceptPostMutation = useMutation({
    mutationFn: AcceptPostingMutation,
    onSuccess: () => {
      setShow(true);
      setVariant("success");
      setTitle("Accepted");
      setMessage("Post has been accepted.");
    },
    onError: (data) => {
      if (data.cause === 420) {
        setShow(true);
        setVariant("danger");
        setTitle("Whoops!");
        setMessage(data.message);
        if (setPostings) setPostings(post.id);
      } else {
        setShow(true);
        setVariant("danger");
        setTitle("Whoops!");
        setMessage("Unknown error has occurred. Please try again later.");
      }

      acceptPostMutation.reset();
    },
  });

  const cancelPostMutation = useMutation({
    mutationFn: CancelPostingMutation,
    onSuccess: () => {
      setShow(true);
      setVariant("success");
      setTitle("Cancelled");
      setMessage("Post has been cancelled");
    },
    onError: (data) => {
      setShow(true);
      setVariant("danger");
      setTitle("Whoops!");
      setMessage("Unkown error has occurred. Please try again later.");
      cancelPostMutation.reset();
    },
  });

  const showTakenByText: boolean = cancelPostMutation.isIdle
    ? post.acceptedByUserFirstName != null
    : !cancelPostMutation.isSuccess;

  const handleAccept = () => {
    if (user != null) acceptPostMutation.mutate(post.id);
  };

  const labelValue = (label: string, value: string) => {
    return (
      <Col>
        <Form.Group className="mb-3">
          <Form.Label>
            <b>{label}</b>
          </Form.Label>
          {` ${value}`}
        </Form.Group>
      </Col>
    );
  };

  const handleCancel = () => {
    if (
      user?.id == post.posterId ||
      user?.id == post.acceptedByUserId ||
      user?.userType == UserType.Administrator
    ) {
      cancelPostMutation.mutate(post.id);
    }
  };

  const handleSelect = (e: any) => {
    setActive((prev) => !prev);
  };

  const formatSubject = (
    value: PrimarySchoolCourse | SecondarySchoolCourse
  ) => {
    let subject: string = "";
    subject = `${MapSchoolSubjectToString(
      value.subject.toString()
    )} - ${formatTime(value.startTime)} to ${formatTime(value.endTime)}`;
    return subject;
  };

  return (
    <>
      <Toasts
        show={show}
        setShow={setShow}
        variant={variant}
        title={title}
        message={message}
      />
      <Accordion onSelect={handleSelect} activeKey={active ? post.id : null}>
        <Accordion.Item
          eventKey={post.id}
          style={
            user?.id === post.posterId
              ? { margin: "2vw", backgroundColor: "rgba(132, 196, 161, 0.2)" }
              : { margin: "2vw" }
          }
          key={post.id}
        >
          <Accordion.Header as="div">
            <Stack
              direction="horizontal"
              style={
                user?.id === post.posterId
                  ? active
                    ? { color: "rgb(176, 214, 193)" }
                    : { color: "rgb(132, 196, 161)" }
                  : {}
              }
            >
              <h5>
                {post.school.schoolName} - {formatDate(post.dateOfAbsence)}
              </h5>
            </Stack>
          </Accordion.Header>

          <Accordion.Body>
            <Stack direction="vertical" gap={2}>
              <Container>
                <Row>
                  {labelValue(
                    "Posted By:",
                    post.posterFirstName + " " + post.posterLastName
                  )}
                  {labelValue("Date:", formatDate(post.dateOfAbsence))}
                </Row>
                <Row>
                  <Col>{post.postDescription}</Col>
                </Row>
                <Row className="mt-4">
                  {post.primarySchoolSubjects &&
                    post.primarySchoolSubjects.map((course) => {
                      return <AccordionCourse course={course} />;
                    })}
                  {post.secondarySchoolSubjects &&
                    post.secondarySchoolSubjects.map((course) => {
                      return <AccordionCourse course={course} />;
                    })}
                </Row>
                <Row className="mt-4">
                  <Col>
                  {showTakenByText && (
                    <div className="p-2">
                      Taken by:{" "}
                      {post.acceptedByUserFirstName +
                        " " +
                        post.acceptedByUserLastName}
                    </div>
                  )}
                    {showAcceptbutton &&
                      (acceptPostMutation.isSuccess ? (
                        // Success button
                        <Button className="w-100" disabled variant={"success"}>
                          Accepted
                        </Button>
                      ) : (
                        // accept/loading button
                        <Button
                          className="w-100"
                          disabled={acceptPostMutation.isPending}
                          variant={"success"}
                          onClick={handleAccept}
                        >
                          {acceptPostMutation.isPending ? (
                            <Spinner size="sm" />
                          ) : (
                            "Accept"
                          )}
                        </Button>
                      ))}
                  </Col>
                  <Col>
                    {showCancelbutton &&
                      (cancelPostMutation.isSuccess ? (
                        // Success button for cancelling
                        <Button className="w-100" disabled variant={"danger"}>
                          Cancelled
                        </Button>
                      ) : (
                        // cancel/loading button
                        <Button
                          className="w-100"
                          disabled={cancelPostMutation.isPending}
                          variant={"outline-danger"}
                          onClick={handleCancel}
                        >
                          {cancelPostMutation.isPending ? (
                            <Spinner />
                          ) : (
                            "Cancel"
                          )}
                        </Button>
                      ))}
                  </Col>
                </Row>
              </Container>
            </Stack>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}