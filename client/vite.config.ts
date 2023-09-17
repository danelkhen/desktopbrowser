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
                    "@swc/plugin-emotion",
                    {
                        // default is true. It will be disabled when build type is production.
                        //   sourceMap?: boolean,
                        // default is 'dev-only'.
                        //   autoLabel?: 'never' | 'dev-only' | 'always',
                        // default is '[local]'.
                        // Allowed values: `[local]` `[filename]` and `[dirname]`
                        // This option only works when autoLabel is set to 'dev-only' or 'always'.
                        // It allows you to define the format of the resulting label.
                        // The format is defined via string where variable parts are enclosed in square brackets [].
                        // For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
                        //   labelFormat?: string,
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
