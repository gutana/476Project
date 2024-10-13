import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { User, UserType } from '../../../models/user';
import { formatPhoneNumber } from '../../../components/PhoneNumberFormat';

interface Props {
    Account: User
    ApproveUser: Function
}

export default function AccountCard({ Account, ApproveUser }: Props) {
    const capitalizeFirst = (value: string) => {
        return value.slice(0, 1).toUpperCase() + value.slice(1);
    }
    
    const userTypeToPosition = (userType: UserType) => {
        switch (userType) {
            case UserType.Administrator:
                return "Administrator"
            case UserType.Requestor:
                return "Teacher"            
            case UserType.Teacher:
                return "Substitute"
            default:
                return "";
        }
    }
    
    return (
        <Card className="w-75 m-auto my-3 bg-light">
            <Card.Body>
                <Card.Title>{capitalizeFirst(Account.firstName)} {capitalizeFirst(Account.lastName)}</Card.Title>
                    <Card.Text as={"div"}>
                        <div>Email: {Account.email}</div>
                        <div>Phone Number: {formatPhoneNumber(Account.phoneNumber)}</div>
                        <div>Region: {Account.region}</div>
                        <div>Position: {userTypeToPosition(Account.userType)}</div>
                    </Card.Text>
                <Button className='float-end' onClick={() => ApproveUser(Account.id, false)} variant="danger">Deny</Button>
                <Button className='me-2 float-end' onClick={() => ApproveUser(Account.id, true)} variant="primary">Approve</Button>
            </Card.Body>
        </Card>
    );
}