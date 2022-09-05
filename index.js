/**
 *
 * Uses <a href="http://twitter.com/brunoborges">Bruno Borges'</a> brilliant
 * <a href="https://twitter.com/brunoborges/status/1565783443216416768?s=21&t=EoHl3kqopkK5pry-VVsSZA">hack</a> to extract a property
 * from a Maven `pom.xml` and export it to an environment variable
 * or property that other things, like the `setup-java` Github Action, can use.
 *
 * @author Josh Long
 */
/* see: https://github.com/actions/toolkit */
const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");

/**
 * makes it a little more clean to exec something. make sure to redirect all other file descripters to stdout!
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
  cmd(
    "mvn",
    [
      "help:evaluate",
      "-q",
      "-DforceStdout",
      "-Dexpression=maven.compiler.target",
    ],
    // ["help:evaluate", "-q", "-DforceStdout", "-Dexpression=java.version"],
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
} catch (error) {
  core.setFailed(error.message);
}
