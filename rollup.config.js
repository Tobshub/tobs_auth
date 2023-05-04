const commonjs = require("@rollup/plugin-commonjs").default;
const esbuild = require("rollup-plugin-esbuild").default;
const tsconfigPaths = require("rollup-plugin-typescript-paths").typescriptPaths;

module.exports = {
  input: "./src/index.ts",
  plugins: [
    esbuild({ minify: true }),
    commonjs({
      extensions: [".js", ".ts"],
      sourceMap: true,
      requireReturnsDefault: true,
      esmExternals: true,
    }),
    tsconfigPaths({ preserveExtensions: true }),
  ],
  output: {
    format: "cjs",
    dir: "dist",
  },
};
