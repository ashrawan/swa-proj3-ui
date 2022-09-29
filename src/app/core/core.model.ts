export interface GenericResponse<T> {
    response: T;
    messageCode: string;
}

export interface JobDTO {
    jobId: string;
    title: string;
    description: string;
}