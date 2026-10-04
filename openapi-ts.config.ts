import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    plugins: ["@hey-api/client-fetch"],
    input: "http://127.0.0.1:8080/openapi.json",
    output: "src/client"
})