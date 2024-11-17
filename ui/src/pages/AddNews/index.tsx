import { useContext, useState } from "react";
import { UserContext } from "../../components/UserWrapper";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../models/user";
import { Alert, Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { PostNewsMutation } from "../../api/mutations/newsMutations";

export default function AddNewsPage() {
    const [user] = useContext(UserContext);
    const navigate = useNavigate();

    if (!user || user.userType !== UserType.Administrator) {
        navigate("/");
    }

    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>();
    const [stateTitle, setTitle] = useState<string>("");
    const [stateContent, setContent] = useState<string>("");

    const postNewsMutation = useMutation({
        mutationFn: PostNewsMutation,
        onSuccess: (data, variables, context) => {
            setResultMessage("Post was successful!");
            setErrorMessage(null);
            setTitle("");
            setContent("");
            postNewsMutation.reset();
        },
        onError: (data, variables, context) => {
            if (`${data}` === "Account has to be verified by an administrator.") {
                setErrorMessage(`${data}`);
            }
            console.error("Data: ", data, "Variables: ", variables, "Context: ", context);
            postNewsMutation.reset();
        }
    })

    const handleTitle = (event: any) => {
        setTitle(event.target.value);
        //console.log(title);
    }

    const handleContent = (event: any) => {
        setContent(event.target.value);
    }

    const onSubmit = (event: any) => {
        event.preventDefault();
        setErrorMessage("");
        //const title = event.target[0].value;
        //const content = event.target[1].value;
        const title = stateTitle;
        const content = stateContent;

        let errMsg: string = "";

        let good: boolean = true;
        if (title === "") {
            good = false;
            errMsg = "Title cannot be empty. ";
        }
        if (content === "") {
            good = false;
            errMsg += " Content cannot be empty."
        }

        if (!good) {
            setErrorMessage(errMsg);
            return;
        }

        postNewsMutation.mutate({
            Title: title,
            Content: content
        })

        //event.target[0].value = "";
        //event.target[1].value = "";
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" onChange={handleTitle} value={stateTitle} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Content" onChange={handleContent} value={stateContent} />
                </Form.Group>
                <Button type="submit" style={{ marginTop: "10px", width: "100%" }}>Post</Button>
            </Form>
            {
                resultMessage &&
                <Alert style={{ marginTop: "10px" }} variant="success">{resultMessage}</Alert>
            }
            {
                errorMessage &&
                <Alert style={{ marginTop: "10px" }} variant="danger">{errorMessage}</Alert>
            }
        </div>
    )
}