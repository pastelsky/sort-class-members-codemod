## sort-class-members-codemod 
[![Build Status](https://travis-ci.org/pastelsky/sort-class-members-codemod.svg)](https://travis-ci.org/pastelsky/sort-class-members-codemod) [![npm (scoped)](https://img.shields.io/npm/v/sort-class-members-codemod.svg)](https://www.npmjs.com/package/sort-class-members-codemod)
[![npm](https://img.shields.io/npm/l/sort-class-members-codemod.svg)](https://www.npmjs.com/package/sort-class-members-codemod)

This repository contains a codemod script for fixing ordering of ES6 class members as defined by the [eslint-plugin-sort-class-members](https://github.com/bryanrsmith/eslint-plugin-sort-class-members) plugin. 


### Setup & Run

  * Install [`jscodeshift`](https://github.com/facebook/jscodeshift) globally (or as a local dependency if you like)
   `npm install -g jscodeshift`
  * Install the codemod `yarn add --dev sort-class-members-codemod`
  * `jscodeshift -t node_modules/sort-class-members-codemod/index <path-of-file-to-fix>`
  * You can also use the `-d` option for a dry-run and `-p` to print the output
    for comparison

### TODO
- [ ] Fix ordering of `accessorPairs`
- [ ] Moaar tests!
