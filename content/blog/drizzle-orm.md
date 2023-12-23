---
external: false
title: "Do yourself a favour by including \"drizzle-orm\" in your stack"
description: "Including drizzle-orm in your backend stack can significantly increase your productivity. Read more here about the nuances of drizzle-orm. Start using drizzle-orm if you are not"
date: 2023-12-20
heroImageUrl: "https://thumbnails-photos.amazon.com/v1/thumbnail/O5Qyr3aTTQyvbsb-_0VFFQ?viewBox=5788%2C2560&ownerId=AMUQB0W123TUO&groupShareToken=-2Us9Y7TSvuWBPo14PCcxg.uyS2yPlqAwVji3qP2JZ46c"
ogImagePath: "https://thumbnails-photos.amazon.com/v1/thumbnail/O5Qyr3aTTQyvbsb-_0VFFQ?viewBox=5788%2C2560&ownerId=AMUQB0W123TUO&groupShareToken=-2Us9Y7TSvuWBPo14PCcxg.uyS2yPlqAwVji3qP2JZ46c"
ogImageAltText: "Drizzle Orm"
ogImageWidth: 2400
ogImageHeight: 1600
heroImageAlt: "Drizzle ORM"
---

## History TL;DR
Working with databases over time has evolved to be a daunting experience for developers. Embedding `SQL` statements in your favorite language seemed naturally simple 

```sql
  # raw sql
  select * from `users` where `name`="vijay"  
```

```js
  // in javascript using any sql client 
  const query = `select * from users where name=${name}`
  const result = await dbClient.execute(query)
```

Arguably this works. Although for how long? You can't keep writing complex queries inside template literals without type safety. At a certain point you start to feel like you are missing a pattern, an abstraction, a safety if you will!. This is where `ORM` really shines💡. 

`ORM` short for **O**bject **R**elational **M**apping is a higher level abstraction/mapping of database tables and schemas into language specific objects/instances. For instance the above query using any `typescript` ORM may look like the following
```ts
  const result = db.users.findMany().where(users.name===name);
```
Internally the ORM your are using wraps your whole database in an instance called `db` of the class `Db`. Now the instance `db` has access to the `table` namely `users` which in itself is an instance of class called `Table`. Now `users` can perform sql operations on the database using the functions provided by the class `Table` i.e `findMany` which is equivalent to a select operation in SQL.

Bind all this with type safety, operations, schemas, BAM!!💥 you get a nice abstraction for working with your database tables with type safety and easy to use utilities.

The strategy with which you perform SQL operations might differ from ORM to ORM but they are all based on Object Oriented patterns.

## Modern ORM's
Modern languages has a variety of ORM's in the open. `python` has [django](https://docs.djangoproject.com/en/5.0/topics/db/queries/), popular web framework with builtin **ORM**. `golang` has [GORM](https://gorm.io/index.html). 

Javascript almost for a decade lived without typescript. So most ORMs in the pre typescript era was based on javascript. However such tools have started adopting typescript into their frameworks to provide the type flavours you need today 

