---
external: false
title: "Do yourself a favour by including \"drizzle-orm\" in your stack"
description: "Including drizzle-orm in your backend can significantly increase your producitivty. Learn more here and start using drizzle-orm if you are not"
date: 2023-12-20
heroImageUrl: "https://miro.medium.com/v2/resize:fit:1200/1*NWvQepJvLQJLZLkLbNnEzA.png"
heroImageAlt: "Architecture of LSP"
---

## History TL;DR
Working with databases outside console environment over time evolved to be a daunting experience for developers. Translating the following simple `SQL` query into your favourite langauge seemed naturally simple

```sql
  # raw sql
  select * from `users` where `name`="vijay"  
```

```js
  // in javascript using any sql client 
  const query = `select * from users where name=${name}`
  const result = await dbClient.execute(query)
```

Arguably this works. Although for how long? You can't keep writing complex queries inside template literals without type safety for a long time. At a certain point you will feel like you are missing a pattern , a structure , a safety if you will!. This is where `ORM` really shines 💡. 

`ORM` short for `O`bject `R`elational `M`apping is a higher level abstraction of your database models/schemas into langauge specfic objects. `Schemas` or `Models` represent the strucutre of your database tables in a object oriented pattern

For instance the above query using any `typescript` ORM may look like the following
```ts
  const result = db.users.findMany().where(users.name===name);
```
Assume the ORM your are using wraps your whole database in an instance called `db` of the class `Db`. Now the instance `db` has access to the `table` namely `users` which in itself is an instance of class called `Table`. Now `users` can perform sql operations on the database using the functions provided by the class `Table` i.e `findMany` which is equivalent to a select operation in SQL .

Bind all this with typesafety. BAM!!💥 you get a nice builder strategy abstraction for working with your database tables with typesafety and easy to use abstraction.

The strategy with which you perform SQL operations might differ from ORM to ORM but they are all based on Object Oriented patterns.

## Modern ORM's
Modern languages has a vareity of ORM's in the open. `python` has [django](), popular web framework with builtin orm. `golang` has [GORM](). 

Javascript almost for a decade lived without typescript. [Typeorm]() was one of the earliest ORMs introduced in the javascript community which is also quite popular and still used by millions of developers. Other players like [Mongoose]() [Sequelize](),[knex.js]() are also popular open source projects that provide a decent developer experience. 

However the beginning of this decade was marked by introduction of [Prisma]() the most go to orm for typescript that focuses fully on typesafety , seamless migrations , flexible relationship patterns , great tooling powered by `rust`

Honestly I have been pretty impressed by the experience I had with prisma until I found [drizzle-orm](). Drizzle according to me was started to overcome the pitfalls of Prisma and write sql that feels more natural with absolute typesafety.  

In this blog , I will be using a small side project of mine ([trackify]()) to demonstrate how quickly I got comfortable working with drizzle-orm

## Prisma is great but...
Like I said before , I don't hate prisma . It has a great tooling , amazing devX. Although not focusing on performance in this article it definitely is a popular choice. However in comparision to drizzle-orm I most certainly think drizzle offers a even better devX in terms of ease of use ,amazing typesafety and overall a tremendous speed.

The major problem with prisma for me is the learning curve is a bit high although quick to get there. Writing your schema in `.prisma` language is something I would not do when you have drizzle that asks you to write your schemas in plain typescript 

> Note: If you are looking to get started with drizzle-orm. Check out their docs and try it in your sample project and come back here. I will be starting the demos without the setup and quick starts. Also this blog doesn't focus too much on the tooling such as 'drizzle-kit' and 'drizzle-studio'.

In my project the first table I created in my database is `spaces` . With `drizzle-orm` you can do that by creating a file called `./db/schemas/spaces.ts`

```ts
 import { datetime, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
 
 export const spaces = mysqlTable("spaces", {
  id: serial("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  createdAt: datetime("createdAt", { mode: "date", fsp: 6 }).notNull(),
  owner: varchar("owner", { length: 256 }).notNull(),
 });
```
The above code creates a table called `spaces` by using the method called `mysqlTable` which takes a record of items to make columns for the table

