// api/rooms.js

import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        if (request.method !== 'GET') {
            return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
                status: 405,
                headers: { 'content-type': 'application/json' },
            });
        }

        const client = await db.connect();

        const { rows } = await client.sql`SELECT * FROM rooms`;

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
