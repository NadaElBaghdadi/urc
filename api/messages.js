//récupérer les messages d'un salon spécifique.

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

        const { roomId } = new URL(request.url).searchParams;

        if (!roomId) {
            return new Response(JSON.stringify({ message: "Room ID is required" }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const client = await db.connect();

        const { rows } = await client.sql`
            SELECT * FROM messages WHERE room_id = ${roomId} ORDER BY created_on DESC
        `;

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
