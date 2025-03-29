'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useFormulaStore } from '@/stores/formulaStore';
import { TagWithDropdown } from './TagWithDropdown';

export function FormulaInput() {
    const { tags, input, addTag, removeTag, setInput } = useFormulaStore();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: suggestions, isLoading } = useSuggestions(input);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1].id);
            return;
        }

        if (e.key === ' ' || ['+', '-', '*', '/', '^', '(', ')'].includes(e.key)) {
            if (input.trim() !== '') {
                addTag({
                    id: `${input}-${Date.now()}`,
                    name: input.trim(),
                    category: '',
                    value: '',
                    type: isNaN(Number(input.trim())) ? 'variable' : 'number'
                });
            }

            if (['+', '-', '*', '/', '^', '(', ')'].includes(e.key)) {
                addTag({
                    id: `op-${Date.now()}`,
                    name: e.key,
                    category: 'operator',
                    value: e.key,
                    type: 'operator'
                });
                e.preventDefault();
            }
        }
    };

    return (
        <div className="w-full max-w-2xl p-4 mx-auto space-y-2">
            <label className="block text-sm font-medium text-gray-700">Formula</label>

            <div className="relative">
                <div
                    className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 min-h-12 bg-white"
                    onClick={() => inputRef.current?.focus()}
                >
                    {tags.map((tag) => (
                        <TagWithDropdown key={tag.id} tag={tag} />
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

                {showSuggestions && input.length > 0 && (
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
                                    onClick={() => {
                                        addTag({
                                            ...item,
                                            type: 'variable'
                                        });
                                        setInput('');
                                        inputRef.current?.focus();
                                    }}
                                >
                                    <div className="font-medium">{item.name}</div>
                                    {item.category && (
                                        <div className="text-xs text-gray-500">{item.category}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="text-sm text-gray-500">
                <p>Available operators: + - * / ^ ( )</p>
                <p>Press space to complete variables</p>
            </div>
        </div>
    );
}
