# typescript-modules

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
