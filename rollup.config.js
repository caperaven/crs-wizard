import { terser } from "rollup-plugin-terser";

export default {
    input: "src/crs-wizard.js",
    output: [
        {file: 'dist/crs-wizard.js', format: 'es'}
    ],
    plugins: [
        terser()
    ]
};