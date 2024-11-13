import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/UserWrapper";
import { useQuery } from "@tanstack/react-query";
import { GetAvailablePosts, GetAllPosts } from "../../api/queries/postQueries";
import { PostingCard } from "../../components/PostingCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { UserType } from "../../models/user";
import { Post } from "../../models/postings";
import { EmptyPostingsCard } from "../../components/EmptyPostingsCard";
import { GetAllSchools } from "../../api/queries/schoolQueries";
import { MultipleSelection, TypeaheadValue } from "../AddPost";
import { allGrades, primarySubjects, secondarySubjects } from "../../utils/consts";
import { Button, Col, Container, Row } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { translateToSchoolTypeahead } from "../../components/stringToDataType";

// View ALL postings page if administrator
export default function ViewPostingsPage() {
    const [user] = useContext(UserContext);
    const [allPostings, setAllPostings] = useState<Post[]>([]);
    const [filteredPostings, setFilteredPostings] = useState<Post[]>([]);
    const [schools, setSchools] = useState<TypeaheadValue[]>([]);

    const [school, setSchool] = useState<TypeaheadValue[]>([]);
    const [region, setRegion] = useState<string>("-1");
    const [grades, setGrades] = useState<TypeaheadValue[]>([]);
    const [primary, setPrimary] = useState<TypeaheadValue[]>([]);
    const [secondary, setSecondary] = useState<TypeaheadValue[]>([]);

    if (!user) {
        window.location.href = "/";
    }

    const result = useQuery({
        queryFn: () => GetAllSchools(),
        queryKey: ['getAllSchools']
    })

    const { data, isLoading, isError } = useQuery({
        queryFn: (user?.userType !== UserType.Administrator ? () => GetAvailablePosts() : () => GetAllPosts()),
        queryKey: ['getAvailablePosts'],
        enabled: user !== null
    })

    useEffect(() => {
        if (data !== undefined) {
            setAllPostings(data);
            setFilteredPostings(data);
        }
    }, [data])

    useEffect(() => {
        if (result.data !== undefined) {
            setSchools(translateToSchoolTypeahead(result.data));
        }
    }, [result.data])

    const updatePostings = (id: string) => {
        const filtered = allPostings.filter(post => post.id !== id);
        setAllPostings(filtered);
        filterPosts(undefined, filtered);
    }

    const checkSchool = (id: string, schools: TypeaheadValue[]) => {
        if (schools.length === 0) return true;
        return schools.some(val => val.value === id);
    }

    const checkMatch = (val1: any, val2: any, lists=false) => {
        if (!val2 || val2.length === 0 || val2 === "-1") return true;
        if (lists) {
            for (let i = 0; i < val2.length; i++) {
                const item = val2[i];
                if (!val1 || !val1.includes(item.match ? item.match : item.name)) {
                    return false;
                }
            }
            return true;
        }
        
        return val1 === val2;
    }

    const filterPosts = (e?: any, changedPostings?: Post[]) => {
        if (e) e.preventDefault();
        if (!allPostings) return;
        let matched = [];

        if (changedPostings === undefined) {
            matched = allPostings.filter(post => checkSchool(post.school.id, school) && checkMatch(post.school.region, region) && checkMatch(post.grades, grades, true)
            && checkMatch(post.primarySchoolSubjects, primary, true) && checkMatch(post.secondarySchoolSubjects, secondary, true));
        } else {
            matched = changedPostings.filter(post => checkSchool(post.school.id, school) && checkMatch(post.school.region, region) && checkMatch(post.grades, grades, true)
            && checkMatch(post.primarySchoolSubjects, primary, true) && checkMatch(post.secondarySchoolSubjects, secondary, true));
        }

        setFilteredPostings(matched);
    }

    if (data && data.length === 0)
        return (<EmptyPostingsCard />);

    if (isLoading || result.isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    return (
        <>
            <Form onSubmit={filterPosts}>
                <Container>
                    <Row>
                        <Col><MultipleSelection values={schools} title="School(s)" placeholder="Search schools..." selection={school} setSelection={setSchool} /></Col>
                        <Col><MultipleSelection values={allGrades} title="Grade(s)" placeholder="Search grades..." selection={grades} setSelection={setGrades} /></Col>
                    </Row>
                    <Row>
                        <Col><MultipleSelection values={primarySubjects} title="Primary School Subject(s)" placeholder="Search primary subjects..." selection={primary} setSelection={setPrimary} /></Col>
                        <Col><MultipleSelection values={secondarySubjects} title="Secondary School Subject(s)" placeholder="Search secondary subjects..." selection={secondary} setSelection={setSecondary} /></Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Region</Form.Label>
                                <Form.Select onChange={(e) => setRegion(e.target.value)} value={region} required>
                                    <option value="-1">Select region...</option>
                                    <option value="Regina">Regina</option>
                                    <option value="Saskatoon">Saskatoon</option>
                                </Form.Select>
                        </Form.Group>
                        </Col>
                        <Col>
                            <Button style={{width: "100%", height: "100%"}} variant="primary" type="submit">
                                Filter
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Form>
            {filteredPostings?.map((post) => {
                return <PostingCard key={post.id} post={post} updatePostings={updatePostings} />;
            })}
        </>
    );
}

