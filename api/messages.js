import { getConnecterUser, triggerNotConnected } from "../lib/session";
import { db } from "@vercel/postgres";

export const config = {
    runtime: "edge", // Runtime Edge pour meilleure performance
};

export default async function handler(request) {
    try {
        // Vérifie la méthode HTTP
        if (request.method === "POST") {
            return await handlePost(request);
        } else if (request.method === "GET") {
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

// Gestion de POST : Envoi de message
async function handlePost(request) {
    try {
        const user = await getConnecterUser(request);

        if (!user) {
            return triggerNotConnected(
                new Response(JSON.stringify({ error: "Not connected" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                })
            );
        }

        const { receiver_id, content, receiver_type , sender_id, sender_name} = await request.json();

        if (!receiver_id || !content || !receiver_type) {
            return new Response(JSON.stringify({ error: "Receiver ID, content, and receiver type are required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Vérification si le destinataire existe (utilisateur uniquement)
        if (receiver_type === "user") {
            const receiverResult = await db.sql`
                SELECT user_id 
                FROM users 
                WHERE user_id = ${receiver_id};
            `;

            if (receiverResult.rowCount === 0) {
                return new Response(JSON.stringify({ error: "Receiver not found." }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }if (receiver_type === "room") {
            const receiverResult = await db.sql`
                SELECT room_id 
                FROM rooms 
                WHERE room_id = ${receiver_id};
            `;

            if (receiverResult.rowCount === 0) {
                return new Response(JSON.stringify({ error: "Room not found." }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        // Insérer le message
        const result = await db.sql`
            INSERT INTO messages (sender_id, sender_name, receiver_id, content, receiver_type, timestamp)
            VALUES (${user.id}, ${user.username}, ${receiver_id}, ${content}, ${receiver_type}, NOW())
            RETURNING message_id, sender_id, sender_name, receiver_id, content, receiver_type, timestamp;
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

// Gestion de GET : Récupération des messages
async function handleGet(request) {
    try {
        const user = await getConnecterUser(request);
        const url = new URL(request.url);
        const receiver_id = url.searchParams.get("receiver_id");
        const receiver_type = url.searchParams.get("receiver_type");

        if (!user) {
            return triggerNotConnected(
                new Response(JSON.stringify({ error: "Not connected" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                })
            );
        }

        if (!receiver_id || !receiver_type) {
            return new Response(JSON.stringify({ error: "Receiver ID and receiver type are required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        let messagesQuery;

        // Récupérer les messages selon le type de destinataire
        if (receiver_type === "user") {
            messagesQuery = db.sql`
                SELECT message_id, sender_id, sender_name, receiver_id, content, receiver_type, timestamp
                FROM messages
                WHERE (receiver_id = ${user.id} OR sender_id = ${user.id})
                AND receiver_id = ${receiver_id}
                ORDER BY timestamp ASC;
            `;
        } else if (receiver_type === "room") {
            messagesQuery = db.sql`
                SELECT message_id, sender_id, sender_name, receiver_id, content, receiver_type, timestamp
                FROM messages
                WHERE receiver_id = ${receiver_id} AND receiver_type = 'room'
                ORDER BY timestamp ASC;
            `;
        } else {
            return new Response(JSON.stringify({ error: "Invalid receiver type." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const messagesResult = await messagesQuery;

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
