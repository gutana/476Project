import { useContext, useState } from "react";
import { UserContext} from "../../components/UserWrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetUserPostings } from "../../api/queries/postQueries";
import { PostingMutation } from "../../api/mutations/postingMutations"
import { PostingCard } from "./components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Alert, Button, Form, Modal } from "react-bootstrap";

export default function Postings() {
  const user = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);

  const createPostingMutation = useMutation({
    mutationFn: PostingMutation,
    onSuccess: (data, variables, context) => {
        setShowModal(false);
    },
    onError: (data, variables, context) => {
        createPostingMutation.reset();
    }
  });

  const { data, isLoading, isError } = useQuery({
    queryFn: () => GetUserPostings(),
    queryKey: ['getUserPosts123']
  })

   data?.forEach((post) => {
    console.log(post);
   });

  const handleSubmit = (event: any) => {
    event.preventDefault();

    createPostingMutation.mutate({
        Title: event.target[0].value, 
        Description: event.target[1].value
    })
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Create Posting
      </Button>{" "}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Posting</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={ 5 } placeholder="Enter description" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      { isLoading && <LoadingSpinner />}
      {data?.map((post) => {
        return <PostingCard post={post} />;
      })}
    </>
  );
}
