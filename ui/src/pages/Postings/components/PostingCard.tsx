import { Button, Card } from "react-bootstrap"
import { Post } from "../../../models/posting"

interface Props {
    post: Post
}

export const PostingCard = ({ post }: Props) => {
    return (
        <Card style={{ margin: '2vw' }}>
            <Card.Header as="h5">{post.SchoolName}</Card.Header>
            <Card.Body>
                <Card.Title>{post.PostDescription}</Card.Title>
                <Card.Text>
                    Detailed description here!
                </Card.Text>
                <Button variant="primary">View</Button>
            </Card.Body>
        </Card>
    )
}