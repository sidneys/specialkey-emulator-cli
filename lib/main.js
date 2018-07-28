#!/usr/bin/env node
'use strict'


/**
 * Modules
 * Node
 * @constant
 */
const { execFile } = require('child_process')
const path = require('path')

/**
 * Modules
 * External
 * @constant
 */
const appRootPath = require('app-root-path')
appRootPath.setPath(path.join(__dirname, '..'))
const chalk = require('chalk')
const logger = require('@sidneys/logger')({ write: true })
const minimist = require('minimist')
const specialkeyEmulator = require('specialkey-emulator')

/**
 * Modules
 * Internal
 * @constant
 */
const help = require(path.join(appRootPath.path, 'lib', 'help'))
const packageJson = require(path.join(appRootPath.path, 'package.json'))


/**
 * Log prefix
 * @constant
 */
const logPrefix = chalk['bold']['cyan'](`[${packageJson.name}]`)
const errorPrefix = chalk['bold']['red'](`[${packageJson.name}]`)


/**
 * Commandline interface
 */
if (require.main === module) {
    // Parse arguments
    let argv
    try {
        argv = minimist(process.argv.slice(2), {
            'boolean': ['help', 'version']
        })
    } catch (error) {}

    // DEBUG
    logger.debug('argv', argv)

    // Help
    const argvHelp = argv['help']
    if (argvHelp) {
        help.print()
        process.exit(0)
    }

    // Version
    const argvVersion = argv['version']
    if (argvVersion) {
        console.log(logPrefix, `v${packageJson.version}`)
        process.exit(0)
    }

    // keyName
    const argvKeyname = argv['_'][0]
    if (!argvKeyname) {
        console.log(errorPrefix, `Key Name required.`)
        process.exit(0)
    }
    

    // Run
    specialkeyEmulator(argvKeyname, (error, result) => {
        if (error) {
            console.log(errorPrefix, 'Aborting.')
            process.exit(1)

            return
        }

        if (result) {
            console.log(result)
        }

        process.exit(0)
    })
}