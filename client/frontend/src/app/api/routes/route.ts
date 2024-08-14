import { NextResponse } from 'next/server';
import { query } from '../../../libs/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  try {
    const routes = await query('SELECT * FROM route ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    return NextResponse.json(routes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
  }
}
