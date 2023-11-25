import axios, { AxiosError } from "axios";
import {
    processAxiosError,
    NotFoundError,
    ProcessedError,
    ServerError,
} from "../services/errorsHandling";

export enum RandomAnswer {
    YES = "yes",
    NO = "no",
    MAYBE = "maybe",
}

class RandomAnswerService {
    private readonly URL: string;

    constructor(url: string) {
        this.URL = url;
    }

    private handleError(error: ProcessedError): void {
        switch (error.errorType) {
            case "ServerError":
                throw error.error as ServerError;
            case "NotFoundError":
                throw error.error as NotFoundError;
        }
    }

    async getRandomAnswer() {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await axios.get(this.URL);

            return result.data.answer;
        } catch (error) {
            const processedError = processAxiosError(error as AxiosError);
            this.handleError(processedError);
        }
    }

    async checkHealth() {
        try {
            const result = await axios.head(this.URL);

            return result.status;
        } catch (error) {
            const processedError = processAxiosError(error as AxiosError);
            throw processedError;
        }
    }
}

export default RandomAnswerService;
