import {
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { UserContext } from "../../components/UserWrapper";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Substitute, User, UserType } from "../../models/user";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toasts from "../../components/Toasts";
import {
  AbsenceType,
  AMPM,
  Grade,
  MapAbsenceTypeStringToAbsenceType,
  MapSchoolSubjectToString
} from "../../models/postings";
import { subQuery } from "../../api/queries/subQueries";
import { AddPostingMutation } from "../../api/mutations/postMutations";
import { School } from "../../models/schools";
import { Typeahead } from "react-bootstrap-typeahead";
import { translateCourses, translateGrade } from "../../components/stringToDataType";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {
  allGrades
} from "../../utils/consts";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { GetAllSchools } from "../../api/queries/schoolQueries";
import { Link } from "react-router-dom";
import { AlertIcon } from "../../components/Icons";
import { ButtonGroup, Container, Stack, ToggleButton } from "react-bootstrap";
import { addDays, formatTime } from "../../utils/Time";
import { PrimarySchoolCourse, SecondarySchoolCourse } from "../../models/courseSchedule";

export interface TypeaheadValue {
    name: string,
    match?: string,
    value: string
}

interface Props {
  selection: TypeaheadValue[];
  setSelection: Dispatch<SetStateAction<TypeaheadValue[]>>;
  values: any[];
  title: string;
  placeholder: string;
}

export function MultipleSelection({
  values,
  title,
  placeholder,
  selection,
  setSelection,
}: Props) {
  const setSelections = (vals: any) => {
    setSelection(vals);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{title}</Form.Label>
      <Typeahead
        id={placeholder}
        labelKey="name"
        multiple
        onChange={setSelections}
        options={values}
        placeholder={placeholder}
        selected={selection}
      />
    </Form.Group>
  );
}

