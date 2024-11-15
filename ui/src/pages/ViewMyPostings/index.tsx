import { useQuery } from "@tanstack/react-query";
import { GetPostsByUser, GetTakenPosts } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyPostingsCard } from "../../components/EmptyPostingsCard";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/Time";
import { Post } from "../../models/postings";

export default function ViewMyPostingsPage() {
  const [postings, setPostings] = useState<Post[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => GetTakenPosts(),
    queryKey: ["getTakenPosts"],
  });

  useEffect(() => {
    if (data !== undefined) {
      setPostings(data);
    }
  }, [data]);

  if (!isLoading && data?.length === 0) return <EmptyPostingsCard />;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {postings?.map((post) => {
        return (
          <PostingCard post={post} key={post.id} setPostings={setPostings} />
        );
      })}
    </>
  );
}
