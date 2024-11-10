import { useState } from "react"
import { Button, Card } from "react-bootstrap"

interface Props {
    Title: string,
    Content: string,
    Date: string,
    MaxChars: number
}

export const NewsCard = ({ Title, Content, Date, MaxChars }: Props) => {

    const [isExpanded, setIsExpanded] = useState(false);

    // Limit content based on `maxChars` or show full content if expanded
    const displayContent = isExpanded ? Content : Content.slice(0, MaxChars);

    return (
        <Card style={{ margin: 'auto', marginTop: '10px', borderRadius: '0' }}>
            <Card.Body>
                <Card.Title>{Title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{Date}</Card.Subtitle>
                <Card.Text>
                    {displayContent}
                    {!isExpanded && Content.length > MaxChars && '  '}
                    {Content.length > MaxChars && (
                        <Button
                            variant="secondary"
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{ padding: "3px", height: "20px", lineHeight: '10px' }}
                        >
                            {isExpanded ? 'Show Less' : '...'}
                        </Button>
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}