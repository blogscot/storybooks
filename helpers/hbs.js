const marked = require('marked')
const moment = require('moment')

marked.setOptions({
  smartypants: true,
})

module.exports = {
  truncate: (str, len) => {
    if (str.length > 0 && str.length > len) {
      let newStr = str + ' '
      newStr = str.substr(0, len)
      const upToLastSpace = str.substr(0, newStr.lastIndexOf(' '))
      newStr = newStr.length > 0 ? upToLastSpace : newStr
      return newStr + '...'
    }
    return str
  },
  stripTags: http => http.replace(/<(?:.|\n)*?>/gm, ''),
  convertMarkdown: contents => marked(contents),
  formatDate: (date, format) => moment(date).format(format),
  select: function(selected, options) {
    return options
      .fn(this)
      .replace(new RegExp(` value="${selected}"`), '$& selected="selected"')
      .replace(new RegExp(`>${selected}</option>`), 'selected="selected"$&')
  },
}
