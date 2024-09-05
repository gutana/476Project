import { useQuery } from "@tanstack/react-query"
import { GetHello } from "../../api/testQuery";

export default function Home() {
    const { isLoading, error, data } = useQuery({
        queryKey: ['test12354'],
        queryFn: () => GetHello()
    })

    if (isLoading)
        return (<h1>Loading...</h1>);

    if (data != undefined)
        return (<h1>{data.response}</h1>)

    return (<h1>Error: {error?.message}</h1>);
}