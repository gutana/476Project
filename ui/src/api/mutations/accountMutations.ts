import { AuthedFetch } from "../../utils/AuthedFetch";
import { Endpoints } from "../../utils/ApiURLs";

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