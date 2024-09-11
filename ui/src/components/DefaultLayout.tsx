import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom";
import { userQuery, UserResult } from "../api/userQuery";
import { Navbar } from "../pages/SignUp";

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