import { NextResponse } from 'next/server';
import { query } from '../../../../libs/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const filterQuery = searchParams.get('query') || '';

  try {
    let routes;

    if (filterQuery) {
      routes = await query(
        `
        SELECT * FROM route 
        WHERE name ILIKE $1
        ORDER BY id 
        LIMIT $2 OFFSET $3
        `,
        [`%${filterQuery}%`, limit, offset]
      );
    } else {
      routes = await query(
        `
        SELECT * FROM route 
        ORDER BY id 
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
      );
    }

    return NextResponse.json(routes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}
