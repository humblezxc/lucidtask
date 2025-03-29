'use client';

import { useState } from 'react';
import { Tag } from '@/types/suggestions';
import { useFormulaStore } from '@/stores/formulaStore';

export function TagWithDropdown({ tag }: { tag: Tag }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const { removeTag } = useFormulaStore();

    const getTagColor = (type: string) => {
        switch (type) {
            case 'variable': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            case 'number': return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'operator': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="relative inline-block">
      <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium cursor-pointer ${getTagColor(tag.type)}`}
          onClick={() => setShowDropdown(!showDropdown)}
      >
        {tag.name}
          {typeof tag.value === 'number' && (
              <span className="ml-1 text-xs opacity-70">({tag.value})</span>
          )}
      </span>

            {showDropdown && (
                <div
                    className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700">
                            <div className="font-medium">{tag.name}</div>
                            {tag.category && (
                                <div className="text-xs text-gray-500">{tag.category}</div>
                            )}
                            {typeof tag.value === 'number' && (
                                <div className="text-xs">Value: {tag.value}</div>
                            )}
                        </div>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                                navigator.clipboard.writeText(tag.name);
                                setShowDropdown(false);
                            }}
                        >
                            Copy
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => {
                                removeTag(tag.id);
                                setShowDropdown(false);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}