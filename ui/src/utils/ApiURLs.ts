export const baseServerURL = "https://localhost:7287";
export const baseWebsiteURL = "http://localhost:3000";


export const Endpoints = {
    LOG_IN: '/login',
    REFRESH: '/refresh',

    ACCOUNT: {
        ADD_COURSE_TO_PROFILE: '/account/addCourseToProfile',
        DELETE_COURSE: '/account/deleteCourse',
        EDIT_INFO: '/account/editInfo',
        GET_USER: '/account/getUser',
        REGISTER: '/account/register'
    },
    ADMIN: {
        APPROVE_USER: '/admin/approveUser',
        GET_UNAPPROVED_USERS: '/admin/getUnapprovedUsers'
    },
    NEWS: {
        CREATE: '/news/create',
        GET_LATEST: '/news/getLatest'
    },
    POST: {
        ACCEPT_POSTING: '/post/accept',
        ADD_POSTING: '/post/add',
        CANCEL_POSTING: '/post/cancel',
        GET_ALL: '/post/getAll',
        GET_APPROVED_SUBS: '/post/getApprovedSubs',
        GET_AVAILABLE: '/post/getAvailable',
        GET_MY_POSTINGS: '/post/getMyPostings'
    },
    SCHOOL: {
        ADD_SCHOOL: '/school/add',
        GET_ALL: '/school/getAllSchools',
        GET_BY_REGION: '/school/getByRegion'
    }
}