export interface ApprovalResponse {
    Approved: boolean
    Id: string
}

export async function AccountApprovalMutation(data: ApprovalResponse) {
    const response = await fetch('https://localhost:7287/admin/approveUser', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
    });

    if (response.status === 200) {
        return true;
    }
    else {
        console.log("Error posting news...");
        console.log(response.body);
        throw new Error();
    }
}