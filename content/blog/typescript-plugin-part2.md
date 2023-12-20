---
external: false
title: "Typescript Language Service Plugins | Part 2"
description: "Typescript plugins inside VS code extension runtime"
draft: false
date: 2022-03-05
heroImageUrl: "https://raw.githubusercontent.com/orta/TypeScript-TSServer-Plugin-Template/main/docs/screenshot.png"
heroImageAlt: "Sample plugin"
---

In [Part 1](/blog/typescript-plugin-par1) of this series, you learnt how to write and enable TS service plugins using `tsconfig.json`

**_NOTE: If you missed [Part 1](/blog/typescript-plugin-par1) please finish reading it before you read this_**

In Part 2, lets learn how VS Code extension uses TS language service plugins to add features to VS Code.

**_NOTE: This post is meant to be for developers with experience in authoring VS code Extensions. If you are new to VS code Extension Devlopement I highly recommend you to begin [here](https://code.visualstudio.com/api). Feel free to come back, later once you feel comfortable writing your own extension_**

For this post I will be using my own VS code extension [React CSS Modules](https://marketplace.visualstudio.com/items?itemName=viijay-kr.react-ts-css) to demonstrate how VS Code extension authours can take leverage of typescript server plugins

## Getting Started

`React CSS Modules` is a VS code extension that adds [CSS modules](https://github.com/css-modules/css-modules) intellisense to VS Code. Find out more about it in VS Code [Marketplace](https://marketplace.visualstudio.com/items?itemName=viijay-kr.react-ts-css)

`React CSS Modules` uses a typescript service plugin, [`typescript-cleanup-defs`](https://github.com/Viijay-Kr/typescript-cleanup-defs) under the hood.

The main job of the plugin is to clean up some definition results of your choice from given declaration modules.

_NOTE: I'm not going to go deep into the plugin functionality. I will try to emphasise on the key purpose of the plugin_.

For instance , if you prefer not to see definitions results from a declaration file say `vitejs/types/client.d.ts` , then you could ask the plugin to ignore any definition result from the file by passing some config options.

**NOTE: Part 1 did not cover passing configuration options to plugins. TS plugins can take config options from the outside which can be any valid json field**

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

`modules` is the config option used by the plugin to filter our definition results.

For `React CSS Modules` the plugin filters out unnecessary definition results from declaration files that adds declarations to CSS modules.

For instance in the Vitejs project we created in Part 1, CSS module class `selector` definitions are resolved by a declaration file provided by Vite over here [`node_modules/vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts#L4). Typescript language server built inside VS code uses this as reference for any selector definition.

So when you trigger `Go to Definition` on any class selector say `styles.someSelector`, VS code will take you to the above declaration file.

Now `React CSS modules` want its users to go to the corresponding CSS module and to the location of the selector inside the module when they trigger `Go To Definition` on class selectors. The definition result from Vite's declration file is not that useful. So it's best to avoid it alltogether to give a nice experience to the developer.

`React CSS modules` is able to accomplish this by including `typescript-cleanup-defs` as a Typescript server plugin

## Enabling the plugin

We already know how to enable plugins through `tsconfig.json` (from Part 1).

However in VS code extension context the plugin is enabled by the extension at runtime.

You can accomplish this by adding `typescriptServerPlugins` field to the `contributes` section of your extension's `package.json`

```json
  "contributes":{
    // ...rest of your contributions
    "typescriptServerPlugins": [
     {
       "enableForWorkspaceTypeScriptVersions": true,
       "name": "typescript-cleanup-definitions"
     }
   ]
  }
```

**NOTE: `enableForWorkspaceTypeScriptVersions` tells VS code to enable this plugin when the underlying project uses its own version of typescript**

Now when the extension is activated by any typescript based projects, extension runtime will tell TS server to load the plugin specified in the list of `typescriptServerPlugins`

With this there is a connection established between your TS server run by your VS Code Editor and the plugin which is enabled by your extension.

## Configuring the plugin

Configuring the plugin inside VS code extension context is not as straightforward as configuring in `tsconfig.json`.

Any plugin must be configured during the activation of your extension. Here is the appraoch used by `React CSS Modules`

```ts
const syncTsPlugin = async () => {
  const ext = extensions.getExtension("vscode.typescript-language-features");
  if (ext) {
    if (!ext.isActive) {
      await ext.activate();
    }
    const tsAPi = ext.exports.getAPI(0);
    tsAPi.configurePlugin("typescript-cleanup-definitions", {
      name: "typescript-cleanup-definitions",
      modules: Settings.cleanUpDefs,
      enable: Settings.tsCleanUpDefs,
    });
  }
};
```

Now there is a bunch of this going on here.

`synTsPlugin` gets the `typescript-language-features` from the extension context, activates it if it's not already active and configures the plugin by invoking the `configurePlugin` function that is exposed by the `typescript-language-features` extension.

Notice how the configuration options such as `name`,`module` and `enable` are being passed as arguments and the first arugment is always the name of the plugin that you specify in `package.json`

`syncTsPlugin` is invoked by the `activate` function of the extension once during the activation phase. This ensures the plugin is loaded and activated if its not already. Optionally you can also invoke it inside configuration change event.

```ts
workspace.onDidChangeConfiguration(async (e) => {
  if (e.affected) {
    syncTsPlugin();
  }
});
```

This will make sure the plugin is synchronized with your extension settings when they are modified by the user.

That's it when your extension is installed and activated by the user , the plugin should also be loaded by the TS server.

## Wrapping it Up

I hope you got an idea of Typescript language service plugin's anatomy and how it helps to improve or change your editing experience in VS code. Of course there are numberous use cases you can try out with Service Plugins. In futures posts I will try to cover more about debugging plugins inside VS code to help your local workflow.

['Writing Language Servie Plugin'](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin) is definitely a good read to get started if you plan to write your own plugin.

With this I conclude my two part series on Typescript Language Service Plugins.

Happy Hacking 🤓
