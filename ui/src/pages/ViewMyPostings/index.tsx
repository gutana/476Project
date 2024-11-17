import { useQuery } from "@tanstack/react-query";
import { GetPostsByUser, GetTakenPosts } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyPostingsCard } from "../../components/EmptyPostingsCard";
import { useContext, useEffect, useState } from "react";
import { Post } from "../../models/postings";
import { UserContext } from "../../components/UserWrapper";
import { UserType } from "../../models/user";
import Toasts from "../../components/Toasts";

export default function ViewMyPostingsPage() {
  const [user] = useContext(UserContext);
  const [postings, setPostings] = useState<Post[]>([]);
  
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  
  const { data, isLoading, isError } = useQuery({
    queryFn: () => GetTakenPosts(),
    queryKey: ["getTakenPosts"],
  });

  const { data: teacherData, isLoading : teacherIsLoading, isError : teacherIsError } = useQuery({
    queryFn: () => GetPostsByUser(),
    queryKey: ["getPostsByUser1"],
    enabled: user?.userType === UserType.Teacher,
  })

  const showToast = (success: boolean, title: string, message: string) => {
    if (success) {
      setShow(true);
      setVariant("success");
      setTitle(title);
      setMessage(message);
    } else {
      setShow(true);
      setVariant("danger");
      setTitle(title);
      setMessage(message);
    }
  }
  
  useEffect(() => {
    if (data !== undefined) {
      setPostings(data);
    }
  }, [data]);
  
  useEffect(() => {
    if (teacherData !== undefined) {
      setPostings(previous => [...teacherData, ...previous]);
    }
  }, [teacherData]);

  const updatePostings = (id: string) => {
    const filtered = postings.filter(post => post.id !== id);
    setPostings(filtered);
}

  return (
    <>
      <Toasts
          show={show}
          setShow={setShow}
          variant={variant}
          title={title}
          message={message}
        />
      
      {(isLoading || teacherIsLoading) && <LoadingSpinner />}
      {(postings.length === 0 && !isLoading && !teacherIsLoading) && <EmptyPostingsCard />}
      
      {postings.map((post) => {
        return (
          <PostingCard toastMessage={showToast} post={post} key={post.id} setPostings={updatePostings} />
        );
      })}
    </>
  );
}
