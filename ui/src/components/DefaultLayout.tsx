import { ReactNode, useContext } from "react"
import { Button, Container, Nav, Navbar as NavB } from "react-bootstrap"
import { UserContext } from "./UserWrapper"
import { useNavigate } from "react-router-dom"
interface Props {
    children: ReactNode
}

export const DefaultLayout = ({ children }: Props) => {

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}



export function Navbar() {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <NavB className="bg-body-tertiary">
            <Container>
                <NavB.Brand href="/">SubOptimal</NavB.Brand>
                <NavB.Toggle />
                <Nav.Link href="/postings">My Postings</Nav.Link>

                <NavB.Collapse className="justify-content-end">
                    <NavB.Text>
                        Signed in as: <a href="#login">{user?.firstName} {user?.lastName}</a>
                    </NavB.Text>
                    <Button
                        onClick={() => {
                            sessionStorage.clear();
                            navigate('/login');
                        }}
                        style={{ marginLeft: 10 }}
                        variant="danger">
                        Log Out
                    </Button>{' '}
                </NavB.Collapse>
            </Container>
        </NavB>
    );
}