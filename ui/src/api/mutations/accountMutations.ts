import { getRefresh } from "../../components/UserWrapper";
import { baseServerURL, repititionError } from "../../components/consts";

export interface ApprovalResponse {
    Approved: boolean
    Id: string
}

export async function AccountApprovalMutation(data: ApprovalResponse, retries=0): Promise<boolean> {
    const response = await fetch(baseServerURL + '/admin/approveUser', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
    });

    if (response.status === 200) {
        return true;
    } else if (response.status === 401) {
        const res = retries < 3 ? await getRefresh() : false;
        if (res) return await AccountApprovalMutation(data, retries + 1);
        throw repititionError;
    } else {
        console.log(response.status);
        console.log("Error posting news...");
        console.log(response.body);
        throw new Error();
    }
}