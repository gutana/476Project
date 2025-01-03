import { Nav } from "react-bootstrap"
import { UserType } from "../models/user"
import { Link, NavLink } from "react-router-dom"

import { useContext } from "react"
import { UserContext } from "./UserWrapper"

interface Props {
    linkTo: string,
    text: string,
    allowedUsers?: UserType[]
}

export const CustomNavLink = ({ linkTo, text, allowedUsers }: Props) => {
    const [user, refetch] = useContext(UserContext);

    if (user == null) return null;

    if (allowedUsers === undefined || allowedUsers.includes(user.userType)) {
        return (<Nav.Link eventKey={linkTo} as={NavLink} to={linkTo}>{text}</Nav.Link>)
    }

    return null;
}