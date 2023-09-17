import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svgr(),
        react({
            plugins: [
                [
                    "@swc/plugin-styled-components",
                    {
                        displayName: true,
                    },
                ],
            ],
        }),
    ],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:7777",
                ws: true,
            },
        },
    },
})