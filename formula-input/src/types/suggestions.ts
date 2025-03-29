export interface SuggestionItem {
    id: string;
    name: string;
    category: string;
    value: string | number;
}

export type TagType = 'variable' | 'number' | 'operator';

export interface Tag extends SuggestionItem {
    type: TagType;
}