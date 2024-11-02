import { useContext, useState } from "react";
import { UserContext} from "../../components/UserWrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetAvailablePosts, GetAllPosts } from "../../api/queries/postQueries";
import { PostingCard } from "./components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Alert, Button, Form, Modal, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../models/user";

export default function Postings() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryFn: (user?.userType != UserType.Administrator ? () => GetAvailablePosts() : () => GetAllPosts()),
    queryKey: ['getUserPosts123']
  })

   data?.forEach((post) => {
    console.log(post);
   });

  return (
    <>
      <Button variant="primary" onClick={() => navigate("addPost")}>
        Create Posting
      </Button>{" "}

      { isLoading && <LoadingSpinner />}
      {data?.map((post) => {
        return <PostingCard post={post}/>;
      })}
    </>
  );
}


// browsing : 
//        your a sub or teacher looking at available postings