import { NextResponse } from 'next/server';

const suggestionsData = [
    { id: 'revenue', name: 'revenue' },
    { id: 'cost', name: 'cost' },
    { id: 'profit', name: 'profit' },
    { id: 'users', name: 'users' },
    { id: 'growth_rate', name: 'growth_rate' },
    { id: 'expenses', name: 'expenses' },
    { id: 'margin', name: 'margin' },
    { id: 'cogs', name: 'cogs' },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    await new Promise(resolve => setTimeout(resolve, 300));

    const filtered = suggestionsData.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json(filtered);
}