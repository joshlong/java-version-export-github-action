/**
 *
 * Uses <a href="http://twitter.com/brunoborges">Bruno Borges'</a> brilliant
 * <a href="https://twitter.com/brunoborges/status/1565783443216416768?s=21&t=EoHl3kqopkK5pry-VVsSZA">hack</a> to extract a property
 * from a Maven `pom.xml` and export it to an environment variable
 * or property that other things, like the `setup-java` GitHub Action, can use.
 *
 * @author Josh Long
 */
/* see: https://github.com/actions/toolkit */
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as exec from "@actions/exec";
import fs from "fs";

/**
 * makes it a little more clean to exec something. Make sure to redirect all other file descriptors to stdout!
 * @param {*} cmd
 * @param {*} args
 * @param {*} stdoutListener
 */
function cmd(cmd, args, stdoutListener) {
    exec
        .exec(cmd, args, {
            listeners: {
                stdout: stdoutListener,
            },
        })
        .then((ec) => {
            console.debug("the exit code is " + ec);
        });
}

try {
    const maven = fs.existsSync('pom.xml')
    const gradleGroovy = fs.existsSync('build.gradle')
    const gradleKotlin = fs.existsSync('build.gradle.kts')

    console.log(maven)
    console.log(gradleGroovy)
    console.log(gradleKotlin)

    if (maven) {
        const mavenExpression = core.getInput('maven-expression');
        const mavenCommand = core.getInput('maven-command');
        cmd(
            mavenCommand,
            [
                "help:evaluate",
                "-q",
                "-DforceStdout",
                `-Dexpression=${mavenExpression}`,
            ],
            (outputBuffer) => {
                const output = outputBuffer.toString();
                console.log(output);
                const varsMap = new Map();
                varsMap.set("java_version", output + "");
                varsMap.set("java_major_version", parseInt("" + output) + "");
                varsMap.forEach(function (value, key) {
                    console.log(key + "=" + value);
                    core.setOutput(key, value);
                    core.exportVariable(key.toUpperCase(), value);
                });
            }
        );
    } else {
        if (gradleGroovy || gradleKotlin) {
            cmd("./gradlew", [ ':properties','--property','sourceCompatibility' ], outputBuffer => {
                const buff = outputBuffer.toString();
                if (buff.indexOf('sourceCompatibility') !== -1) {
                    console.log('sourceCompatibility: ' + buff)
                } else {
                    console.log('nope!')
                }
            });
        }
    }
} catch (error) {
    core.setFailed(error.message);
}

