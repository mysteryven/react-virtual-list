# ts-react-lib-starter

Inspired by [ts-lib-starter](https://github.com/egoist/ts-lib-starter)

You can use this template to bootstrap a custom hook library、custom component library. 
## Using this template

- Change directory `packages/ts-react-lib` with your own lib name
- Search `ts-react-lib` and replace it with your custom package name.

If you want to download this template without `.git` folder, you can use degit:

```bash
npm i degit -g

degit https://github.com/mysteryven/ts-react-lib-starter.git
```

`pagckages/ts-react-lib/shim.js` is used to [auto import react](https://github.com/evanw/esbuild/issues/334#issuecomment-711150675). Feel free to delete other files in `src` but not `shim.js`. If you want to change its directory or its name, make sure also change its path `tsup.config.ts`  

```
inject: ['path/to/shim.js']
```

## Features

- Manange packages with [pnpm](https://pnpm.js.org/)
- Bundle with [tsup](https://github.com/egoist/tsup)
- Test with [vitest](https://vitest.dev)
- Add demos to show use-case in `packages/playground`

When you push code to Github on branch `main`, It will run test by CI (GitHub action). To skip CI, add `skip-ci` to commit message.