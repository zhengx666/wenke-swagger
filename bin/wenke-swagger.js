#!/usr/bin/env node

const wenkeSwagger = require("..");
const program = require('commander');

program.usage('[dir] [options]')
    .option('-s, --static-files-directory [static files directory]\', \'static files directory');

program.parse(process.argv);

wenkeSwagger(program);