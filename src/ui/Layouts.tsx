import React from 'react';
import Icon from './Icon';

export const horizontalLayouts = [
  {
    label: 'one-column',
    options: [
      {
        value: '1',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label">4</span>
          </>
        ),
        rows: '4',
      },
      {
        value: '2',
        label: (
          <>
            <Icon img="layout2" height={90} width={160} />
            <span className="label">8</span>
          </>
        ),
        rows: '8',
      },
      {
        value: '3',
        label: (
          <>
            <Icon img="layout3" height={90} width={160} />
            <span className="label">12</span>
          </>
        ),
        rows: '12',
      },
    ],
  },
  {
    label: 'two-columns',
    options: [
      {
        value: '4',
        label: (
          <>
            <Icon img="layout4" height={90} width={160} />
            <span className="label">4+4</span>
          </>
        ),
        rows: '4+4',
      },
      {
        value: '5',
        label: (
          <>
            <Icon img="layout5" height={90} width={160} />
            <span className="label">8+8</span>
          </>
        ),
        rows: '8+8',
      },
      {
        value: '6',
        label: (
          <>
            <Icon img="layout6" height={90} width={160} />
            <span className="label">12+12</span>
          </>
        ),
        rows: '12+12',
      },
    ],
  },
  {
    label: 'two-columns-combo',
    options: [
      {
        value: '7',
        label: (
          <>
            <Icon img="layout7" height={90} width={160} />
            <span className="label">4+8</span>
          </>
        ),
        rows: '4+8',
      },
      {
        value: '8',
        label: (
          <>
            <Icon img="layout8" height={90} width={160} />
            <span className="label">8+12</span>
          </>
        ),
        rows: '8+12',
      },
    ],
  },
  {
    label: 'layoutEastWest',
    options: [
      {
        value: '9',
        label: (
          <>
            <Icon img="layout9" height={90} width={160} />
            <span className="label">4+4</span>
          </>
        ),
        rows: '4+4',
      },
      {
        value: '10',
        label: (
          <>
            <Icon img="layout10" height={90} width={160} />
            <span className="label">8+8</span>
          </>
        ),
        rows: '8+8',
      },
      {
        value: '11',
        label: (
          <>
            <Icon img="layout11" height={90} width={160} />
            <span className="label">12+12</span>
          </>
        ),
        rows: '12+12',
      },
    ],
  },
];

export const verticalLayouts = [
  {
    label: 'simple',
    options: [
      {
        value: '12',
        label: (
          <>
            <Icon img="layout12" height={160} width={90} />
            <span className="label">8</span>
          </>
        ),
        rows: '8',
      },
      {
        value: '13',
        label: (
          <>
            <Icon img="layout13" height={180} width={90} />
            <span className="label">12</span>
          </>
        ),
        rows: '12',
      },
      {
        value: '14',
        label: (
          <>
            <Icon img="layout14" height={180} width={90} />
            <span className="label">16</span>
          </>
        ),
        rows: '16',
      },
      {
        value: '15',
        label: (
          <>
            <Icon img="layout15" height={160} width={90} />
            <span className="label">24</span>
          </>
        ),
        rows: '24',
      },
    ],
  },
  {
    label: 'tighten',
    options: [
      {
        value: '16',
        label: (
          <>
            <Icon img="layout16" height={160} width={90} />
            <span className="label">4+6</span>
          </>
        ),
        rows: '4+6',
      },
      {
        value: '17',
        label: (
          <>
            <Icon img="layout17" height={160} width={90} />
            <span className="label">6+12</span>
          </>
        ),
        rows: '6+12',
      },
    ],
  },
];
