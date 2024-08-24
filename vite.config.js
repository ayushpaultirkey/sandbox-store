import { join } from "path";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import h12vite from "./plugin/h12.vite";
import relativeUrl from "./plugin/relativeurl";

export default defineConfig({
    root: join(__dirname, "/public"),
    build: {
        outDir: "../dist"
    },
    optimizeDeps: {
        entries: [
            'public/script/app.js',
        ]
    },
    plugins: [
        h12vite(),
        relativeUrl()
    ],
    resolve: {
        alias: [
            { find: "@library", replacement: fileURLToPath(new URL("./public/library", import.meta.url)) },
            { find: "@style", replacement: fileURLToPath(new URL("./public/style", import.meta.url)) },
            { find: "@image", replacement: fileURLToPath(new URL("./public/image", import.meta.url)) }
        ]
    },
    css: {
        postcss: {
            plugins: [
                tailwindcss(),
                autoprefixer()
            ],
        },
    },
    server: {
        port: 3000
    }
})