# The Terminator

The Terminator will end all suffering. Regarding terms.

## Building

[You need to have node.js installed first.](https://nodejs.org/)

```bash
npm install
npm run build
```

The `npm run build` is just an alias for `tsc` (the typescript compiler), without parameters. Thus, you can just type `tsc` once you've installed it. You can also run `tsc --watch` to automatically build on file changes.

## How to: develop with VS Code

1. Ensure that [VS Code](https://code.visualstudio.com/) and [Node](https://nodejs.org/) are installed
2. Clone this repository
3. Open the folder in VS Code
4. Click `Terminal -> New Terminal` on the menu
5. Type `npm install`
6. Press `Ctrl`+`Shift`+`B`, select "tsc watch"
7. Open `index.htm` in your favourite browser
8. Make some changes to the code
9. Refresh the browser tab - the changes should have been applied.
10. Go to 5, have fun.
