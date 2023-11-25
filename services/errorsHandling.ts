import { AxiosError } from "axios";

export class ServerError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ServerError";
        this.status = status;
    }
}

export class NotFoundError extends Error {
    status: number;
    code: string;

    constructor(status: number, code: string, message: string) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = "NotFoundError";
    }
}

export interface ProcessedError {
    errorType: string;
    error: Error;
}

// const serverError = new ServerError(500, "Internal Server Error");
// const notFoundError = new NotFoundError(404, "NOT_FOUND", "Resource not found");

export const processAxiosError = (error: AxiosError): ProcessedError => {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
        return {
            errorType: ServerError.name,
            error: new ServerError(
                axiosError.response.status,
                axiosError.message,
            ),
        };
    } else if (axiosError.code === "ENOTFOUND") {
        return {
            errorType: NotFoundError.name,
            error: new NotFoundError(
                404,
                axiosError.code,
                axiosError.cause?.message as string,
            ),
        };
    } else {
        return {
            errorType: "OtherError",
            error: error,
        };
    }
};
