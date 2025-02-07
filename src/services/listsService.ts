import { apiClient, handleApiError } from './apiClient';

interface CreateListData {
  name: string;
  description: string;
  genre: string;
  isPublic: boolean;
  image?: File;
}

interface UpdateListData {
  name?: string;
  description?: string;
  genre?: string;
  isPublic?: boolean;
  image?: File | null;
}

export const updateList = async (id: string, data: UpdateListData): Promise<{}> => {
  try {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.genre) formData.append("genre", data.genre);
    if (data.isPublic !== undefined) {
      formData.append("visibility", data.isPublic ? "public" : "private");
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await apiClient.put<{}>(`/book-lists/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
    return {};
  }
};



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


export const createList = async (data: CreateListData): Promise<{}> => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("genre", data.genre);
      formData.append("visibility", data.isPublic ? "public" : "private");
  
      if (data.image) {
        formData.append("image", data.image);
      }
  
      const response = await apiClient.post<{}>("/book-lists", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      handleApiError(error);
      return {};
    }
  };


// export const updateList = async (id: string, listData: Partial<{}>): Promise<{}> => {
//     try {
//         const response = await apiClient.put<{}>(`/book-lists/${id}`, listData);
//         return response.data;
//     } catch (error) {
//         handleApiError(error);
//     }
//     return {}
// };


export const deleteList = async (listId: string): Promise<{}> => {
    try {
        const response = await apiClient.delete<{}>(`/book-lists/${listId}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    return {}
};
