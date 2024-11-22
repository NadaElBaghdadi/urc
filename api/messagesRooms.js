import { getConnecterUser, triggerNotConnected } from "../lib/session";
import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge', 
};

export default async function handler(request) {
    try {
       if (request.method === 'GET') {
            return await handleGet(request);
        } else {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.error("Error in handler:", error);
        return new Response(JSON.stringify({ error: "An internal error occurred." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


async function handleGet(request) {
    try {
        const user = await getConnecterUser(request);
        const {room_id} = request.query;

        if (!user) {
            return triggerNotConnected(new Response(JSON.stringify({ error: "Not connected" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }));
        }

        const messagesResult = await db.sql`
            SELECT *
           FROM messages
            WHERE receiver_id = ${room_id} AND receiver_type = 'room'
            ORDER BY timestamp ASC;

        `;

        return new Response(JSON.stringify(messagesResult.rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in GET handler:", error);
        return new Response(JSON.stringify({ error: "An error occurred while retrieving messages." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
