import api from './auth';

export const deletePrivateMessage = (id: string) => {
    return api.delete(`/messages/private/${id}`);
};
