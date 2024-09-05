---
external: false
title: "A Developer's Toolbox - a peek into my 'developer toolbox'"
description: "The top tools I use for building web apps in 2024"
date: 2024-09-06
heroImageUrl: "/assets/devtoolbox.png"
heroImageAlt: "My Developer toolbox"
ogImagePath: "/assets/devtoolbox.png"
ogImageAltText: "My developer toolbox"
ogImageWidth: 1600
ogImageHeight: 800
---


The reason I wrote this article, the reason you chose to read this article, is a simple one.

Let's say you own a toolbox for your DIY work. It could be anything — setting up your new furniture from IKEA, hanging your favorite picture on the wall.

So if I ask you this question, "**Hey, do you remember all the tools in your toolbox?**"

You say, "**Maybe. Maybe not.**"

It's fair. Maybe you remember all the tools, maybe you remember only a few. Either way, you can open the box and see it. This way, you don't have to remember them at all, which is obviously unnecessary.

Now replace the above analogy with the following:

Your favorite furniture is now your favorite web app project. Your favorite picture is now a CLI project. Now, do you have all the tools in your toolbox? Wait, do you even have a toolbox for this purpose? Because I don't!

This is the main reason I decided to write them up in this post. This post is probably going to be my toolbox for building apps, projects, and any piece of software that I want to develop. So here is a peek into my developer toolbox (alphabetically)

## Astro
[Astro](https://astro.build/) has been my go-to tool for shipping static sites. My website and blog site are powered by Astro, Tailwind CSS, and Markdown. The benefit of writing plain JS scripts, templating, and the possibility to use React within the project offers a great deal of devX.

The Markdown support is great for me to quickly write articles, personal info, and connect it with custom components written in either Astro or React.

## Bun
I have recently started using [Bun](https://bun.sh/) as a temporary replacement for npm. Generally, I don't have a bad opinion of npm. It's great, but Bun is quick and comes with great batteries. It lets me quickly initialize a TypeScript project and get started.

I also use Bun to run database migration scripts when using Prisma/Drizzle ORM and also other JavaScript scripts. Soon it will become my permanent JS runtime/package manager.

## Drizzle ORM
[Drizzle ORM](https://orm.drizzle.team/) is my favorite TypeScript ORM for databases. I even wrote an [article](/drizzle-orm) about it. I started using it after I got a bit frustrated with Prisma.

## Git
I cannot start a project without [Git](https://git-scm.com/). No one does! I prefer branching most of the time even though I am the only contributor. I prefer rebasing, squashing, and semantic commit messages for the purpose of changelogs.

## GitHub
All my projects are hosted on GitHub, so it goes hand in hand with Git.

## GitHub Actions
Most of the time I try to automate workflows with [GitHub Actions](https://docs.github.com/en/actions). It's fun to write actions. It has a wide array of reusable actions. I use [Changesets](https://github.com/changesets/changesets) to do most of my publishing to registries powered by GitHub Actions. 

It is simple to use. Integrates well with other workflows. Vercel/Netlify automatically integrates their github actions to my project after integration

## Markdown/MDX
Be it `README.md` or for blogging, I extensively use Markdown to express my content. The integration with Astro is great. [MDX](https://mdxjs.com/) is also great, and I use it to combine it when I write React components.

## MongoDB
I use [MongoDB](https://www.mongodb.com/) at work. I also started using it for my personal projects. My [analytics application](https://analytics.vijayakrishna.dev/) is backed by MongoDB. The simplicity and integration with Vercel, Netlify, and TypeScript makes it my go-to DB.

## Next.js
[Next.js](https://nextjs.org/) is like a playground for me to explore all the possible tools. It connects well with Drizzle, MongoDB, React, and Tailwind. So it's a great tool for building server-side apps. My analytics app runs on Next.js, hosted by Vercel.

## NPM
My obvious package registry is [NPM](https://www.npmjs.com/). All my open-source packages are published in npm. The combination of npm with Changesets makes my life so much easier.

## Netlify
I started publishing static sites with [Netlify](https://www.netlify.com/). For some reason, I find it super easy to spin some static content super quickly with Netlify. It connects well with GitHub and Astro.

## Prisma
I started using type ORM with [Prisma](https://www.prisma.io). Initially, I liked it, but eventually switched to Drizzle due to its complexity. Prisma is a great branded ORM. The Rust engine behind it made me curious about Rust.

## React
80% of my projects have [React](https://react.dev/) code in them. It's the only component library I use for almost everything. Even Astro projects have React components in them.

## Rust
I am like any other TypeScript developer who got into [Rust](https://www.rust-lang.org/) due to the overhype. It was worth it. I built a couple of projects in Rust, Prisma Visualize, and Remod. So when I want to build any CLI, my preference right now is Rust. Great compiler, great developer ergonomics are a few things I can add.

I have worked with AST parsers in typescript before. Using SWC (a rust parser/compiler) in a project really showed the difference in terms of speed, reliability and visitor patters. Arguably typescript visitor patters are far more convenient compared to rust since I found visitor patterns in rust a bit complicated

## Shadcn UI
I was introduced to [Shadcn UI](https://ui.shadcn.com/) only very recently. Boy, it's an amazing project in my opinion. I don't think I will ever have to worry about Component library anymore. 

You add them to your project and never have to think about creating any components yourself. Most importantly they are not coupled to the style layer which is great. Great integration with Astro, Next.js, Vite, and Tailwind out of the box.

## TailwindCSS
I don't remember the last time I wrote plain CSS without [Tailwind](https://tailwindcss.com/). I was initially a tad hesitant to use it since I thought it would stop me from learning CSS. However, it turned out to be the opposite. I learn about CSS properties more with Tailwind.

## Turborepo
I have built a couple of projects using a monorepo setup. The devX I got with [Turborepo](https://turbo.build/repo/docs) has been quite amazing. The task-based workflow makes it great to work on big projects that scale.

## TypeScript
Saved the best for the last. [TypeScript](https://www.typescriptlang.org/) is my first language of choice. If I want to write a plugin, language service, parse AST, or a web app, I feel comfortable doing it in TypeScript. I never start any project without TypeScript.

## Vercel
[Vercel](https://vercel.com/) has been my app host for a while now. Deploying Next.js apps is like a cakewalk using Vercel. It also integrates well with MongoDB, GitHub, Neon, PlanetScale, etc.


