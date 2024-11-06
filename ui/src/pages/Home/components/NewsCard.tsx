import { useContext } from "react"
import { Card } from "react-bootstrap"

interface Props {
    Title: string,
    Content: string,
    Date: string
}

export const NewsCard = ({ Title, Content, Date }: Props) => {

    return (
        <Card style={{ margin: 'auto', marginTop: '10px' }}>
            <Card.Body>
                <Card.Title>{Title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted" >{Date}</Card.Subtitle>
                <Card.Text>{Content}</Card.Text>
            </Card.Body>
        </Card>
    )
}