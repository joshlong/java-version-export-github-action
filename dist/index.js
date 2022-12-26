/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 320:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 219:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 280:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
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
const core = __nccwpck_require__(320);
const github = __nccwpck_require__(280);
const exec = __nccwpck_require__(219);

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
} 
catch (error) {
  core.setFailed(error.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;