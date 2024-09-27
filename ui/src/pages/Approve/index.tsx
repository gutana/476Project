import { useMutation, useQuery } from "@tanstack/react-query";
import { accountQuery } from "../../api/queries/accountQueries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/UserWrapper";
import { User, UserType } from "../../models/user";
import { AccountApprovalMutation } from "../../api/mutations/accountMutations";
import AccountCard from "./components/AccountCard";
import Toasts from "../../components/Toasts";

export default function Approve() {
    const user = useContext(UserContext);
    const [accounts, setAccounts] = useState<User[] | undefined>([]);
    const [show, setShow] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("Success");
    const [variant, setVariant] = useState<string>("success");
    const [message, setMessage] = useState<string>("Testing");
    
    const { data, error, isLoading, isError } = useQuery({
        queryFn: () => accountQuery(),
        queryKey: ['accountquery']
    })

    const approvalMutation = useMutation({
        mutationFn: AccountApprovalMutation,
        onSuccess: (data, variables, context) => {
            const cause = variables.Approved ? "accepted!" : "deleted!"
            removeAccount(variables.Id, cause);
        },
        onError: (data, variables, context) => {
            console.log("Data: ", data, "Variables: ", variables, "Context: ", context);
            approvalMutation.reset();
        }
    })

    useEffect(() => {
        if (isLoading) return;
        setAccounts(data)
    }, [isLoading, data])

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    if (user && user.userType !== UserType.Administrator) {
        window.location.href = "/";
    }

    const removeAccount = (id: string, cause: string) => {
        setAccounts(accounts => accounts?.filter((acc) => acc.id !== id));
        setTitle("Success");
        setVariant("success");
        setMessage("The account has been " + cause);
        setShow(true);
    }

    const handleApproval = (id: string, value: boolean) => {
        let req = {
            Approved: value,
            Id: id
        }

        approvalMutation.mutate(req);
    } 

    return (
        <>
            <Toasts title={title} show={show} setShow={setShow} variant={variant} message={message} />
            {user?.userType === UserType.Administrator && 
                <div>
                    <h1 className="m-3">Requested Account(s)</h1>
                    {accounts && accounts.length > 0 ? accounts.map((val, _) => {
                        return (
                            <AccountCard key={val.id} Account={val} ApproveUser={handleApproval} />
                        )
                    }) : <h3 className="m-3"><small className="text-muted">{isError ? `${error}` : "There are no pending account requests."}</small></h3>}
                </div>
            }
        </>
    )
}