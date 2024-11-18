import { useQuery } from "@tanstack/react-query";
import { GetMyPostings } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyPostingsCard } from "../../components/EmptyPostingsCard";
import { useContext, useEffect, useState } from "react";
import { Post } from "../../models/postings";
import { UserContext } from "../../components/UserWrapper";
import Toasts from "../../components/Toasts";
import { UserType } from "../../models/user";

export default function ViewMyPostingsPage() {
  const [user] = useContext(UserContext);
  if (user === null) {
    window.location.href = '/login';
  } else if (user.userType === UserType.Administrator) {
    window.location.href = '/';
  }
  
  const [postings, setPostings] = useState<Post[]>([]); 
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  
  const { data, isLoading, isError } = useQuery({
    queryFn: () => GetMyPostings(),
    queryKey: ["getMyPostings"],
  });

  const showToast = (success: boolean, title: string, message: string) => {
    setVariant(success ? "success" : "danger");
    setTitle(title);
    setMessage(message);
    setShow(true);
  }
  
  useEffect(() => {
    if (data !== undefined) {
      data.sort((a: Post, b: Post) => {
        return new Date(a.dateOfAbsence) > new Date(b.dateOfAbsence) ? 1 : -1;
      })
      setPostings(data);
    }
  }, [data]);

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
      
      {isLoading && <LoadingSpinner />}
      {postings.length === 0 && !isLoading && <EmptyPostingsCard />}
      
      {postings.map((post) => {
        return (
          <PostingCard toastMessage={showToast} post={post} key={post.id} setPostings={updatePostings} />
        );
      })}
    </>
  );
}
