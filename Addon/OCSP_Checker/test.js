const Jasmine = require('jasmine')
const JasmineConsoleReporter = require('jasmine-console-reporter')

const jasmine = new Jasmine()
const reporter = new JasmineConsoleReporter({
    colors: 1,
    cleanStack: 1,
    verbosity: 4,
    listStyle: 'indent',
    activity: false
})

jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
        '**/*Spec.js'
    ]
})

jasmine.addReporter(reporter)

jasmine.execute()