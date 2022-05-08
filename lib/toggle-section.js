'use babel';

import { markdownRenderer } from 'inkdrop';
import collapse from './remark-collapse';

class ToggleSection {
  constructor() {
    this.plugin = [collapse, { test: /^\s*(\-|\+)\s*([\w\W]*)$/, textSummary: false }]
  }
}

const ts = new ToggleSection()

module.exports = {

  activate() {
    if (markdownRenderer) {
      return markdownRenderer.remarkPlugins.push(ts.plugin);
    }
  },

  deactivate() {
    if (markdownRenderer) {
      markdownRenderer.remarkPlugins = markdownRenderer.remarkPlugins.filter(
        function(plugin) {
          return plugin !== ts.plugin
        }
      )
    }
  }

};
