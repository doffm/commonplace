###
Minifying, documentation generation, and testing depend on:

    "coffee-script"
    "docco"
    "expresso"
    "uglify-js"
###

fs      = require 'fs'
path    = require 'path'
cp      = require 'child_process'

task 'lint', 'run jslint over the source', ->
    files = fs.readdirSync 'scripts'
    files = ('scripts/' + file for file in files when file.match(/\.js$/))
    proc = cp.spawn 'jsl', ['-process',].concat(files)
    proc.stdout.on 'data', (buffer) -> console.log buffer.toString()
    proc.on        'exit', (status) -> process.exit(1) if status != 0
