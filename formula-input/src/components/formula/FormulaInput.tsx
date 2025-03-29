'use client';

import {useState, useRef, KeyboardEvent, useEffect} from 'react';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useFormulaStore } from '@/stores/formulaStore';
import { TagWithDropdown } from './TagWithDropdown';
import { evaluateFormula } from '@/utils/evaluateFormula';
import { SuggestionItem } from '@/types/suggestions';

export function FormulaInput() {
    const { tags, input, addTag, removeTag, setInput } = useFormulaStore();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isOperator, setIsOperator] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: suggestions, isLoading } = useSuggestions(input, isOperator);

    const handleAddTag = (item: SuggestionItem | string) => {
        if (typeof item === 'string') {
            const isNumber = !isNaN(Number(item));
            addTag({
                id: `${item}-${Date.now()}`,
                name: item,
                category: isNumber ? 'number' : 'variable',
                value: isNumber ? Number(item) : item,
                type: isNumber ? 'number' : 'variable'
            });
        } else {
            const isNumber = !isNaN(Number(item.value));
            addTag({
                ...item,
                value: item.value || item.name,
                type: isNumber ? 'number' : 'variable'
            });
        }
        setInput('');
        inputRef.current?.focus();
    };

    const handleAddOperator = (operator: string) => {
        addTag({
            id: `op-${Date.now()}`,
            name: operator,
            category: 'operator',
            value: operator,
            type: 'operator'
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1].id);
            return;
        }

        if (e.key === ' ' && input.trim() !== '') {
            handleAddTag(input.trim());
            e.preventDefault();
        }

        if (['+', '-', '*', '/', '^', '(', ')'].includes(e.key)) {
            if (input.trim() !== '') {
                handleAddTag(input.trim());
            }
            handleAddOperator(e.key);
            e.preventDefault();
        }
    };

    const handleSuggestionSelect = (item: SuggestionItem) => {
        handleAddTag(item);
    };

    useEffect(() => {
        const lastTag = tags[tags.length - 1];
        setIsOperator(lastTag && ['+', '-', '*', '/', '^', '(', ')'].includes(lastTag.value as string))
    }, [tags, isOperator, input]);

    return (
        <div className="w-full max-w-2xl p-4 mx-auto space-y-4">
            <label className="block text-sm font-medium text-gray-700">Formula</label>

            <div className="relative">
                <div
                    className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 min-h-12 bg-white"
                    onClick={() => inputRef.current?.focus()}
                >
                    {tags.map((tag, index) => (
                        <TagWithDropdown key={`${tag.id}-${index}`} tag={tag} />
                    ))}
                    <input
                        ref={inputRef}
                        className="flex-1 min-w-[50px] outline-none bg-transparent text-gray-900 placeholder-gray-400"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={tags.length === 0 ? "Type to add variables..." : ""}
                    />
                </div>

                {showSuggestions && (
                    <div className="absolute z-10 w-full mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5">
                        {isLoading ? (
                            <div className="px-4 py-2 text-gray-500">Loading...</div>
                        ) : suggestions?.length === 0 ? (
                            <div className="px-4 py-2 text-gray-500">No suggestions found</div>
                        ) : (
                            suggestions?.map((item) => (
                                <div
                                    key={item.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSuggestionSelect(item)}
                                >
                                    <div className="font-medium">{item.name}</div>
                                    {item.category && (
                                        <div className="text-xs text-gray-500">{item.category}</div>
                                    )}
                                    {item.value && (
                                        <div className="text-xs text-gray-500">Value: {item.value}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                    <p>Available operators: + - * / ^ ( )</p>
                    <p>Press space to complete variables</p>
                </div>
                <div className="text-right">
                    <p>Tags: {tags.length} (N: {tags.filter(t => t.type === 'number').length},
                        V: {tags.filter(t => t.type === 'variable').length},
                        O: {tags.filter(t => t.type === 'operator').length})</p>
                </div>
            </div>

            <div className="p-3 border rounded bg-gray-50">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Formula Evaluation</h3>
                    <div className="text-sm text-gray-500">
                        {tags.length > 0 ? `${tags.length} elements` : 'Empty formula'}
                    </div>
                </div>
                <div className="mt-2 p-2 bg-white rounded border">
                    <div className="text-sm text-gray-500">Expression:</div>
                    <div className="font-mono text-sm">
                        {tags.map(t => t.value || t.name).join(' ')}
                    </div>
                </div>
                <div className="mt-2 p-2 bg-white rounded border">
                    <div className="text-sm text-gray-500">Result:</div>
                    <div className="text-xl font-bold">
                        {evaluateFormula(tags)}
                    </div>
                </div>
            </div>
        </div>
    );
}