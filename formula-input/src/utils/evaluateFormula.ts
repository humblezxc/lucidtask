import { Tag } from '@/types/suggestions';

export function evaluateFormula(tags: Tag[]): string {
    try {
        // Convert tags to expression parts with proper value handling
        const expressionParts = tags.map(tag => {
            // Handle operators directly
            if (tag.type === 'operator') {
                return tag.name;
            }

            // Handle numbers (either direct numbers or variables with numeric values)
            if (tag.type === 'number' || !isNaN(Number(tag.value))) {
                return tag.value.toString();
            }

            // Handle variables with string values that might be expressions
            if (typeof tag.value === 'string' && tag.value.includes('+')) {
                return `(${tag.value})`; // Wrap in parentheses for safety
            }

            // Default case (shouldn't reach here for valid formulas)
            return '0';
        });

        const expression = expressionParts.join(' ');

        // Additional safety checks
        if (!isValidExpression(expression)) {
            return "Invalid Expression";
        }

        // Safe evaluation using Function constructor
        const result = new Function(`return ${expression}`)();

        return isNaN(result) ? "Invalid Expression" : result.toString();
    } catch (error) {
        return "Error";
    }
}

function isValidExpression(expr: string): boolean {
    // Check for only allowed characters
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        return false;
    }

    // Check for balanced parentheses
    let balance = 0;
    for (const char of expr) {
        if (char === '(') balance++;
        if (char === ')') balance--;
        if (balance < 0) return false;
    }
    return balance === 0;
}