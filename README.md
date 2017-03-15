# sort-class-members-codemod 
[![Build Status](https://travis-ci.org/pastelsky/sort-class-members-codemod.svg)](https://travis-ci.org/pastelsky/sort-class-members-codemod) [![npm (scoped)](https://img.shields.io/npm/v/sort-class-members-codemod.svg)](https://www.npmjs.com/package/sort-class-members-codemod)
[![npm](https://img.shields.io/npm/l/sort-class-members-codemod.svg)](https://www.npmjs.com/package/sort-class-members-codemod)

This repository contains a codemod script for fixing ordering of ES6 class members defined when using the [eslint-plugin-sort-class-members](https://github.com/bryanrsmith/eslint-plugin-sort-class-members) plugin. 


## Setup

  * Install [`jscodeshift`](https://github.com/facebook/jscodeshift) globally (or as a local dependency if you like)
   
      ```bash
       npm install -g jscodeshift
      ```
  * Install the codemod 
 
     ```bash
    yarn add --dev sort-class-members-codemod
    ```

## Running
```bash
jscodeshift -t node_modules/sort-class-members-codemod/index <path-of-file-to-fix>
```

### Additional flags:

| Flag  | What it does  |
|---|---
| ` -d`  | Dry run codemods. Don't make any changes  |
| `-p`   | Print the output to stdout  |
| `--reactOnly`  | Only fix sorting errors in React Component `classes`  |
  
## Prior Art
 - [react-codemod](https://github.com/reactjs/react-codemod/blob/master/transforms/sort-comp.js)

## TODO
- [ ] Fix ordering of `accessorPairs`
- [ ] Moaar tests!
