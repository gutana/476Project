import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState, createContext } from "react"
// import { useNavigate } from "react-router-dom";
import { userQuery } from "../api/queries/userQueries";
import { User } from "../models/user";
import { RefreshMutation } from "../api/mutations/userMutations";
import { baseWebsiteURL } from "../utils/ApiURLs";

interface Props {
    children: ReactNode
}

export const getRefresh = async () => {
    const token = sessionStorage.getItem("refreshToken");
    const privatePath =
        window.location.href !== baseWebsiteURL + "/login" &&
        window.location.href !== baseWebsiteURL + "/signup";

    sessionStorage.clear();

    if (!token) {
        if (privatePath) window.location.href = "/login";
        return false;
    }

    const response = await RefreshMutation({
        refreshToken: token
    });

    if (!response) {
        if (privatePath) window.location.href = "/login";
        return false;
    }

    const expiresAt = Date.now() + response.expiresIn * 1000;
    sessionStorage.setItem("accessToken", response.accessToken);
    sessionStorage.setItem("refreshToken", response.refreshToken);
    sessionStorage.setItem("tokenExpiry", expiresAt.toString());
    return true;
}

export const UserContext = createContext<User | null>(null);

export const UserWrapper = ({ children }: Props) => {
    const [expiresAt, setExpiresAt] = useState(sessionStorage.getItem("tokenExpiry"))
    const [userQueryEnabled, setUserQueryEnabled] = useState(false);

    const { isLoading, isError, data } = useQuery({
        queryKey: ["userwrapper23452"],
        queryFn: () => userQuery(),
        enabled: userQueryEnabled
    })

    if (!expiresAt || Date.now() > parseInt(expiresAt)) {
        getRefresh().then(res => {
            setExpiresAt(res ? sessionStorage.getItem("tokenExpiry") : null);
        })
    }

    if (expiresAt === null) {
        window.location.href = "/login";
        return <></>
    }

    if (isError) {
        window.location.href = '/';
        sessionStorage.clear();
    }

    // If we get down here, then token is probably valid, so lets fetch user
    if (userQueryEnabled === false)
        setUserQueryEnabled(true);

    return (
        <UserContext.Provider value={data ?? null}>
            {children}
        </UserContext.Provider>
    )
}