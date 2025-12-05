import { Request, Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, message: string, data?: any) => {
    res.status(statusCode).json({
        message,
        data,
    });
};

export const handleError = (res: Response, error: any) => {
    console.error(error);
    res.status(500).json({
        message: 'An unexpected error occurred.',
        error: error.message || error,
    });
};

export const validateRequestBody = (req: Request, requiredFields: string[]) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    return missingFields.length === 0 ? null : missingFields;
};