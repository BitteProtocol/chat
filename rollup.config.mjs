import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import summary from "rollup-plugin-summary";
import packageJson from "./package.json" assert { type: "json" };

const peerDependencies = Object.keys(packageJson.peerDependencies);

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        name: packageJson.name,
        inlineDynamicImports: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
    external: [...peerDependencies],
    plugins: [
      external(),
      postcss({
        minimize: true,
        inject: {
          insertAt: "top",
        },
        config: {
          path: "./postcss.config.js",
        },
        extensions: [".css"],
      }),
      json(),
      url(),
      resolve(),
      commonjs(),
      typescript(),
      summary(),
      terser(),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];

export default config;
