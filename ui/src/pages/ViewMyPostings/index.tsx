import { useQuery } from "@tanstack/react-query";
import { GetPostsByUser, GetTakenPosts } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyPostingsCard } from "../../components/EmptyPostingsCard";
import { useContext, useEffect, useState } from "react";
import { formatDate } from "../../utils/Time";
import { Post } from "../../models/postings";
import { UserContext } from "../../components/UserWrapper";
import { UserType } from "../../models/user";

export default function ViewMyPostingsPage() {
  const [user] = useContext(UserContext);

  const [postings, setPostings] = useState<Post[]>([]);
  
  const { data, isLoading, isError } = useQuery({
    queryFn: () => GetTakenPosts(),
    queryKey: ["getTakenPosts"],
  });

  const { data: teacherData, isLoading : teacherIsLoading, isError : teacherIsError } = useQuery({
    queryFn: () => GetPostsByUser(),
    queryKey: ["getPostsByUser1"],
    enabled: user?.userType === UserType.Teacher,
  })
  
  useEffect(() => {
    if (data !== undefined) {
      setPostings(data);
    }
  }, [data]);
  
  useEffect(() => {
    if (teacherData !== undefined) {
      console.log(teacherData);
      setPostings(previous => [...teacherData, ...previous]);
    }
  }, [teacherData]);

  if ((!isLoading && data?.length === 0) && (!teacherIsLoading && teacherData?.length === 0)) return <EmptyPostingsCard />;

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
