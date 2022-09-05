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
try {
  const toEval =
    "mvn help:evaluate -Dexpression=java.version -q -DforceStdout ";
  console.log(toEval);
  const result = exec.exec(
    "mvn",
    ["help:evaluate", "-q", "-DforceStdout", "-Dexpression=java.version"],
    {
      listeners: {
        stdout: function (output) {
          const varsMap = new Map();
          varsMap.set("java_version", output);
          varsMap.set("java_major_version", parseInt(output) + "");
          varsMap.forEach(function (value, key) {
            console.log(key + "=" + value);
            core.setOutput(key, value);
            core.exportVariable(key.toUpperCase(), value);
          });
        },
      },
    }
  );
  result.then(function (exitCode) {
    console.log("the result is " + exitCode);
  });
} catch (error) {
  core.setFailed(error.message);
}
