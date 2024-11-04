import { ReactNode, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"

import { UserContext } from "./UserWrapper"
import { UserType } from "../models/user"

import { Button, Container, Image, Nav, Navbar } from "react-bootstrap"
import { CustomNavLink } from "./CustomNavLink"
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

                {/* Main Icon */}
                <Navbar.Brand>
                    <Nav.Link as={Link} to="/">
                        <Image style={{ marginTop: "-4px" }} height={"35px"} src="/images/icon.png" />
                        SubSystem
                    </Nav.Link>
                </Navbar.Brand>


                {/* Nav Links */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <CustomNavLink linkTo="/" text="Home" />
                        <CustomNavLink linkTo="/addPost" text="Add Post" allowedUsers={[UserType.Teacher]} />

                        {user?.userType === UserType.Administrator ?
                            <CustomNavLink linkTo="/viewPostings" text="All Postings" />
                            :
                            <CustomNavLink linkTo="/viewPostings" text="Available Postings" />
                        }

                        <CustomNavLink linkTo="/viewMyPostings" text="My Postings" />
                        <CustomNavLink linkTo="/edit" text="Edit Profile" />
                        <CustomNavLink linkTo="/postNews" text="Post News" allowedUsers={[UserType.Administrator]} />
                        <CustomNavLink linkTo="/requestedAccounts" text="Requested Accounts" allowedUsers={[UserType.Administrator]} />
                        <CustomNavLink linkTo="/addSchool" text="Add School" allowedUsers={[UserType.Administrator]} />
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