As you can see it's just plain typescript with a pinch of object oriented flavours. So easy and no need for you to learn a new langauge besides the one you already know.

Obviously there is a bit of learning initially that you need to do but as far I am concerned I was able to do that in my editor (VS Code) with type completions and type definitions. So I felt it was a great improvement compared to prisma where you need to know by heart the syntactic sugars of the langauge.

## Querying
Ultimately any good ORM should offer the same seamless experience you get with writing your schemas when it comes to writing queries. 

Drizzle did not disappoint me in that area too. Learning to write queries felt like learning numbers in German(which is the easiest of all).

To get all spaces of an user "vj" you can do 

```ts
const spaces = await db.query.spaces.findMany({
    where: eq(spaces.owner,"vj")
})
```
Here inside the `where` clause I've used a function called `eq`. `eq` is one of the many  utility method provided by drizzle to write neat comparisions where clauses. So they are nothing but [operators]().

You can also use the other variant `select` instead of `query` which feels more like writing SQL in typescript

```ts
const spaces = await db.select().from(spaces).where(eq(spaces.owner,user.id))
```

Select also gives you option to select only certain fields from the table by doing
```ts
const spaces = await db
    .select({
        name:spaces.name
    })
    .from(spaces)
    .where(eq(spaces.owner,"vj"));
```

## Insert

Insert is no different from queries you can simply write

```ts
const result = await db.insert(spaces).values({
    name,
    owner,
    createdAt,
});
```

The result of the insert operations provides you the inserted id which is helpful for routing and navigation. So that is nice 


## Update

Update is again a cake walk

```ts
const result = await db.update(spaces).set({
    name,
    updatedAt
}).where(eq(spaces.id,"1"));
```

I am not even going to go into `delete`. By now you know how simple it could be so you'll figure it out without my help.

## Typescript magic
So far you saw how simple it was to perfrom CRUD on a table with great completions. However I missed a important thing to cover in the previous sections `typesafety`. 

Drizzle offers great utilities for you to expose the type information of schemas by doing the following.

```ts
 export const spaces = mysqlTable("spaces", {
  id: serial("id").primaryKey().autoincrement(),
  // ...
 })

 export type Select_Space = typeof spaces.$inferSelect;
 export type Insert_Space = typeof spaces.$inferInsert;
 // This my personal preferance when it comes to naming the types.
```
Drizzle uses the inferrence nature of typescript to create a solid type strucutre for your tables. These exposed types will be useful when dealing with sql operations. The `Inser_Space` is smart enough to know which fields are optional so when you use it in a function say `createSpace`

```ts
 function createSpace(row:Insert_Space){
  const result = await db.insert(spaces).values(row)
 }
```
you get the best type information that you need for the parameter `row`. Since `id` has `auto_increment` constraint it's optional.So `Insert_Space` knows it's optional. Pretty cool isn't ? 🤓

If you look at this inference pattern more closely you will see a glimpse of [`zod`]() in it. We all know how great zod is 🤓

## Working with Relationships

Relationships are hard to make and maintain. Hey wait I meant in the database world (not in real life). The standout feature of drizzle for me is the [`relationships`]() model. Unlike prisma you are going to write typescript and .prisma so naturally it felt so much easier for me to create relationships in drizzle

Honestly I struggled a lot with prisma to model my relationships.At first it felt so much harder to comprehend the relationships between models in prisma schema. It still is by the way.

However in drizzle you define relationhips as another entity in your database. You treat relationships as door hatch that connects multiple rooms

### One to Many

One to many or many to one is the simplest form of relationship you can create with drizzle. In my project I was required express a relationship between `spaces` and new table called `projects`. A space can have many `projects` and a project can belong to only one `space`. A classic one to many relationship. With drizzle you can do this by doing the following

