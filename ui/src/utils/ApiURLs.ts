export const baseServerURL = "https://localhost:7287";
export const baseWebsiteURL = "http://localhost:3000";


export const Endpoints = {
    LOG_IN: '/login',
    REFRESH: '/refresh',

    ACCOUNT: {
        EDIT_INFO: '/account/editInfo',
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
        ADD_POSTING: '/post/addPosting',
        GET_ALL: '/post/getAll',
        GET_AVAILABLE: '/post/getAvailable',
        GET_BY_USER: '/post/getByUser',
        GET_TAKEN_BY_USER: '/post/getTakenByUser',
    },
    SCHOOL: {
        ADD_SCHOOL: '/school/add'
    }
}