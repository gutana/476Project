import { Button, Card, Spinner, Stack } from "react-bootstrap";
import { Post } from "../models/postings";
import { UserContext } from "./UserWrapper";
import { useContext, useState } from "react";
import { UserType } from "../models/user";
import { AcceptPostingMutation } from "../api/mutations/postMutations";
import { useMutation } from "@tanstack/react-query";
import Toasts from "./Toasts";

interface Props {
    post: Post;
    setPostings?: React.Dispatch<React.SetStateAction<Post[]>>
}

export const PostingCard = ({ post, setPostings }: Props) => {
    const user = useContext(UserContext);

    const showAcceptbutton: boolean =
        post.acceptedByUserId == null && post.posterId != user?.id;
    const showCancelbutton: boolean =
        user?.userType === UserType.Administrator || post.posterId === user?.id;
    const showTakenByText: boolean = post.acceptedByUserFirstName != null;

    const [show, setShow] = useState(false);
    const [variant, setVariant] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

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
                    setPostings(prev => prev.filter(item => item.id !== post.id))

            } else {
                setShow(true);
                setVariant("danger");
                setTitle("Whoops!");
                setMessage("Unknown error has occurred. Please try again later.");
            }

            acceptPostMutation.reset();
        },
    });

    const handleAccept = () => {
        if (user != null) acceptPostMutation.mutate(post.id);
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
            <Card style={{ margin: "2vw" }} key={post.id}>
                <Card.Header as="div">
                    <Stack direction="horizontal">
                        <h5>
                            {post.school.schoolName} - {post.grades.toString()}
                        </h5>
                        <div className="ms-auto">
                            <Button variant="secondary">Hide</Button>
                        </div>
                    </Stack>
                </Card.Header>

                <Card.Body>
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
                                {showAcceptbutton && (acceptPostMutation.isSuccess ? (
                                    // Success button
                                    <Button
                                        disabled
                                        variant={"success"}
                                    >
                                        Accepted
                                    </Button>
                                ) : (
                                    // accept/loading button
                                    <Button
                                        disabled={acceptPostMutation.isPending}
                                        variant={"primary"}
                                        onClick={handleAccept}
                                    >
                                        {acceptPostMutation.isPending ? <Spinner /> : "Accept"}
                                    </Button>
                                ))}
                                {showCancelbutton && (
                                    <Button
                                        style={{ marginLeft: "5px" }}
                                        variant="outline-danger"
                                    >
                                        Cancel
                                    </Button>
                                )}
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
                </Card.Body>
            </Card>
        </>
    );
};
