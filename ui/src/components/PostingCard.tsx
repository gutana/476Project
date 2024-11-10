import { Accordion, Button, Card, Spinner, Stack } from "react-bootstrap";
import { Post } from "../models/postings";
import { UserContext } from "./UserWrapper";
import { useContext, useState } from "react";
import { UserType } from "../models/user";
import {
  AcceptPostingMutation,
  CancelPostingMutation,
} from "../api/mutations/postMutations";
import { useMutation } from "@tanstack/react-query";
import Toasts from "./Toasts";

interface Props {
  post: Post;
  setPostings?: React.Dispatch<React.SetStateAction<Post[]>>;
}

export const PostingCard = ({ post, setPostings }: Props) => {
  const user = useContext(UserContext);

  const showAcceptbutton: boolean =
    post.acceptedByUserId === null && post.posterId !== user?.id && user?.userType !== UserType.Administrator;
  const showCancelbutton: boolean =
    (user?.userType === UserType.Administrator && post.acceptedByUserId !== null) ||
    post.posterId === user?.id ||
    post.acceptedByUserId === user?.id;

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

        if (setPostings != undefined)
          setPostings((prev) => prev.filter((item) => item.id !== post.id));
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

  const handleCancel = () => {
    if (
      user?.id == post.posterId ||
      user?.id == post.acceptedByUserId ||
      user?.userType == UserType.Administrator
    ) {
      // unsure about user being null? thought of separate if that uses setMessage but then unsure if should make separate setMessage or use accept message
      cancelPostMutation.mutate(post.id);
    }
  };

  const handleSelect = (e: any) => {
    setActive((prev) => !prev);
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
          style={{ margin: "2vw" }}
          key={post.id}
        >
          <Accordion.Header as="div">
            <Stack direction="horizontal">
              <h5>
                {post.school.schoolName} - {post.grades.toString()}
              </h5>
            </Stack>
          </Accordion.Header>

          <Accordion.Body>
            {/* <Card.Title>{post.postDescription}</Card.Title> */}
            <Stack direction="horizontal" gap={2}>
              <div>
                <div>
                  <Stack direction="horizontal" gap={2}>
                    <div className="p-2">
                      {post.posterFirstName + " " + post.posterLastName}
                    </div>
                    <div className="p-2">DateOfAbsence</div>
                  </Stack>
                </div>
                <div className="p-2">{post.school.schoolName}</div>
              </div>
              <div className="mx-auto">
                <Stack direction="horizontal" gap={2}>
                  {post.primarySchoolSubjects != null && (
                    <div className="p-2">{post.primarySchoolSubjects}</div>
                  )}
                  {post.secondarySchoolSubjects != null && (
                    <div className="p-2">{post.secondarySchoolSubjects}</div>
                  )}
                  <div className="p-2">Time of class</div>
                </Stack>
              </div>
              <div className="d-grid gap-2">
                <div>
                  {showAcceptbutton &&
                    (acceptPostMutation.isSuccess ? (
                      // Success button
                      <Button disabled variant={"success"}>
                        Accepted
                      </Button>
                    ) : (
                      // accept/loading button
                      <Button
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
                  {showCancelbutton &&
                    (cancelPostMutation.isSuccess ? (
                      // Success button for cancelling
                      <Button
                        style={{ marginLeft: "5px" }}
                        disabled
                        variant={"danger"}
                      >
                        Cancelled
                      </Button>
                    ) : (
                      // cancel/loading button
                      <Button
                        style={{ marginLeft: "5px" }}
                        disabled={cancelPostMutation.isPending}
                        variant={"outline-danger"}
                        onClick={handleCancel}
                      >
                        {cancelPostMutation.isPending ? <Spinner /> : "Cancel"}
                      </Button>
                    ))}
                  {showTakenByText && (
                    <div className="p-2">
                      Taken by:{" "}
                      {post.acceptedByUserFirstName +
                        " " +
                        post.acceptedByUserLastName}
                    </div>
                  )}
                </div>
              </div>
            </Stack>
            {/* <Card.Text>Detailed description here!</Card.Text> */}
            {/* <Button variant="primary">View</Button> */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
