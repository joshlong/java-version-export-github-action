/**
 * Uses Bruno Borges' brilliant hack to extract a property from a Maven `pom.xml` and export it to an environment variable
 * or property that other things, like the `setup-java` Github Action, can use.
 *
 * @author Josh Long
 */
/* see: https://github.com/actions/toolkit */
const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");

function cmd(cmd, args, stdoutListener) {
  exec
    .exec(cmd, args, {
      listeners: {
        stdout: stdoutListener,
      },
    })
    .then((ec) => {
      console.log("the result is " + ec);
    });
}

try {
  args = ["help:evaluate", "-q", "-DforceStdout", "-Dexpression=person.name"];

  cmd("mvn", args, (output) => {
    console.log("name: " + output);
  });
  cmd("mvn", args, (outputBuffer) => {
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
  });
} catch (error) {
  core.setFailed(error.message);
}
