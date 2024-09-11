import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom";
import { userQuery, UserResult } from "../api/userQuery";
import { Navbar } from "../pages/SignUp";
import { Card, Container, Row } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

interface Props {
    children: ReactNode
}

export const BasicLayout = ({ children }: Props) => {

    const isDesktop = useMediaQuery({
        query: '(min-width: 600px)'
    })

    return (
        <>
            <div style={{ background: "grey", height: "100vh" }} >
                <Container >
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
            </div >
        </>
    )
}