import {
  Form,
  Button,
  Card,
  Col,
  Container,
  Row,
  Stack,
} from "react-bootstrap";
import { Post } from "../models/postings";
import { UserContext } from "./UserWrapper";
import { useContext } from "react";
import { UserType } from "../models/user";

interface Props {
  post: Post;
}

export const PostingCard = ({ post }: Props) => {
  const user = useContext(UserContext);

  const showAcceptbutton: boolean = post.acceptedByUserId == null && post.posterId != user?.id;
  const showCancelbutton: boolean = user?.userType === UserType.Administrator || post.posterId === user?.id;
  const showTakenByText: boolean = post.acceptedByUserFirstName != null;

  return (
    <Card style={{ margin: "2vw" }} key={post.id}>
      <Card.Header as="div">
        <Stack direction="horizontal">
          <h5>{post.school.schoolName} - {post.grades.toString()}</h5>
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
                <div className="p-2">{post.posterFirstName + " " + post.posterLastName}</div>
                <div className="p-2">DateOfAbsence</div>
              </Stack>
            </div>
            <div className="p-2">{post.school.schoolName}</div>
          </div>
          <div className="mx-auto">
            <Stack direction="horizontal" gap={2}>
              {post.primarySchoolSubjects != null && <div className="p-2">{post.primarySchoolSubjects}</div>}
              {post.secondarySchoolSubjects != null && <div className="p-2">{post.secondarySchoolSubjects}</div>}
              <div className="p-2">Time of class</div>
            </Stack>
          </div>
          <div className="d-grid gap-2">
            <div>
              { showAcceptbutton && <Button variant="success">Accept</Button> }
              { showCancelbutton && <Button variant="outline-danger">Cancel</Button> }
              { showTakenByText && <div className="p-2">Taken by: {post.acceptedByUserFirstName + " " + post.acceptedByUserLastName}</div> }
            </div>
          </div>
        </Stack>
        {/* <Card.Text>Detailed description here!</Card.Text> */}
        {/* <Button variant="primary">View</Button> */}
      </Card.Body>
    </Card>
  );
};
