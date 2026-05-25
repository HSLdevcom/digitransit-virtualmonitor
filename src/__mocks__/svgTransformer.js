'use strict';

const path = require('path');

// Jest transform for SVG files.
// Renders a <svg> whose text content is the basename of the file (e.g.
// "arrow-down.svg"). This preserves CRA-style assertions such as
// getByText('arrow-down.svg') while also supporting the named
// import { ReactComponent as X } from './x.svg' pattern.
module.exports = {
  process(_src, filename) {
    const basename = JSON.stringify(path.basename(filename));
    return {
      code: `
        const React = require('react');
        const Svg = props => React.createElement('svg', props, ${basename});
        exports.ReactComponent = Svg;
        exports.default = Svg;
        module.exports = Svg;
        module.exports.ReactComponent = Svg;
        module.exports.default = Svg;
      `,
    };
  },
};
