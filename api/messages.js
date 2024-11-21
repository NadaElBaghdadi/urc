import { getConnecterUser, triggerNotConnected } from "../lib/session";
import { db } from '@vercel/postgres';

export const config = {
    runtime: 'edge', 
};

export default async function handler(request) {
    try {
        // Check the HTTP method
        if (request.method === 'POST') {
            return await handlePost(request);
        } else if (request.method === 'GET') {
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

async function handlePost(request) {
    try {
        const user = await getConnecterUser(request);

        if (!user) {
            return triggerNotConnected(new Response(JSON.stringify({ error: "Not connected" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }));
        }

        const { receiver_id, content, receiver_type } = await request.json();

        if (!receiver_id || !content || !receiver_type) {
            return new Response(JSON.stringify({ error: "Receiver ID, content, and receiver type are required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const receiverResult = await db.sql`
            SELECT external_id 
            FROM users 
            WHERE user_id = ${receiver_id};
        `;

        if (receiverResult.rowCount === 0) {
            return new Response(JSON.stringify({ error: "Receiver not found." }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const result = await db.sql`
            INSERT INTO messages (sender_id, sender_name, receiver_id, content, receiver_type)
            VALUES (${user.id}, ${user.username}, ${receiver_id}, ${content}, ${receiver_type})
            RETURNING message_id, sender_id, sender_name, receiver_id, content, receiver_type;
        `;

        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ error: "Message could not be saved." }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const savedMessage = result.rows[0];
        return new Response(JSON.stringify(savedMessage), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in POST handler:", error);
        return new Response(JSON.stringify({ error: "An error occurred while saving the message." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

async function handleGet(request) {
    try {
        const user = await getConnecterUser(request);

        if (!user) {
            return triggerNotConnected(new Response(JSON.stringify({ error: "Not connected" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }));
        }

        // Retrieve messages for the connected user
        const messagesResult = await db.sql`
            SELECT message_id, sender_id, sender_name, receiver_id, content, receiver_type, timestamp
            FROM messages
            WHERE receiver_id = ${user.id} OR sender_id = ${user.id}
            ORDER BY timestamp DESC;
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
