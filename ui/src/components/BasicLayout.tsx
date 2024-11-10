import { ReactNode, useContext } from "react"
import { Card, Container, Row } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { ThemeContext } from "./ThemeProvider";

interface Props {
    children: ReactNode
}

export const BasicLayout = ({ children }: Props) => {
    const theme = useContext(ThemeContext);
    const isDesktop = useMediaQuery({
        query: '(min-width: 600px)'
    })

    return (
        <>
            <Container data-bs-theme={theme?.value} style={{ minHeight: "100vh" }}>
                <Row className="justify-content-md-center">
                    <div style={{ "alignContent": "center", justifySelf: "center" }}>
                        <Card style={{ padding: isDesktop ? "20px 60px 20px 60px" : "5px", borderRadius: "10px", marginTop: isDesktop ? "4rem" : "1em" }}>
                            <Card.Body>
                                {children}
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    )
}