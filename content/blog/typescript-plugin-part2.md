---
external: false
title: "Typescript Language Service Plugins | Part 2"
description: "Typescript plugins inside VS code extension runtime"
draft: false
date: 2022-03-04
---

In [Part 1](/blog/typescript-plugin-par1) of this series, you learnt how to write and enable TS service plugins using `tsconfig.json`

**_NOTE: If you missed [Part 1](/blog/typescript-plugin-par1) please finish reading it before you read this_**

In Part 2, lets learn how VS Code extension uses TS language service plugins to add features to VS Code.

**_NOTE: This post is meant to be for developers with experience in authoring VS code Extensions. If you are new to VS code Extension Devlopement I highly recommend you to begin [here](https://code.visualstudio.com/api). Feel free to come back, later once you feel comfortable writing your own extension_**

For this post I will be using my own VS code extension [React CSS Modules](https://marketplace.visualstudio.com/items?itemName=viijay-kr.react-ts-css) to demonstrate how VS Code extension authours can take leverage of typescript server plugins

## Getting Started

`React CSS Modules` is a VS code extension that adds [CSS modules](https://github.com/css-modules/css-modules) intellisense to VS Code. Find out more about it in VS Code [Marketplace](https://marketplace.visualstudio.com/items?itemName=viijay-kr.react-ts-css)

`React CSS Modules` uses a typescript service plugin, [`typescript-cleanup-defs`](https://github.com/Viijay-Kr/typescript-cleanup-defs) (also authored by me) under the hood.

The main job of the plugin is to clean up some definition results of your choice from given declaration modules.

_NOTE: I'm not going to go deep into the plugin functionality. I will try to emphasise on the key purpose of the plugin_.

For instance , if you prefer not to see definitions results from a declaration file say `vitejs/types/client.d.ts` , then you could ask the plugin to ignore any definition result from the file by passing some config options.

**NOTE: Part 1 did not cover passing configuration options to plugins. TS plugins can take config options from the outside which can be any valid json feilds**

```json
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-cleanup-defs",
        "enable": true,
        "modules": ["*.module.css", "*.client.d.ts"]
      }
    ]
  }
}
```

`modules` is the config option used by the plugin to do its job

## Enabling the plugin
