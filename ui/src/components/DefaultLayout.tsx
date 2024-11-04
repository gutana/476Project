import { ReactNode, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"

import { UserContext } from "./UserWrapper"
import { UserType } from "../models/user"

import { Button, Container, Image, Nav, Navbar } from "react-bootstrap"
interface Props {
    children: ReactNode
}

export const DefaultLayout = ({ children }: Props) => {

    return (
        <>
            <CustomNavbar />
            <div style={{ maxWidth: '800px', margin: 'auto', marginTop: '10px' }}>
                {children}
            </div>
        </>
    )
}

export function CustomNavbar() {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    return (
        <Navbar expand="lg" className="bg-body-tertiary container-fluid w-100 m-auto">
            <Container className="container-fluid">
                <Navbar.Brand>
                    <Nav.Link as={Link} to="/">
                        <Image style={{ marginTop: "-4px" }} height={"35px"} src="/images/icon.png" />
                        SubSystem
                    </Nav.Link>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {
                            user?.userType !== UserType.Teacher &&
                            <>
                                <Nav.Link as={Link} to="/addPost">Add Post</Nav.Link>
                            </>
                        }
                        <Nav.Link as={Link} to="/viewPostings">Available Postings</Nav.Link>

                        <Nav.Link as={Link} to='/viewMyPostings'>My Postings</Nav.Link>

                        <Nav.Link as={Link} to="/edit">Edit Profile</Nav.Link>
                        {
                            user?.userType === UserType.Administrator &&
                            <>
                                <Nav.Link as={Link} to="/postNews">Post News</Nav.Link>
                                <Nav.Link as={Link} to="/requestedAccounts">Requested Accounts</Nav.Link>
                                <Nav.Link as={Link} to="/addSchool">Add School</Nav.Link>
                            </>

                        }
                    </Nav>
                    <Button
                        className="ml-2 mr-5"
                        variant="danger"
                        onClick={() => {
                            sessionStorage.clear();
                            navigate('/login');
                        }}>
                        Log Out
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}