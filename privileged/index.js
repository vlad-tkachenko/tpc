import { execAsync } from "./src/exec";

const server = Bun.serve({
    port: 23473,
    hostname: "localhost",
    routes: {
        "/exec": {
            POST: async (req) => {
                const body = await req.json();
                try {
                    console.log("Executing:", body.cmd)
                    await execAsync(body.cmd)
                    console.log("Execution completed")
                    return Response.json({ ok: true });
                } catch (e) {
                    console.error(e);
                    return Response.json({ ok: false }, { status: 500 });
                }
            }
        }
    },
    fetch(req) {
        return new Response("Not Found", { status: 404 });
    },
})

console.log(`Server running at ${server.url}`);