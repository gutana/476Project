import { Spinner } from "react-bootstrap"

export const LoadingSpinner = () => {
    return (
        <div className="d-flex justify-content-center mt-5">
            <div className="d-flex justify-content-center mt-5">
                <Spinner />
            </div>
        </div>
    )
}