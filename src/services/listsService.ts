import { Post } from '@/types/post';
import { apiClient, handleApiError } from './apiClient';

export const getLists = async (): Promise<{}> => {
    try {
        const response = await apiClient.get<{}>('/book-lists');
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    return {}
    ;
};

export const getListById = async (listId: string): Promise<{}> => {
    try {
        const response = await apiClient.get<{}>(`/book-lists/${listId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    return {}
};

// export const createPost = async (formData: FormData): Promise<Post> => {
//     try {
//         const response = await apiClient.post<Post>('/posts', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         handleApiError(error);
//     }
//     return {} as Post;
// };

// export const updatePost = async (id: string, postData: Partial<Post>): Promise<Post> => {
//     try {
//         const response = await apiClient.put<Post>(`/posts/${id}`, postData);
//         return response.data;
//     } catch (error) {
//         handleApiError(error);
//     }
//     return {} as Post;
// };
