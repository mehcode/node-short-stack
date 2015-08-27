var _ = require("lodash")

module.exports = function(options) {
  var async = options.async == null ? true : !!options.async
  var builtin = options.builtin == null ? false : !!options.builtin
  var include = options.include || []
  var exclude = options.exclude || []

  if (async) {
    require("stackup")
  }

  var prepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = function(error, stack) {
    var text = prepareStackTrace(error, stack)
    var lines = text.split("\n")
    lines = _.filter(lines, function(line) {
      line = line.trim()
      if (!_.startsWith(line, "at")) return true

      var match = line.match(/\s*\((.*)\)\s*$/)
      if (match == null) return true

      var filename = match[1]

      if (!_.startsWith(filename, "/")) {
        return !builtin
      }

      for (let entry of include) {
        if ((new RegExp(entry)).exec(filename)) {
          return true
        }
      }

      for (let entry of exclude) {
        if ((new RegExp(entry)).exec(filename)) {
          return false
        }
      }

      return include.length === 0
    })

    return lines.join("\n")
  }
}
