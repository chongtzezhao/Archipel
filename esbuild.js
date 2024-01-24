const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");


// esbuild with watch and serve
esbuild
    .build({
        entryPoints: ["frontend/index.tsx"],
        outdir: "public/assets",
        bundle: true,
        minify: true,
        // plugins: [sassPlugin()],
    })
    .then(result => console.log("⚡ Build complete! ⚡"))
    .catch(() => process.exit(1))