```ts
  import { relations } from "drizzle-orm";
  import {
    bigint,
    datetime,
    mysqlEnum,
    mysqlTable,
    varchar,
} from "drizzle-orm/mysql-core";

 export const spaces = mysqlTable("spaces", {
  id: serial("id").primaryKey().autoincrement(),
  // ...
 });

 export const projects = mysqlTable("projects", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }).notNull(),
    space_id: bigint("space_id", { mode: "number" }).notNull(),
    // ...
  });  
```
I create a new table called `projects` with a `space_id` field which of the same type as `spaces.id`. 

```ts
 // One to Many Relationship starts here
  export const projectToSpaceRelations = relations(projects,({one})=>({
    space:one(spaces,{
        fields:[projects.space_id],
        references:[spaces.id]
    })
  }));
```

I define `projectToSpaceRelations` that creates the relatioship between `spaces` and `projects` table. 

The method `relations` takes the table as first argument and a callback as second. The callback is supplied with various ways with which you can form your relationships. In the first case I use the function `one` to form a 'one' form of relationship with `spaces` table using the field `projects.space_id`, referenced by `spaces.id` denoting that a project can belong to only one space

```ts
  export const spaceToProjectsRelation = relations(spaces,({many})=>({
   projects:many(projects)
  }));   
```

Similarly `spaceToProjectsRelation` denotes the 'many' form of the relatioship between `spaces` and `projects` denoting that a space can have many projects belonging to it

There is also another way of making relationships between tables which is using foreign keys pattern.

```ts
  export const projects = mysqlTable("projects", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }).notNull(),
    space_id: bigint("space_id").references(()=>spaces.id),
    // ...
  });  
```
Using `references` you add a foreign key constraint using the field space_id which is useful for performing cascade actions. You can find more about that [here]()

> NOTE: One to one is also made using the same approach by using the "one" utility on both sides

Drizzle declares that the relationships created using `relations` are just an abstraction you need to make your life easier and doesn't do anything to your database schema (execept adding foreign key constraint when `references` is used).

Querying relationships become super simple with the help of `relations`. For instance if I want to query a space with all the projects belonging to a space I can do 

```ts
  const spacesWithProjects = db.query.spaces.findMany({
    where:eq(spaces.owner,"vj"),
    with:{
        projects:true
    }
  })
```

Here I have used the special `with` operator inside `findMany` which you can use to include the corresponding relations of the table. So drizzle internally does a join of two tables with the referencing information that it has. 
The beauty of using `with` is that it is chainable as deep as you need. Meaning if `projects` has its own relations say `tasks` then you can include them too by doing

```ts
  const spacesWithProjects = db.query.spaces.findMany({
    where:eq(spaces.owner,"vj"),
    with:{
        projects: {
            tasks:true
        }
    }
  })
```

### Many to Many
Building "Many to Many" relationship in my project was a bit challenging at the beginning. However it was only due to the fact that I assumed "Many to Many" relationship is built the same way as "one to many". Although it's quite different 

You can build "many to many" relationships between two tables using a special feature called `join`  or `junctions` tables which you have to explicitly define

So I my project I had to build a 'm-n' relationship between tables `users` and `projects`. A user can be a member of many projects and a project can contain many users as it members. To do this I had to create a new table called `usersToProjects`

```ts
export const usersToProjects = mysqlTable(
  "users_to_projects",
  {
    userId: varchar("user_id", { length: 256 })
      .notNull()
    projectId: bigint("project_id", { mode: "number" })
      .notNull()
  },
  (t) => ({
    pk: primaryKey(t.userId, t.projectId),
    
  })
);
```
> Notice I used a **primaryKey** utility to create a primary key for this table using **userId** and **projectId** 

Now the new table `users_to_projects` is used to build a relationship between `projects` and `members` 

```ts
 export const usersToProjectsRelation = relations(
  usersToProjects,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToProjects.userId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [usersToProjects.projectId],
      references: [projects.id],
    }),
  })
 );

 export const usersRelation = relations(users, ({ many, one }) => ({
  projects: many(usersToProjects),
 }));

 export const projectsRelations = relations(projects, ({ one, many }) => ({
  space: one(spaces, {
    fields: [projects.space_id],
    references: [spaces.id],
  }),
  members: many(usersToProjects),
}));
```

