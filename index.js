/**
 * This Github Action will resolve all environment variables suffixed with one of the
 * two `BP_MODE` values (`DEVELOPMENT`, `PRODUCTION`) and will canonicalize them
 * based on what value the environment variable `BP_MODE` has.
 *
 * @author Josh Long
 */
const core = require('@actions/core');
const github = require('@actions/github');

// todo analyze the incoming event payload and then set BP_MODE to be something useful
try {

  function resolveGithubAction() {
    // we assume development by default; production only in
    // a very specific, purposeful scenario
    const {context} = require("@actions/github");
    if (context && context.payload && context.payload.action)
      return context.payload.action;
    return null
  }

  const action = resolveGithubAction();
  // console.log(action)
  // console.log(github.context)
  // console.log(github.context.payload)
  const bpMode = action === 'deploy-production-event' ? 'production' : 'development'

  core.exportVariable('BP_MODE', bpMode.toUpperCase())
  core.exportVariable('BP_MODE_LOWERCASE', bpMode.toLowerCase())

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  console.log('the BP_MODE is ' + bpMode)
  for (let k in process.env) {
    const isForThisEnvironment = k.toLowerCase().endsWith('_' + bpMode)
    if (isForThisEnvironment) {
      const sansSuffix = k.substring(0, k.length - (1 + bpMode.length))
      core.exportVariable(sansSuffix, process.env[k])
      console.log(`exporting ${sansSuffix} to have the value of ${k}`)
    }
  }
} catch (error) {
  core.setFailed(error.message);
}

