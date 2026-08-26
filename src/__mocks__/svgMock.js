'use strict';
const path = require('path');

// Vitest mock for SVG files: returns a stub component that renders the filename as text
// so existing assertions like `getByText('arrow-down.svg')` continue to pass.
function makeSvgStub(filename) {
  function SvgStub(props) {
    // CJS-compatible object return — does not use JSX
    const React = require('react');
    return React.createElement('svg', props, filename);
  }
  SvgStub.displayName = 'SvgStub';
  return SvgStub;
}

// Default export is a generic stub; the plugin's load hook overrides this per-file.
const DefaultStub = makeSvgStub('svg');
module.exports = DefaultStub;
module.exports.ReactComponent = DefaultStub;
module.exports.default = DefaultStub;
module.exports.makeSvgStub = makeSvgStub;
