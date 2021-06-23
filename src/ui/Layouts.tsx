import React from 'react';
import Icon from './Icon';

export const horizontalLayouts = [
  {
    label: 'Yksijakoinen',
    options: [
      {
        value: '1',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label">4</span>
          </>
        ),
      },
      {
        value: '2',
        label: (
          <>
            <Icon img="layout2" height={90} width={160} />
            <span className="label">8</span>
          </>
        ),
      },
      {
        value: '3',
        label: (
          <>
            <Icon img="layout3" height={90} width={160} />
            <span className="label">12</span>
          </>
        ),
      },
    ],
  },
  {
    label: 'Kaksijakoinen',
    options: [
      {
        value: '4',
        label: (
          <>
            <Icon img="layout4" height={90} width={160} />
            <span className="label">4+4</span>
          </>
        ),
      },
      {
        value: '5',
        label: (
          <>
            <Icon img="layout5" height={90} width={160} />
            <span className="label">8+8</span>
          </>
        ),
      },
      {
        value: '6',
        label: (
          <>
            <Icon img="layout6" height={90} width={160} />
            <span className="label">12+12</span>
          </>
        ),
      },
    ],
  },
  {
    label: 'Kaksijakoinen yhdistelmä',
    options: [
      {
        value: '7',
        label: (
          <>
            <Icon img="layout7" height={90} width={160} />
            <span className="label">4+8</span>
          </>
        ),
      },
      {
        value: '8',
        label: (
          <>
            <Icon img="layout8" height={90} width={160} />
            <span className="label">8+12</span>
          </>
        ),
      },
    ],
  },
  {
    label: 'Itään / länteen',
    options: [
      {
        value: '9',
        label: (
          <>
            <Icon img="layout9" height={90} width={160} />
            <span className="label">4+4</span>
          </>
        ),
      },
      {
        value: '10',
        label: (
          <>
            <Icon img="layout10" height={90} width={160} />
            <span className="label">8+8</span>
          </>
        ),
      },
      {
        value: '11',
        label: (
          <>
            <Icon img="layout11" height={90} width={160} />
            <span className="label">12+12</span>
          </>
        ),
      },
    ],
  },
];

export const verticalLayouts = [
  {
    label: 'Yksijakoinen',
    options: [
      {
        value: '12',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label">8</span>
          </>
        ),
      },
      {
        value: '13',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label">12</span>
          </>
        ),
      },
      {
        value: '14',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label">24</span>
          </>
        ),
      },
    ],
  },
  {
    label: 'Yksijakoinen yhdistelmä',
    options: [
      {
        value: '15',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label">4+6</span>
          </>
        ),
      },
      {
        value: '16',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label">6+12</span>
          </>
        ),
      },
      {
        value: '17',
        label: (
          <>
            <Icon img="layout1" height={90} width={160} />
            <span className="label">2+4+12</span>
          </>
        ),
      },
    ],
  },
];