[TypeOrm](https://typeorm.io/) was one of the earliest ORMs introduced in the javascript community which is also quite popular and still widely used. Other players like [Mongoose](https://mongoosejs.com), [Sequelize](https://sequelize.org/), [knex.js](https://knexjs.org/) are also popular open source projects that provide a decent developer experience. 

However the beginning of this decade was marked by the introduction of [Prisma](https://www.prisma.io/), the most go to solution for typescript projects. Prisma focuses on type safety, seamless migrations, flexible relationship patterns and a great tooling powered by `rust`

Honestly I have been pretty impressed by the experience I had with prisma until I found [**drizzle-orm**](https://orm.drizzle.team/docs/overview). To me drizzle turned out to be a great alternative to overcome the pitfalls I had with Prisma. It lets you write **SQL** statements that feels more natural and comes with great type safety.  

In this blog , I will be using a small side project of mine [trackify](https://trackify-viijay-kr.vercel.app/) to demonstrate how quickly I got comfortable working with drizzle-orm

## Prisma is great but...
Like I said before I don't hate prisma. It's tooling is great. Amazing devX. Although not focusing on performance in this article, it definitely is a popular choice. However in comparison to drizzle-orm I most certainly think that drizzle offers a even better devX in terms of ease of use, amazing type safety and a tremendous speed.

The major problem with prisma for me is the learning curve. It is a bit high for me yet quick to get there. Writing your schema in `.prisma` SDL is something I would not prefer when you have drizzle that lets you to define your schemas in plain typescript 

> Note: If you are looking to get started with drizzle-orm. Check out their docs and try it in your sample project and come back here. I will be starting the demos without the setup and quick starts. Also this blog doesn't focus too much on the tooling such as 'drizzle-kit' and 'drizzle-studio'.

## First Schema 
I use [PlanetScale's](https://planetscale.com/) mysql database in my project. So all the schemas are specific to PlanetScale's requirements.
In my project the first table I created in my database is `spaces`. With `drizzle-orm` you can do that by creating a file called `./db/schemas/spaces.ts`

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
The above code creates a table called `spaces` with the help `mysqlTable` from `mysql-core` package which takes a record of items to make columns for the table

> Drizzle also offers core packages that support other database drivers such as postgress,mongo etc

As you can see it's just plain typescript with rich object oriented flavours. So easy and no need for you to learn a new language besides the one you already know.

Obviously there is a bit of learning that you need  to do but as far I am concerned I was able to do that in my editor (VS Code) with type completions and type definitions. So I felt it was a great improvement compared to prisma where I needed to know the syntactic sugars of the language.

## Querying
Ultimately any good ORM should offer the same seamless experience you get with writing your schemas when it comes to writing queries. 

Drizzle did not disappoint me in that area too. Learning to write queries felt like learning numbers in German (which is the easiest of all).

To get all spaces of an user you can do 

```ts
const spaces = await db.query.spaces.findMany({
    where: eq(spaces.owner,"vj")
})
```
Here inside the `where` clause I've used a function `eq`. `eq` is one of the many utility methods provided by drizzle to write neat operators inside where clause.

You can also use the other variant `select` instead of `query` which feels more like writing SQL in typescript

```ts
const spaces = await db.select().from(spaces).where(eq(spaces.owner,user.id))
```

With `select` you have the option to select only the fields your need from the table by doing
```ts
const spaces = await db
    .select({
        name:spaces.name
    })
    .from(spaces)
    .where(eq(spaces.owner,"vj"));
```

> Majority of my queries were using `select`. At first I did miss the ability to [**include relations**](#including-relations)  with `select`. However I later realized that is a valid limitation with respect to the design of the ORM

## Insert
Insert is no different from queries. You can simply write

```ts
const result = await db.insert(spaces).values({
    name,
    owner,
    createdAt,
});
```

The insert operation returns a result with the `insertedId` which is helpful for routing. So that is nice 

## Update
Update is again a cake walk

```ts
const result = await db.update(spaces).set({
    name,
    updatedAt
}).where(eq(spaces.id,"1"));
```

I'll save some time by skipping [**delete**](https://orm.drizzle.team/docs/delete). By now you know how simple it is

> All the CRUD operations have their own functional features with respect to the database you are using. So do check the drizzle docs to learn more about driver specific features.

## Typescript magic
So far you saw how simple it was to perform CRUD on a table with great completions. However I missed a important thing to cover in the previous sections `type safety`. 

Drizzle offers great utilities for you to expose the type information of schemas by doing the following.

```ts
 export const spaces = mysqlTable("spaces", {
  id: serial("id").primaryKey().autoincrement(),
  // ...
 })

 // This my personal preferance when it comes to naming the types.
 export type Select_Space = typeof spaces.$inferSelect;
 export type Insert_Space = typeof spaces.$inferInsert;
```
Learn more about the type api [here](https://orm.drizzle.team/docs/goodies#type-api)

Drizzle uses the inference nature of typescript to create a solid type definitions for your tables. These exposed types will be useful for casting types into your business logic. The `Insert_Space` is smart enough to know which fields are optional so when you use it in a function say `createSpace`

```ts
 function createSpace(row:Insert_Space){
  const result = await db.insert(spaces).values(row)
 }
```
you get the best type information that you need for the parameter `row`. Since `id` has `auto_increment` constraint it's optional. So `Insert_Space` knows it's optional. Pretty cool isn't ? 🤓

If you look at this inference pattern more closely you will see a glimpse of [**zod**](https://zod.dev/) in it. We all know how great **zod** is 🤓

## Working with Relationships

Relationships are hard to make and maintain. Hey wait I meant in the database world (not in real life). The standout feature of drizzle for me is the [**relationship**](https://orm.drizzle.team/docs/rqb#declaring-relations) model. 

Unlike prisma you are going to write typescript and not **.prisma SDL** so naturally it felt so much easier for me to create relationships in drizzle

Honestly I struggled a lot with prisma to model my relationships. At first it felt so much harder to comprehend the relationships between models in prisma schema. It still is by the way.

However in drizzle you don't define relationships as another entity in your database but rather as an abstraction. They act as door hatch that connects multiple levels of rooms

### One to Many
**One to many** or **Many to one** is the simplest form of relationship you can create with drizzle. In my project I created the first **one to many** relationship between `spaces` and new table called `projects`. 

A space can have many `projects` and a project belongs to only one `space`. A classic one to many relationship. With drizzle you can do this by using the `relations` utility.

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

I define `projectToSpaceRelations` that creates the relationship between `spaces` and `projects` table. 

The method `relations` takes the table `projects` as first argument and a callback as second. The callback is supplied with various ways with which you can form your relationships (one,many). I use the function `one` to create a relationship called `space` which indicates that one record from `spaces` table referenced by the field `spaces.id` is connected to the `projects` table using the field `projects.space_id`

```ts
  export const spaceToProjectsRelation = relations(spaces,({many})=>({
   projects:many(projects)
  }));   
```

Similarly in `spaceToProjectsRelation`  'many' utility creates a relationship between `spaces` and `projects` denoting that a space can have many projects belonging to it

> NOTE: One to one is also made using the same approach by using the "one" utility on both sides

### Many to Many
Building **Many to Many** relationship is quite different from One to One or One to Many

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

So both relations i.e `usersRelation` and `projectsRelations` uses the join table `usersToProjects` to represent this many to many relationship between `users` and `projects`. However `usersToProjectsRelation` has only one to one mapping to `projects` and `users`.

So this will enable you to query  projects with all its members by doing
```ts
  const projectWithMembers = await db.query.projects.findMany({
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
Self relations are also possible in drizzle. You will need to create self relations when a table relies on itself to express a parent child relationship.

For instance , in my project I have a table called `tasks`. Each **task** can have many number of **substasks**. This can be expressed by making `tasks` rely on itself because a `subTask` is nothing but a `task` with only one difference `parentTask` field which is needed only for `subTask`. For this case I needed to create **one to many** self relations

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
Notice how `parentTask` and `subTasks` takes leverage of **relationName** `subTasks` on both sides to achieve this self one to many relationship pattern. 

> This pattern of self relations is not documented with an example in drizzle docs. I used this discord [thread](https://discord.com/channels/1043890932593987624/1173896750663213066/1173896750663213066) to learn more about one to many self relations

`relationName` is used to disambiguate relations from one another. You can learn more about **Disambiguating relations** [here](https://orm.drizzle.team/docs/rqb#disambiguating-relations)

### Foreign Keys
There is also another way of making relationships between tables which is using foreign keys pattern.

```ts
  export const projects = mysqlTable("projects", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }).notNull(),
    space_id: bigint("space_id").references(()=>spaces.id),
    // ...
  });  
```
Using the `references` utility you add a foreign key constraint using the field `space_id` which is useful for performing cascade actions. You can learn more about that [here](https://orm.drizzle.team/docs/rqb#foreign-keys)

> NOTE: Foreign keys are not [allowed](https://planetscale.com/docs/learn/operating-without-foreign-key-constraints#why-does-planetscale-not-recommend-constraints) in PlanetScale. So you should avoid using `references` when using drizzle with PlanetScale otherwise you will run into migration problems.

### Including relations
> Drizzle states that the relationships created using `relations` are just an abstraction you need to make your life easier and doesn't do anything to your database schema (except adding foreign key constraint when `references` is used).

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

## Flavours of SQL
Drizzle also lets you write raw SQL queries using the magic `sql` [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)

This is my favorite feature of drizzle. I was able to write complex aggregated joined queries with the help of `sql` function. For instance you can use the `sql` templates to write queries like  

```ts
   db.select({
    count:sql<number>`count(*)`
    name:projects.name
   })
   .from(projects)
```
This is a simple and not so much useful example. A complex query could look like
```ts
const result = await db
      .select({
        milestone: milestones,
        tasksCount: sql<number>`count(${tasks.id})`.mapWith(Number),
        progress:
          sql<number>`(sum(case when ${tasks.status}='done' then 1 else 0 end)*100/count(${tasks.id})) as percentage`.mapWith(
            Number
          ),
      })
      .from(milestones)
      .leftJoin(tasks, eq(tasks.milestoneId, milestones.id))
      .groupBy(milestones.id)
      .where(
        and(eq(milestones.projectId, projectId), keywordFilter, statusFilter)
      );

```
The above query joins two tables `milestones` and `tasks` by using a common field. The **select** statement produces **tasksCount** and **progress** of the milestone using the result of `sql` templates.
 
## Migration
Migration is a critical aspect when working with evolving database schemas. They have to be sequential and distributed well within your team. So any good ORM tool will also provide utilities for you to manage and maintain your migrations well.

Prisma provides **prisma-migrate** a solid tool that lets you do migrations quite well. Drizzle also has a great migration tool offered [drizzle-kit](https://orm.drizzle.team/kit-docs/overview) that lets you run migration smoothly.

### Make migrations
To generate a new migration using drizzle-kit you need to run the following command

`npx drizzle-kit generate:mysql --config=drizzle.config.ts`

The config file depends on your environment variables and setup. My config file looks like this

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

The above command will create **.sql** file with random file name in your migrations folder which you can run to apply the migration

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

In my project I am using [**PlanetScale**] as my database. So drizzle provides platform specific options to run migrations using migrate function. The `migrate.ts` file in my project is the following

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

Dropping migrations is very important for roll backs. Drizzle also tells you not to manually delete any .sql files but use drop utility to make the migration process smoother.

## Conclusion

So far in my project the experience I got with drizzle has been superb. Even though I am the only person working on this hobby project, I can greatly see the benefits of **drizzle-orm** scaling well in bigger teams. This article only covers a handful of many many awesome features drizzle offers. Tools like [drizzle-studio](https://orm.drizzle.team/drizzle-studio/overview) which I haven't covered in this article is amazing as well. So do yourself a favour by including drizzle in your stack and have a great database experience.