So both relations i.e `usersRelation` and `projectsRelations`  uses middle table `usersToProjects` to represent this many to many relationship between `users` and `projects`. However `usersToProjectsRelation` has only one to one mapping to `projects` and `users`. So this means there can only one combination of user and a project in the `users_to_projects` table

So this will enable you to query  projects with all its members by doing
```ts
  const projectWithMemebers = await db.query.projects.findMany({
    with:{
       members:true
    }
  })
```

Similartly query users with projects 
```ts
  const usersWithProjects = await db.query.users.findMany({
    with:{
        projects:true
    }
  })
```

### Self relations
Self relations are also possible in drizzle. You will need to create self relations in your project when a table relies on itself to express a parent child relationship.

For instance , in my project I have a table called `tasks`. Each **task** can have many number of **substasks**. This can be expressed by making `tasks` rely on itself. In this instance I needed to create **one to many** self relations

```ts
export const tasks = mysqlTable("tasks", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  title: varchar("name", { length: 44 }).notNull(),
  // ...
  parentTask:bigint("parent_task", { mode: "number" }),
})
export const tasksRelation = relations(tasks,({many,one})=>({
    subTasks:many(tasks,{
        relationName:"subTasks"
    }),
    parentTask:one(tasks,{
        fields:[tasks.parentTask],
        refernces:[tasks.id],
        relationName:"subsTasks"
    })
}))
```
Notice how `parentTask` and `subTasks` takes leverage of **relationName** `subTasks` on both sides to achieve this self one to many relationship pattern. This pattern is not documented with an example in drizzle docs 

You can learn more about **Disambigious relations** [here]()


## Migration
Migration is a critical aspect when working with evolving database schemas. They have to be squential and distributed well within your team. So any good ORM tool will also provide utilities for you to manage and maintain your migrations smoothly.

Prisma provides **prisma-migrate** a solid tool that lets you do migrations smoothly. Drizzle also has a great migration tool drizzle-kit that lets you run migration smoothly.

### Make migrations
To create migration using drizzle-kit you need to run the command

`npx drizzle-kit generate:mysql --config=drizzle.config.ts`

The config file depends on environment variables and setup. My config file looks like this

```ts
import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env.local",
});

export default {
  schema: "./db/schema/*",
  driver: "mysql2",
  out: "./db/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

```
Learn more about the config [here](https://orm.drizzle.team/kit-docs/overview#configuration)

The above command will create **.sql** in your migrations folder which you can run to apply the migration

```sql
CREATE TABLE `projects` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`summary` varchar(256),
	`createdAt` datetime(6),
	`updatedAt` datetime(6),
	`space_id` bigint,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spaces` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`createdAt` datetime(6) NOT NULL,
	CONSTRAINT `spaces_id` PRIMARY KEY(`id`)
);

```

### Running migration
Drizzle is pretty agnostic about how you run your migrations. However it still provides utilities for you to run migrations using the `migrate` function for various drivers.

In my project I am using [**planetscale**] as my database. So drizzle provides platform specific options to run migrations using migrate function. The `migrate.ts` file in my project is the following

```ts
import dotenv from "dotenv";
import path from "path";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import * as schema from "./schema";

dotenv.config({
  path: "./.env.local",
});

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
});

const db = drizzle(connection, {
  schema,
  mode: "planetscale",
});

try {
  await migrate(db, { migrationsFolder: path.join(__dirname, "/migrations") });
  console.log("migrated successfully");
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
```

### Drop migration
Drizzle also lets you **drop** migrations using a drop command

`npx drizzle-kit drop --config=drizzle.config.ts`

Dropping migrations is very important before applying a wrong migration schema. Drizzle also tells you not to manually delete any .sql files but use drop utility to make the migration process smoother.

## Conclusion

So far in my project the experience I got with drizzle has been superb. Even though I am the only person working on this hobby project I can greatly see the benefits of the **drizzle-kit** and **drizzle-orm** scaling well to larger teams. So do yourself a favour by including drizzle in your stack
