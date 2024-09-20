import { useContext } from "react";
import { UserContext } from "../../components/UserWrapper";
import { useQuery } from "@tanstack/react-query";
import { GetUserPostings } from "../../api/queries/postQueries";
import { PostingCard } from "./components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function Postings() {
    const user = useContext(UserContext);

    const { data, isError, isLoading } = useQuery({
        queryKey: ['postingspage', user?.id],
        queryFn: GetUserPostings
    })

    data?.forEach((post) => {
        console.log(post);
    })

    if (data === undefined)
        return <LoadingSpinner />

    return (
        <>
            {data.map((post) => {
                return <PostingCard post={post} />;
            })}
        </>
    )
}