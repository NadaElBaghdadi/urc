import { sql } from "@vercel/postgres";
import { checkSession, unauthorizedResponse } from "../lib/session";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        
        const { rowCount, rows } = await sql`
            SELECT user_id, username, TO_CHAR(last_login, 'DD/MM/YYYY HH24:MI') AS last_login
            FROM users
            ORDER BY last_login DESC
        `;
        console.log("Got " + rowCount + " users");

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
}
