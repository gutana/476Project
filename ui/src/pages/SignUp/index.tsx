import { useQuery } from "@tanstack/react-query"
import { Region, RegistrationRequest, SignUpQuery, UserType } from "../../api/signupQuery";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function SignUp() {
  const navigate = useNavigate();
  const [registrationFormData, setRegistrationFormData] = useState<RegistrationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ['signup1234'],
    queryFn: () => {
      if (registrationFormData != null) {
        var result = SignUpQuery(registrationFormData)
        setRegistrationFormData(null)
        return result
      }
    },
    enabled: () => registrationFormData != null
  })

  const handleSubmit = (event: any) => {
    event.preventDefault();

    setRegistrationFormData({
      FirstName: event.target[0].value,
      LastName: event.target[1].value,
      Email: event.target[2].value,
      Password: event.target[3].value,
      Region: Region.Regina, // TODO 
      UserType: UserType.Teacher // TODO
    })
  }

  if (data != undefined && data === "success" && showModal === false) {
    setShowModal(true);
  }

  const handleClose = () => {
    navigate("/");
  }

  return (
    <>
      <Navbar />

      <div className="container-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="firstName" className="form-control" id="firstName" required />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="lastName" className="form-control" id="lastName" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" required />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" required />
          </div>
          <select className="form-select mb-3" aria-label="Region" required >
            <option selected disabled>Select your region</option>
            <option value="1">Regina</option>
            <option value="2">Saskatoon</option>
          </select>
          <select className="form-select mb-3" aria-label="AccountType" required >
            <option selected disabled>Select account type</option>
            <option value="1">Teacher</option>
            <option value="2">Substitute</option>
            <option value="3">Administrator</option>
          </select>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  )
}