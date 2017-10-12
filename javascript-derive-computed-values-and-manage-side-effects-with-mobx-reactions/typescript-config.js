SystemJS.config({
  packages: {
    "ts": {
      "main": "lib/plugin.js"
    },
    "typescript": {
      "main": "lib/typescript.js",
      "meta": {
        "lib/typescript.js": {
          "exports": "ts"
        }
      }
    }
  },
  map: {
    "ts": "https://unpkg.com/plugin-typescript@7.1.0/",
    "typescript": "https://unpkg.com/typescript@2.4.2/"
  },
  transpiler: 'ts'
});