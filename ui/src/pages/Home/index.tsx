import { useQuery } from "@tanstack/react-query"
import { GetHello } from "../../api/testQuery";
import { useContext } from "react";
import { UserContext } from "../../components/UserWrapper";

export default function Home() {
    const { isLoading, error, data } = useQuery({
        queryKey: ['test12354'],
        queryFn: () => GetHello()
    })

    const user = useContext(UserContext);

    if (isLoading)
        return (<h1>Loading...</h1>);

    if (data != undefined)
        return (
            <>
                <h1>{data.response}</h1>
                <h3>{user && "Welcome, " + user?.firstName}</h3>
            </>
        )

    return (<h1>Error: {error?.message}</h1>);
}