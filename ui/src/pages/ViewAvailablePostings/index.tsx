import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/UserWrapper";
import { useQuery } from "@tanstack/react-query";
import { GetAvailablePosts, GetAllPosts } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { UserType } from "../../models/user";
import { Post } from "../../models/postings";
import { EmptyPostingsCard } from "../../components/EmptyPostingsCard";

// View ALL postings page if administrator
export default function ViewPostingsPage() {
    const user = useContext(UserContext);

    const [postings, setPostings] = useState<Post[]>([]);

    const { data, isLoading, isError } = useQuery({
        queryFn: (user?.userType != UserType.Administrator ? () => GetAvailablePosts() : () => GetAllPosts()),
        queryKey: ['getAvailablePosts'],
        enabled: user != null
    })

    useEffect(() => {
        if (data === undefined) return;
        setPostings(data);

    }, [data])

    if (data && data.length === 0)
        return (<EmptyPostingsCard />);

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {postings?.map((post) => {
                return <PostingCard key={post.id} post={post} setPostings={setPostings} />;
            })}
        </>
    );
}

