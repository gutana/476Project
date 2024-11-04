import { useContext } from "react";
import { UserContext } from "../../components/UserWrapper";
import { useQuery } from "@tanstack/react-query";
import { GetAvailablePosts, GetAllPosts } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { UserType } from "../../models/user";

// View ALL postings page if administrator
export default function ViewPostingsPage() {
    const user = useContext(UserContext);

    const { data, isLoading, isError } = useQuery({
        queryFn: (user?.userType != UserType.Administrator ? () => GetAvailablePosts() : () => GetAllPosts()),
        queryKey: ['getAvailablePosts'],
        enabled: user != null
    })

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {data?.map((post) => {
                return <PostingCard post={post} key={post.id} />;
            })}
        </>
    );
}

