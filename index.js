/**
 * Uses Bruno Borges' brilliant hack to extract a property from a Maven `pom.xml` and export it to an environment variable
 * or property that other things, like the `setup-java` Github Action, can use.
 *
 * @author Josh Long
 */
// https://github.com/actions/toolkit
const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");

// todo analyze the incoming event payload and then set BP_MODE to be something useful
try {
  const toEval =
    "mvn help:evaluate -Dexpression=java.version -q -DforceStdout ";
  console.log(toEval);
  const result = await exec.exec("mvn", [
    "help:evaluate",
    "-q",
    "-DforceStdout",
    "-Dexpression=java.version",
  ]);
  console.log("the result is " + result);
  core.exportVariable("MAVEN_PROPERTY_EVALUATION", bpMode.toUpperCase());
} catch (error) {
  core.setFailed(error.message);
}
