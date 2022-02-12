import { DocumentService } from './rest.app';

export const getAllDocuments = (skip, extraQuery = {}) =>
    DocumentService.find({
        query: {
            $skip: skip,
            $limit: 10,
            ...extraQuery,
        },
    });
