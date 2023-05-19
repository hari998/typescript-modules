# typescript-modules

npx tsc -p tsconfig.json

what happens when you want to write a library or package in TypeScript, yet ship JavaScript so that your end users don’t have to manually compile your code? And how do we author using modern JavaScript features like ES modules while still getting all the benefits of TypeScript?

This article aims to solve all these questions and provide you with a setup that’ll let you confidently write and share TypeScript libraries with an easy experience for the consumers of your package.

[Setting up our TypeScript project](#Setting-up-our-TypeScript-project)  
[Configuring tsconfig.json options](#Configuring-tsconfig.json-options)  
[What are Node modules?](#What-are-Node-modules?)  
[Choosing a module system](#Choosing-a-module-system)  
[TypeScript module exports](#TypeScript-module-exports)  
[How to import modules](#How-to-import-modules)  
[Creating our modules](#Creating-our-modules)  
[Compiling with TypeScript](#Compiling-with-TypeScript)  
[Publishing type definitions](#Publishing-type-definitions)  
[Publishing to CommonJS](#Publishing-to-CommonJS)  
[Preparing to publish our module](#Preparing-to-publish-our-module)

## Setting up our TypeScript project

1. create a basic math package , because it’ll let us demonstrate all the TypeScript we need

```
$ mkdir maths-package
$ cd maths-package
$ npm init -y
```

2. add dependency, TypeScript:

```
npm install --save-dev typescript
```

3. initialize a TypeScript project by running

```
npx tsc --init
```

---

## Configuring tsconfig.json options

## What are Node modules?

## Choosing a module system

decide which module system we’ll use for this project.  
Note that this isn’t which module system we’re going to author in, but which module system TypeScript’s compiler will use when it outputs the code.

when publishing modules is publish two versions:

A modern version with ES modules  
A version that uses CommonJS modules

_Later, we’ll look at how to bundle twice with different options_

for now, let’s configure TypeScript to output ES modules.  
set the module setting to ES20022 in tsconfig.json

## TypeScript module exports

existing approaches for exporting modules in TypeScript.

1. Default exports
   This provides the simplest approach to exporting a single value or function as the default export for a module by using the _export default_ keywords:

```
export default function add(a: number, b: number): number {
    return a + b;
}
```

2. Named exports
   With named exports, we can export multiple values or functions from a module using the keyword _export_ followed by the intended value or function:

```
const defaultGreet = "hello world";

function greet(name: string) {
    return `hello ${name}`;
}

export {defaultGreet, greet};
```

3. Using export = syntax

In TypeScript, we can target module systems that allow the overwriting of the _exports_ object. The module systems that allow overwriting are AMD and CommonJS, and we can achieve that by using the export = syntax:

```
interface MathFunc {
    divide(a: number, b: number): number;
    multiply(a: number, b: number): number;
}

const mathFunctions: MathFuncs = {
    divide: (a, b) => a/b
    multiply: (a, b) => a*b
}

export = mathFunctions;
```

4. Re-exports

We can export values or functions from existing modules by re-exporting them.  
This way, we can actually group and export as single module-related functionalities from multiple modules:

```
//math.ts
export function add(a: number, b: number): number {
    return a + b;
}

//utils.ts
export { add } from "./maths";
```

## How to import modules

1. Using import { x } from "path"
   This is used to import specific, named exports from an existing module. Let’s import the defaultGreet variable and greet function we defined previously:

```
import { defaultGreet, greet } from "path";

```

2. Using import \* as x from "path"
   This is used to import all exports within a module, and have it bundled under a single namespace. This way, we can reference each export using the dot notation:

```
import * as greetings from "path";
```

3. Using const x = require ("path")
   This import syntax is commonly used to import CommonJS modules within a Node.js environment:

```
const mathFunctions = require("path);
```

4. Using import x = require("path")
   This is used to import CommonJS modules using the TypeScript syntax. It is commonly used to provide compatibility between module systems that use the exports object for exporting:

```
import mathFunctions = require("path");
```

```
{"type": "module"} in pacakge.json
{module: "ES2022" or "CommonJS"}
Next, we have to decide which module system we’ll use for this project. Note that this isn’t which module system we’re going to author in, but which module system TypeScript’s compiler will use when it outputs the code
```

## Creating our modules

Before we can talk about bundling code, we need to write some! Let’s create two small modules that both export a function and a main entry file for our module that exports all our code

npx tsc -p tsconfig.json

This module should now be ready to publish onto npm for others to use, but first, we have two nice-to-have functionalities to add:

We’re not publishing any type information in our code. This doesn’t cause breakages for our users, but it’s a missed opportunity. If we publish our types, too, then people using an editor that supports TypeScript and/or people writing their apps in TypeScript will have a better experience  
Currently, we’re publishing an ES module, and it would be nice to include a CommonJS version of it for compatibility across different environments, like Node

## Publishing type definitions

We can provide the type information by asking TypeScript to _emit a declaration file_ alongside the code it writes. This file ends in _.d.ts_ and will contain type information about our code. Think of it like source code except that, rather than containing types and the implementation, it only contains the types.

now alongside js file , equivalent add.d.ts will be added

## Publishing to CommonJS

The final part of the puzzle is to also configure TypeScript to output a version of our code that uses CommonJS.  
We can do this by making two _tsconfig.json_ files, one that targets ES modules and another for CommonJS.  
we can override the modules setting.  
Let’s create tsconfig-cjs.json:

```
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "outDir": "./lib/cjs"
  },
}
```

Important part is the first line, which means this configuration inherits all settings from tsconfig.json by default.

## Preparing to publish our module

The last step is to tell Node and our users’ preferred bundlers how to bundle our code.  
The first property in _package.json_ we need to set is _main_. This is what defines our primary entry point. For example, when a user writes const _package = require('maths-package')_, this is the file that will be loaded.

To maintain good compatibility, I like to set this to the CommonJS source because, at the time of writing, that’s what most tools expect by default. So we’ll set this to ./lib/cjs/index.js

Next, we’ll set the module property. This is the property that should link to the ES modules version of our package. Tools that support this will be able to use this version of our package. So this should be set to ./lib/esm/index.js.

Next, we’ll add a files entry to our package.json. This is where we define all the files that should be included when we publish the module. I like to use this approach to explicitly define what files I want included in our final module when it’s pushed to npm.

This lets us keep the size of our module down — we won’t publish our src files, for example, and instead publish the lib directory. If you provide a directory in the files entry, all its files and subdirectories are included by default, so you don’t have to list them all.

_tip! If you want to see which files will be included in your module, run npx pkgfiles to get a list._

There’s just one last step. Because we are publishing the lib directory, we need to ensure that when we run npm publish, the lib directory is up to date. The npm documentation has a section about how to do just this — and we can use the prepublishOnly script. This script will be run for us automatically when we run npm publish:

_Note that there is also a script called prepublish, making it slightly confusing which to choose. The npm docs mention this: prepublish is deprecated, and if you want to run code only on publish, you should use prepublishOnly._



