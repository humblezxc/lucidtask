import { useQuery } from '@tanstack/react-query';
import { SuggestionItem } from '@/types/suggestions';

const API_URL = 'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete';

interface ApiResponseItem {
    id: string;
    name: string;
    category: string;
    value: string | number;
    inputs?: string;
}

export const useSuggestions = (query: string, isOperator = false) => {
    return useQuery({
        queryKey: ['suggestions', query],
        queryFn: async (): Promise<SuggestionItem[]> => {
            const response = await fetch(`${API_URL}?name=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ApiResponseItem[] = await response.json();
            return data.map((item: ApiResponseItem) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                value: item.value
            }));
        },
        enabled: isOperator ? query.length >= 0 : query.length > 0,
        staleTime: 60 * 1000,
    });
};