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
import { allGrades, primarySubjects, regionsInList, secondarySubjects } from "../../utils/consts";
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
    const [schoolType, setSchoolType] = useState<string>("-1");
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
        if (result.data !== undefined && user) {
            const region = typeof user.region === "number" ? regionsInList[user.region] : user.region;
            const schools = user.userType !== UserType.Administrator ? result.data.filter(s => s.region.toString() === region) : result.data;
            setSchools(translateToSchoolTypeahead(schools));
        }
    }, [result.data, user])

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
                if (val1 && val1.includes(item.match ? item.match : item.name)) {
                    return true;
                }
            }
            return false;
        }
        
        return val1 === val2;
    }

    const filterPosts = (e?: any, changedPostings?: Post[]) => {
        if (e) e.preventDefault();
        if (!allPostings) return;
        let matched = [];

        if (changedPostings === undefined) {
            matched = allPostings.filter(post => checkSchool(post.school.id, school) && checkMatch(post.school.region, region) && checkMatch(post.grades, grades, true)
            && checkMatch(post.primarySchoolSubjects, primary, true) && checkMatch(post.secondarySchoolSubjects, secondary, true) && checkMatch(post.school.schoolType, schoolType));
        } else {
            matched = changedPostings.filter(post => checkSchool(post.school.id, school) && checkMatch(post.school.region, region) && checkMatch(post.grades, grades, true)
            && checkMatch(post.primarySchoolSubjects, primary, true) && checkMatch(post.secondarySchoolSubjects, secondary, true && checkMatch(post.school.schoolType, schoolType)));
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
                        {user?.userType === UserType.Administrator && <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Region</Form.Label>
                                <Form.Select onChange={(e) => setRegion(e.target.value)} value={region} required>
                                    <option value="-1">Select region...</option>
                                    <option value="Regina">Regina</option>
                                    <option value="Saskatoon">Saskatoon</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>}
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>School Type</Form.Label>
                                <Form.Select onChange={e => setSchoolType(e.target.value)} value={schoolType} required>
                                    <option value="-1">Select school type...</option>
                                    <option value="Primary">Primary</option>
                                    <option value="Secondary">Secondary</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {user?.userType !== UserType.Administrator && <Col>
                            <Button className="w-100 h-100" variant="primary" type="submit">
                                Filter
                            </Button>
                        </Col>}
                    </Row>
                    {user?.userType === UserType.Administrator && <Row>
                            <Col>
                                <Button className="w-100" variant="primary" type="submit">
                                    Filter
                                </Button>
                            </Col>
                        </Row>}
                </Container>
            </Form>
            {filteredPostings?.map((post) => {
                return <PostingCard key={post.id} post={post} updatePostings={updatePostings} />;
            })}
            {filteredPostings.length === 0 && <h3 className="m-3">
                    <small className="text-muted">
                        There are no matches to your filters.
                    </small>
                </h3>}
        </>
    );
}

