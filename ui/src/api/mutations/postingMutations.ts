export interface PostingRequest {
  Title: string;
  Description: string;
}

export async function PostingMutation(postRequest: PostingRequest) {
  const response = await fetch("https://localhost:7287/posting/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      Title: postRequest.Title,
      Description: postRequest.Description,
    }),
  });

  if (response.status === 200) {
    return true;
  } else {
    console.log("Error creating post...");
    console.log(response.body);
    throw new Error();
  }
}
