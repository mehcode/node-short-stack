# short-stack

## Install

```sh
$ npm install short-stack
```

## Usage

```js
if (process.env.NODE_ENV !== "production") {
  require("short-stack")({
    builtin: false,  // hide frames within builtin modules (process,domain,etc.)
    async: true,     // collect asynchronous stack traces (with stackup)
    include: [       // whitelist for stack frames (that are not built-in modules)
      __dirname + "./src"
    ]
  })
}
```
