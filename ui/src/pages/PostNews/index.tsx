import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/UserWrapper";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../models/user";
import { Alert, Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { PostNewsMutation } from "../../api/mutations/newsMutations";

export default function PostNews() {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    const [resultMessage, setResultMessage] = useState<string | null>(null);

    const postNewsMutation = useMutation({
        mutationFn: PostNewsMutation,
        onSuccess: (data, variables, context) => {
            console.log("Successful post!");
            setResultMessage("Post was successful!");
        },
        onError: (data, variables, context) => {
            console.error("Data: ", data, "Variables: ", variables, "Context: ", context);
            postNewsMutation.reset();
        }
    })

    if (user?.userType !== UserType.Administrator)
        navigate('/');

    const onSubmit = (event: any) => {
        event.preventDefault();
        const title = event.target[0].value;
        const content = event.target[1].value;

        postNewsMutation.mutate({
            Title: title,
            Content: content
        })

        event.target[0].value = "";
        event.target[1].value = "";
    }

    return (
        <div style={{
            maxWidth: '800px',
            margin: 'auto'
        }}>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Content" />
                </Form.Group>
                <Button type="submit" style={{ marginTop: "10px", width: "100%" }}>Post</Button>
            </Form>
            {
                resultMessage &&
                <Alert style={{ marginTop: "10px" }} variant="success">{resultMessage}</Alert>
            }
        </div>
    )
}