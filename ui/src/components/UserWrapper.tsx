import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom";
import { userQuery, UserResult } from "../api/userQuery";

interface Props {
    children: ReactNode
}

export const UserContext = createContext<UserResult | null>(null);

// TODO: refresh token stuff
export const UserWrapper = ({ children }: Props) => {
    const [expiresAt, setExpiresAt] = useState(sessionStorage.getItem("tokenExpiry"))
    const [userQueryEnabled, setUserQueryEnabled] = useState(false);


    const { isLoading, isError, data } = useQuery({
        queryKey: ["userwrapper23452"],
        queryFn: () => userQuery(),
        enabled: userQueryEnabled
    })

    const navigate = useNavigate();

    useEffect(() => {
        if (expiresAt === null)
            navigate('/login');
    })

    if (expiresAt === null || Date.now() > parseInt(expiresAt)) {
        sessionStorage.clear();

        if (expiresAt != null)
            setExpiresAt(null);
    }

    if (expiresAt === null)
        return <></>

    // If we get down here, then token is probably valid, so lets fetch user
    if (userQueryEnabled === false)
        setUserQueryEnabled(true);

    return (
        <UserContext.Provider value={data ?? null}>
            {children}
        </UserContext.Provider>
    )
}