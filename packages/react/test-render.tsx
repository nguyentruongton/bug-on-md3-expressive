import React from 'react';
import { renderToString } from 'react-dom/server';
import VerticalMenuGapDemo from '../../apps/docs/registry/demos/vertical-menu-gap-demo';

console.log(renderToString(<VerticalMenuGapDemo />));