export default function AddPostPage() {
  const [user] = useContext(UserContext);

  const today = new Date();
  today.setHours(0);

  const [radioDayDuration, setRadioDayDuration] = useState("1");
  const [radioPeriod, setRadioPeriod] = useState("1");

  const dayDurationRadios = [
    { name: "Half-Day", value: "1" },
    { name: "Full-Day", value: "2" },
    { name: "Multiple Days", value: "3" },
  ];

  const periodRadios = [
    { name: "AM", value: "1" },
    { name: "PM", value: "2" },
  ];

  const [allCourses, setAllCourses] = useState<TypeaheadValue[]>([]);
  const [courses, setCourses] = useState<TypeaheadValue[]>([]);

  const [desc, setDesc] = useState("");
  const [requestedSub, setRequestedSub] = useState<any>([]);
  const [grades, setGrades] = useState<TypeaheadValue[]>([]);

  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [absenceType, setAbsenceType] = useState<AbsenceType>(AbsenceType.HalfDay)
  const [ampm, setAmpm] = useState<AMPM | null>("AM");

  const [variant, setVariant] = useState("success");
  const [title, setTitle] = useState("Success!");
  const [message, setMessage] = useState("");

  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [school, setSchool] = useState<School | undefined>(user?.school);
  const [selectedSchool, setSelectedSchool] = useState<any>([]);
  const [subs, setSubs] = useState<Substitute[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const [profileDataLoaded, setProfileDataLoaded] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => subQuery(),
    queryKey: ["getSubQuery"],
  });

  const result = useQuery({
    queryFn: () => GetAllSchools(),
    queryKey: ["getAllSchools"],
    enabled: user !== null && user.userType === UserType.Administrator,
  });

  const capitalizeFirst = (value: string) => {
    return value.slice(0, 1).toUpperCase() + value.slice(1);
  };

  // Pre-populate the grades with info from the user object
  useEffect(() => {
    if (user === null || user.userType === UserType.Administrator) return;
    let grades: Grade[] = []

    for (let i = 0; i < user.primarySchoolCourses.length; i++) {
      grades = [...grades, ...user.primarySchoolCourses[i].grades];
    }

    for (let i = 0; i < user.secondarySchoolCourses.length; i++) {
        grades = [...grades, ...user.secondarySchoolCourses[i].grades]
    }
    const existingGrades = grades.map((grade) => {
        let gra = allGrades.find(gr => {
            return (gr.name == grade as unknown as string) ||
                (gr.name === "Pre-K" && grade as unknown as string == "PreK"); // Needed because Pre-K !== PreK

        })
        if (gra === undefined) throw `Error: Unable to load existing grades: Grade: ${grade}.`;
        return { name: gra.name, value: gra.value };;
    });
    const uniqueGrades = Array.from(new Map(existingGrades.map(item => [item.name, item])).values())
    setGrades(uniqueGrades.sort((a, b) => parseInt(a.value) - parseInt(b.value)));
    
    }, [user])

  // Pre-populate the subjects with info from the user object
  useEffect(() => {
    if (
      !user ||
      user.school === undefined ||
      user.userType === UserType.Administrator
    ) return;

    let courses: PrimarySchoolCourse[] | SecondarySchoolCourse[] = [];

    if (user.primarySchoolCourses.length > 0) {
      courses = user.primarySchoolCourses;
    } else {
      courses = user.secondarySchoolCourses;
    }

    let typeaheadCourses: TypeaheadValue[] = [];
    for (let i = 0; i < courses.length; i++) {
        let course = courses[i];                
        let val = {
          name: `${MapSchoolSubjectToString(course.subject.toString())} - ${formatTime(course.startTime)} to ${formatTime(course.endTime)}`,
          value: course.id
        };

        typeaheadCourses.push(val);
    }

    setAllCourses(typeaheadCourses);
    setCourses(typeaheadCourses);
    setProfileDataLoaded(true);
  }, [user]);

  const translateToSub = (users: User[]): Substitute[] => {
    let subs: Substitute[] = [];
    users.forEach((user) => {
      let a: Substitute = {
        id: user.id,
        name:
          capitalizeFirst(user.firstName) +
          " " +
          capitalizeFirst(user.lastName),
        region: user.region,
      };

      subs.push(a);
    });

    return subs;
  };

  useEffect(() => {
    if (result.data === undefined) return;
    setAllSchools(result.data);
  }, [result.data]);

  useEffect(() => {
    if (data === undefined) return;

    setSubs(translateToSub(data ?? []));
  }, [data]);

  useEffect(() => {
    if (error != null) handleQueryErrors(error);
  }, [error]);

  const postMutation = useMutation({
    mutationFn: AddPostingMutation,
    onSuccess: (data, variables, context) => {
        notifyUser(data, true);
    },
    onError: (data, variables, context) => {
        notifyUser(data.toString(), false);
        console.error("Data: ", data, "Variables: ", variables, "Context: ", context);
        postMutation.reset();
    }
})


  const notifyUser = (data: string, success: boolean) => {
    if (success) {
      setVariant("success");
      setTitle("Success!");
    } else {
      setVariant("danger");
      setTitle("Error");
    }

    setMessage(data);
    setShow(true);
  };

  const handleQueryErrors = (e: Error) => {
    let reason = "Unknown Error Occured!";
    reason = e.message ?? "Unknown Error Occured!";
    notifyUser(reason, false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    let reqSub: Substitute | undefined = requestedSub[0];

    if (school) {
      let sType = school.schoolType.toString();
      if (sType === "Primary" && courses.length === 0) {
        setErrorMessage("Set a Primary School Subject.");
        return;
      } else if (sType === "Secondary" && courses.length === 0) {
        setErrorMessage("Set a Secondary School Subject.");
        return;
      }
    } else {
      setErrorMessage("Choose a school.");
      return;
    }

    let sType = school.schoolType.toString();
    let grade: Grade[] | number = translateGrade(grades, sType === "Primary");

    if (grade === -1) {
      setErrorMessage(`Select a ${sType} Grade.`);
      return;
    }
    if (grade === -2) {
      setErrorMessage("Invalid Primary Grade.");
      return;
    }
    if (grade === -3) {
      setErrorMessage("Invalid Secondary Grade.");
      return;
    }

    if (typeof grade === "number") {
      setErrorMessage("Invalid grade.");
      return;
    }
    
    let realCourses: string[] = translateCourses(courses);

    console.log({
      schoolId: school.id,
      requestedSub: reqSub ? reqSub.id : "",
      postDescription: desc,
      private: requestedSub.length !== 0,
      grades: grade,
      primarySchoolSubjects: sType === "Primary" ? realCourses : null,
      secondarySchoolSubjects: sType === "Secondary" ? realCourses : null,
      startDateOfAbsence: startDate,
      endDateOfAbsence: endDate,
      absenceType: absenceType,
      ampm: ampm,
    });

    if (startDate === undefined) {
      setErrorMessage("You must select a date.");
      return;
    }

    postMutation.mutate({
        requestedSub: reqSub ? reqSub.id : "",
        schoolId: school.id,
        postDescription: desc,
        private: requestedSub.length !== 0,
        grades: grade,
        startDateOfAbsence: startDate,
        endDateOfAbsence: endDate,
        absenceType: absenceType,
        amPm: ampm,
        primarySchoolSubjects: sType === "Primary" ? realCourses : null,
        secondarySchoolSubjects: sType === "Secondary" ? realCourses : null
    })
  }

  const changeSub = (e: any) => {
    setRequestedSub(e);
  };

  const changeSchool = (e: any) => {
    setSelectedSchool(e);
    setSchool(e[0]);
  };

  const changeStartDate = (e: any) => {
    setStartDate(new Date(e.target.value));
  };

  const changeEndDate = (e: any) => {
    setEndDate(new Date(e.target.value));
  };

  if (isLoading || postMutation.isPending) {
    return <LoadingSpinner />;
  }

  if (!user || (user && user.userType === UserType.Substitute)) {
    window.location.href = "/";
  }

  const showProfileInfoText: boolean =
    profileDataLoaded &&
    (allCourses.length === 0 ||
    grades.length === 0)

  return (
    <>
      <Toasts
        show={show}
        setShow={setShow}
        variant={variant}
        title={title}
        message={message}
      />
      <div className="p-3">
        <h3 className="pb-2">
          {user?.school
            ? `Add New Posting for ${user.school.schoolName}`
            : `Add New Posting`}
        </h3>
        {showProfileInfoText && (
          <Alert variant="warning">
            <Container style={{ display: "flex", flexDirection: "row" }}>
              <AlertIcon size="24" />
              <div style={{ marginLeft: "12px" }}>
                Your grades and subjects can be set on the{" "}
                <Link to="/edit">Edit Profile</Link> page.
              </div>
            </Container>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {user?.userType === UserType.Administrator && allSchools && (
            <Form.Group className="mb-3" controlId="school">
              <Form.Label>School</Form.Label>
              <Typeahead
                labelKey="schoolName"
                selected={selectedSchool}
                options={allSchools.filter(
                  (val) => val.region === user?.region
                )}
                id="0"
                placeholder="Search schools..."
                onChange={changeSchool}
              />
            </Form.Group>
          )}
          {school && (
            <MultipleSelection
              values={
                school.schoolType.toString() === "Primary"
                  ? allGrades.slice(0, 10)
                  : allGrades.slice(10)
              }
              title="Grade(s)"
              placeholder="Search grades..."
              selection={grades}
              setSelection={setGrades}
            />
          )}
          {school && school.schoolType.toString() === "Primary" && (
            <MultipleSelection
              values={allCourses}
              title="Primary School Subject(s)"
              placeholder="Search primary subjects..."
              selection={courses}
              setSelection={setCourses}
            />
          )}
          {school && school.schoolType.toString() === "Secondary" && (
            <MultipleSelection
              values={allCourses}
              title="Secondary School Subject(s)"
              placeholder="Search secondary subjects..."
              selection={courses}
              setSelection={setCourses}
            />
          )}

          <div style={{ display: "flex" }}>
            <ButtonGroup className="mt-2 mb-2 mx-auto" style={{ width: "60%" }}>
              {dayDurationRadios.map((radio, i) => {
                return (
                  <ToggleButton
                    key={`durationRadio-${i}`}
                    id={`durationRadio-${i}`}
                    type="radio"
                    value={radio.value}
                    checked={radioDayDuration === radio.value}
                    onChange={(e) => {
                      setRadioDayDuration(e.currentTarget.value)
                      setAbsenceType(MapAbsenceTypeStringToAbsenceType(radio.name))
                    }}
                  >
                    {radio.name}
                  </ToggleButton>
                );
              })}
            </ButtonGroup>
          </div>

          {radioDayDuration === "1" && (
            <>
              <Form.Label>Date</Form.Label>
              <Stack direction="horizontal" gap={3}>
                <div style={{ width: "80%" }}>
                  <Form.Group className="mb-3" controlId="date">
                    <Form.Control
                      type="Date"
                      defaultValue={today.toISOString().split("T")[0]}
                      min={today.toISOString().split("T")[0]}
                      onChange={(e) => {
                        changeStartDate(e);
                        changeEndDate(e);
                      }}
                    />
                  </Form.Group>
                </div>
                <div style={{ width: "20%" }}>
                  <ButtonGroup className="mb-3" style={{ width: "100%" }}>
                    {periodRadios.map((radio, i) => {
                      return (
                        <ToggleButton
                          key={`periodRadio-${i}`}
                          id={`periodRadio-${i}`}
                          type="radio"
                          value={radio.value}
                          checked={radioPeriod === radio.value}
                          onChange={(e) => {
                            setRadioPeriod(e.currentTarget.value);
                            setAmpm(radio.name as AMPM);
                          }}
                        >
                          {radio.name}
                        </ToggleButton>
                      );
                    })}
                  </ButtonGroup>
                </div>
              </Stack>
            </>
          )}

          {radioDayDuration === "2" && (
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="Date"
                defaultValue={today.toISOString().split("T")[0]}
                min={today.toISOString().split("T")[0]}
                onChange={(e) => {
                  changeStartDate(e);
                  changeEndDate(e);
                }}
              />
            </Form.Group>
          )}

          {radioDayDuration === "3" && (
            <Stack direction="horizontal" gap={3}>
              <div style={{ width: "50%" }}>
                <Form.Group className="mb-3" controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="Date"
                    defaultValue={today.toISOString().split("T")[0]}
                    onChange={changeStartDate}
                    min={today.toISOString().split("T")[0]}
                    max={
                      endDate === undefined
                        ? addDays(today, 13).toISOString().split("T")[0]
                        : endDate.toISOString().split("T")[0]
                    }
                  />
                </Form.Group>
              </div>
              <div style={{ width: "50%" }}>
                <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="Date"
                    defaultValue={addDays(today, 13).toISOString().split("T")[0]}
                    onChange={changeEndDate}
                    min={
                      startDate === undefined
                        ? today.toISOString().split("T")[0]
                        : startDate.toISOString().split("T")[0]
                    }
                    max={
                      startDate === undefined
                        ? addDays(today, 13).toISOString().split("T")[0]
                        : addDays(startDate, 13).toISOString().split("T")[0]
                    }
                  />
                </Form.Group>
              </div>
            </Stack>
          )}

          <Form.Group className="mb-3" controlId="substitute">
            <Form.Label>Request Substitute</Form.Label>
            <Typeahead
              labelKey="name"
              selected={requestedSub}
              options={subs}
              id="1"
              placeholder="Search substitutes..."
              onChange={changeSub}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Group>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Button variant="primary" disabled={isLoading} type="submit">
            {isLoading ? "Adding..." : "Add Posting"}
          </Button>
        </Form>
      </div>
    </>
  );
}
