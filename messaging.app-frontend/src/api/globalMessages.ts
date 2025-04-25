import api from './auth';

export const fetchGlobalChatMessages = (before?: string, limit: number = 100) => {
    let url = `/messages/global/retrieve?limit=${limit}`;
    if (before) {
        url += `&before=${before}`;
    }
    return api.get(url);
};