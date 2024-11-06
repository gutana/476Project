import { useContext } from "react";
import { UserContext } from "../../components/UserWrapper";
import { NewsCard } from "./components/NewsCard";
import { useQuery } from "@tanstack/react-query";
import { LatestNewsQuery } from "../../api/queries/newsQueries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Card } from "react-bootstrap";

export default function Home() {
    const user = useContext(UserContext);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => LatestNewsQuery(),
        queryKey: ['latestnewsquery']
    })

    return (
        <>
            <h3>{user && "Welcome, " + user?.firstName}</h3>

            <Card style={{ marginTop: "10px", padding: '10px', border: '1px solid lightgrey', borderRadius: '10px' }}>
                <h4 style={{ textAlign: 'center' }}>Latest News</h4>
                {isLoading && <LoadingSpinner />}

                {data && data.map(news => {
                    return <NewsCard key={news.id} Title={news.title} Content={news.content} Date={news.postDate} />
                })}
            </Card>
        </>
    )
}