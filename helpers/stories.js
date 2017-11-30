const marked = require('marked')

// Converts markdown text into http
const convertMarkdown = stories => {
  return stories.map(story => {
    story.contents = marked(story.contents)
    return story
  })
}

module.exports = convertMarkdown
