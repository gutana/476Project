import { useQuery } from "@tanstack/react-query";
import { GetPostsByUser, GetTakenPosts } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyPostingsCard } from "../../components/EmptyPostingsCard";

export default function ViewMyPostingsPage() {
    const { data, isLoading, isError } = useQuery({
        queryFn: () => GetTakenPosts(),
        queryKey: ['getTakenPosts']
    })

    if (!isLoading && data?.length === 0)
        return <EmptyPostingsCard />;

    return (
        <>
            {isLoading && <LoadingSpinner />}
            {data?.map((post) => {
                return <PostingCard post={post} key={post.id} />;
            })}
        </>
    );
}

