import { Spinner, Stack } from "react-bootstrap"

export const LoadingSpinner = () => {
    return (
        <Stack direction="vertical" className="mt-5">
            <div className="d-flex justify-content-center margin-top-20px mt-5">
                <Spinner />
            </div>
        </Stack>
    )
}