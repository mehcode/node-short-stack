var _ = require("lodash")
var path = require("path")

module.exports = function(options) {
  var async = options.async == null ? true : !!options.async
  var builtin = options.builtin == null ? false : !!options.builtin
  var include = options.include || []
  var exclude = options.exclude || []
  var cwd = options.cwd

  if (cwd != null) {
    cwd = path.normalize(cwd)
    cwd = cwd.replace(/\//g, "\\/")
    cwd += "\/"
  }

  if (async) {
    // Push the event maxListeners to a high number
    require("events").EventEmitter.prototype._maxListeners = 1024
    require("stackup")
  }

  var prepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = function(error, stack) {
    var text = prepareStackTrace(error, stack)
    var lines = text.split("\n")

    lines = _.filter(lines, function(line) {
      line = line.trim()
      if (!_.startsWith(line, "at")) return true

      var filename = null
      if (_.startsWith(line, "at /")) {
        filename = line.split("at ")[1]
      } else {
        var match = line.match(/\s*\((.*)\)\s*$/)
        if (match == null) return true

        var filename = match[1]
      }

      if (!_.startsWith(filename, "/")) {
        return builtin
      }

      for (var entry of include) {
        if ((new RegExp(entry)).exec(filename)) {
          return true
        }
      }

      for (var entry of exclude) {
        if ((new RegExp(entry)).exec(filename)) {
          return false
        }
      }

      return include.length === 0
    })

    lines = _.map(lines, function(line) {
      return line.replace(new RegExp(cwd), "./")
    })

    var text = lines.join("\n")
    return text
  }
}
