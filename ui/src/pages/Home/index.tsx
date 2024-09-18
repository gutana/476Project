import { useContext } from "react";
import { UserContext } from "../../components/UserWrapper";

export default function Home() {
    const user = useContext(UserContext);

    return (
        <>
            <h3>{user && "Welcome, " + user?.firstName}</h3>
        </>
    )
}