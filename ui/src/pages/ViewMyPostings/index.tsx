import { useContext, useState } from "react";
import { UserContext} from "../../components/UserWrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetAvailablePosts, GetAllPosts, GetPostsByUser } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Alert, Button, Form, Modal, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../models/user";

export default function MyPostings() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryFn: (() => GetPostsByUser()),
    queryKey: ['getPostsByUser']
  })

  return (
    <>
      { isLoading && <LoadingSpinner />}
      {data?.map((post) => {
        return <PostingCard post={post} key={post.id}/>;
      })}
    </>
  );
}

