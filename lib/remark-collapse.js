//
// Modified from npm package `mdast-util-heading-range`
// 
//
const headingRange = require('./heading-range')
const toString = require('./to-string')

function getMeta(node) {
  const result = toString(node).match(/^\s*(\-|\+)\s*([\w\W]*)$/)
  const firstText = node.children[0].value
  const newNode = {...node}
  newNode.children[0].value = firstText.slice(1, firstText.length, '') // remove '-'/'+' in the heading
  return {
    isOpen: result[1] == '-',  // '-' for open details, '+' for closed.
    htmlSummary: newNode,      // html summary
    textSummary: result[2],    // only text summary
  }
}

module.exports = function (opts) {
  if (opts == null || opts.test == null) throw new Error('options.test must be given')

  return function (node) {
    let startIndex = -1
    while (startIndex < node.children.length) {
      startIndex = headingRange(node, { test: opts.test, index: startIndex }, function (start, nodes, end) {
        const meta = getMeta(start)
        return [
          {
            type: 'paragraph',
            children: [
              {
                type: 'html',
                value: `<details ${meta.isOpen ? 'open': ''} class='toggle-section-details'>`
              },
              {
                type: 'html',
                value: '<summary>'
              },
              opts.textSummary ? {
                type: 'text',
                value: meta.textSummary
              } : meta.htmlSummary,
              {
                type: 'html',
                value: '</summary>'
              }
            ]
          },
          ...nodes,
          {
            type: 'paragraph',
            children: [
              {
                type: 'html',
                value: '</details>'
              }
            ]
          },
          end
        ]
      })
      startIndex ++
    }
  }
}
