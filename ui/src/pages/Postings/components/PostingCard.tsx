import {
  Form,
  Button,
  Card,
  Col,
  Container,
  Row,
  Stack,
} from "react-bootstrap";
import { Post } from "../../../models/posting";

export enum PostingCardType {
    Browsing,
    PostedAccepted,
    PostedUnaccepted
}

interface Props {
  post: Post;
  type: PostingCardType;
}

export const PostingCard = ({ post, type }: Props) => {
  return (
    <Card style={{ margin: "2vw" }}>
      <Card.Header as="div">
        <Stack direction="horizontal">
          <h5>School Name - Grade(s)/Subject(s)</h5>
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
                <div className="p-2">{post.posterName}</div>
                <div className="p-2">{post.postDateOfAbsence.toString()}</div>
              </Stack>
            </div>
            <div className="p-2">School Name</div>
          </div>
          <div className="mx-auto">
            <Stack direction="horizontal" gap={2}>
              <div className="p-2">Subject Type</div>
              <div className="p-2">Time of class</div>
            </Stack>
          </div>
          <div className="d-grid gap-2">
            <div>
              { type === PostingCardType.Browsing && <Button variant="success">Accept</Button> }
              { type === PostingCardType.PostedUnaccepted && <Button variant="outline-danger">Cancel</Button> }
              { type === PostingCardType.PostedAccepted && <div className="p-2">Taken by: John Smith</div> }
            </div>
          </div>
        </Stack>
        {/* <Card.Text>Detailed description here!</Card.Text> */}
        {/* <Button variant="primary">View</Button> */}
      </Card.Body>
    </Card>
  );
};
