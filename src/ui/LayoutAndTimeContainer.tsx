import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import Dropdown from './Dropdown';
import Icon from './Icon';
import './LayoutAndTimeContainer.scss';
import LayoutModal from './LayoutModal';
import { ICardInfo } from './CardInfo';

interface IProps {
  cardInfo: ICardInfo;
  updateCardInfo: Function;
}

const layouts = [
  {
    value: '1',
    label: (
      <>
        <Icon img="layout1" />
        <span className="label">4</span>
      </>
    ),
  },
  {
    value: '2',
    label: (
      <>
        <Icon img="layout2" />
        <span className="label">8</span>
      </>
    ),
  },
  {
    value: '3',
    label: (
      <>
        <Icon img="layout3" />
        <span className="label">12</span>
      </>
    ),
  },
  {
    value: '4',
    label: (
      <>
        <Icon img="layout4" />
        <span className="label">4+4</span>
      </>
    ),
  },
  {
    value: '5',
    label: (
      <>
        <Icon img="layout5" />
        <span className="label">8+8</span>
      </>
    ),
  },
  {
    value: '6',
    label: (
      <>
        <Icon img="layout6" />
        <span className="label">12+12</span>
      </>
    ),
  },
  {
    value: '7',
    label: (
      <>
        <Icon img="layout7" />
        <span className="label">4+8</span>
      </>
    ),
  },
  {
    value: '8',
    label: (
      <>
        <Icon img="layout8" />
        <span className="label">8+12</span>
      </>
    ),
  },
  {
    value: '9',
    label: (
      <>
        <Icon img="layout9" />
        <span className="label">4+4</span>
      </>
    ),
  },
  {
    value: '10',
    label: (
      <>
        <Icon img="layout10" />
        <span className="label">8+8</span>
      </>
    ),
  },
  {
    value: '11',
    label: (
      <>
        <Icon img="layout11" height={36} width={64} />
        <span className="label">12+12</span>
      </>
    ),
  },
];

const times = [
  { value: '3', label: '3s' },
  { value: '5', label: '5s' },
  { value: '10', label: '10s' },
  { value: '15', label: '15s' },
  { value: '20', label: '20s' },
  { value: '25', label: '25s' },
  { value: '30', label: '30s' },
];

const LayoutAndTimeContainer: FC<IProps & WithTranslation> = ({ cardInfo, updateCardInfo }) => {
  const placeHolder = times.find(time => time.value === cardInfo.time.toString()).label;
  const layout = layouts.find(layout => layout.value === cardInfo.layout.toString());
  const layoutButton = layout.label;
  
  const [isOpen, changeOpen] = useState(false);
  //const [layout, setLayout] = useState();

  const setOpen = () => {
    changeOpen(true);
  };

  const getLayout = option => {
    if (updateCardInfo) {
      updateCardInfo(cardInfo.id, 'layout', option.value.toString());
    }
    changeOpen(false);
    //setLayout(layouts[option.value - 1]);
  };

  const handleChange = option => {
    if (updateCardInfo) {
      updateCardInfo(cardInfo.id, 'time', option.value);
    }
  };

  return (
    <div className="layout-and-time-container">
      <div role="button" onClick={setOpen}>
        <button className="layout-button" name="layout">
          {layoutButton}
        </button>
      </div>
      <div>
        <Dropdown
          name="time"
          isSearchable={false}
          options={times}
          placeholder={placeHolder}
          handleChange={handleChange}
        />
      </div>
      <LayoutModal isOpen={isOpen} option={layout} onClose={getLayout} />
    </div>
  );
};

export default withTranslation('translations')(LayoutAndTimeContainer);
