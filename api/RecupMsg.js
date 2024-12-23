import { checkSession, unauthorizedResponse } from "../lib/session";
import { sql } from "@vercel/postgres";

export const config = {
    runtime: 'edge',  
};

export default async function handler(request) {
    try {
        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        const url = new URL(request.url);
        const receiver_id = url.searchParams.get("receiver_id");

        if (!receiver_id) {
            return new Response("Receiver ID is required", {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }
        console.log(connected)

        const { rowCount, rows } = await sql`
            SELECT 
                message_id, 
                sender_id, 
                receiver_id, 
                sender_name,
                content, 
                TO_CHAR(timestamp, 'DD/MM/YYYY HH24:MI') AS timestamp 
            FROM messages
            WHERE (sender_id = ${connected.id} AND receiver_id = ${receiver_id})
               OR (sender_id = ${receiver_id} AND receiver_id = ${connected.id})
            ORDER BY timestamp ASC
        `;

        console.log("Got " + rowCount + " messages");

        if (rowCount === 0) {
            return new Response("[]", {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify(rows), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};