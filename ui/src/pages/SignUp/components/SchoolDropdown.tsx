import { Form } from "react-bootstrap";
import { School } from "../../../models/school";
interface Props {
    schools: School[]
}

export const SchoolDropdown = ( { schools }: Props ) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>School</Form.Label>
      <Form.Select defaultValue="-1" required>
        <option value="-1" disabled>
          Select your school
        </option>
        { schools?.map((school) => {
            return <option value={ school.id }> { school.name } </option>
        })}
      </Form.Select>
    </Form.Group>
  );
};
