import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../libs/db';

export async function GET(request: NextRequest, { params }: { params: { routeId: string } }) {
  const { routeId } = params;

  try {
    const result = await query('SELECT * FROM route WHERE id = $1', [routeId]);

    if (!result || result.length === 0) {
      return NextResponse.json({ message: 'Route not found' }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
