import { AuthedFetch } from "../../utils/AuthedFetch";
import { Endpoints } from "../../utils/ApiURLs";
import { Grade, PrimarySchoolSubject, SecondarySchoolSubject } from "../../models/postings";

export interface AccountApprovalData {
    Approved: boolean
    Id: string
}

export async function AccountApprovalMutation(data: AccountApprovalData) {
    const response = await AuthedFetch('POST', Endpoints.ADMIN.APPROVE_USER, JSON.stringify(data));

    if (response.status === 200) {
        return true;
    } else {
        const text = await response.text();
        throw new Error(JSON.parse(text).detail);
    }
}

export interface AddCourseToProfileData {
    grades: Grade[],
    primarySchoolSubject?: PrimarySchoolSubject,
    secondarySchoolSubject?: SecondarySchoolSubject,
    startTime: string,
    endTime: string,
    information: string | null
}

export async function AddCourseToProfileMutation(data: AddCourseToProfileData) {
    const response = await AuthedFetch('POST', Endpoints.ACCOUNT.ADD_COURSE_TO_PROFILE, JSON.stringify(data));

    if (response.status === 200)
        return true;
    else {
        const text = await response.json();
        throw new Error(JSON.parse(text).detail);
    }
}

export async function DeleteCourseMutation(courseId: string) {
    const response = await AuthedFetch('GET', Endpoints.ACCOUNT.DELETE_COURSE + `?courseId=` + courseId)

    if (response.status === 200)
        return true;
    else {
        const text = await response.json();
        throw new Error(JSON.parse(text).detail);
    }
}