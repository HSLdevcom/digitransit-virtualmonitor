import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import Dropdown from './Dropdown';
import Icon from './Icon';
import './LayoutAndTimeContainer.scss';
import LayoutModal from './LayoutModal';
import { ICardInfo } from './CardInfo';

interface IProps {
  cardInfo: ICardInfo;
  updateCardInfo: (cardId: number, type: string, value: string) => void;
}

const layouts = [
  {
    value: '1',
    label: (
      <>
        <Icon img="layout1" height={36} width={64} />
        <span className="label">4</span>
      </>
    ),
  },
  {
    value: '2',
    label: (
      <>
        <Icon img="layout2" height={36} width={64} />
        <span className="label">8</span>
      </>
    ),
  },
  {
    value: '3',
    label: (
      <>
        <Icon img="layout3" height={36} width={64} />
        <span className="label">12</span>
      </>
    ),
  },
  {
    value: '4',
    label: (
      <>
        <Icon img="layout4" height={36} width={64} />
        <span className="label">4+4</span>
      </>
    ),
  },
  {
    value: '5',
    label: (
      <>
        <Icon img="layout5" height={36} width={64} />
        <span className="label">8+8</span>
      </>
    ),
  },
  {
    value: '6',
    label: (
      <>
        <Icon img="layout6" height={36} width={64} />
        <span className="label">12+12</span>
      </>
    ),
  },
  {
    value: '7',
    label: (
      <>
        <Icon img="layout7" height={36} width={64} />
        <span className="label">4+8</span>
      </>
    ),
  },
  {
    value: '8',
    label: (
      <>
        <Icon img="layout8" height={36} width={64} />
        <span className="label">8+12</span>
      </>
    ),
  },
  {
    value: '9',
    label: (
      <>
        <Icon img="layout9" height={36} width={64} />
        <span className="label">4+4</span>
      </>
    ),
  },
  {
    value: '10',
    label: (
      <>
        <Icon img="layout10" height={36} width={64} />
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

const durations = [
  { value: '3', label: '3s' },
  { value: '5', label: '5s' },
  { value: '10', label: '10s' },
  { value: '15', label: '15s' },
  { value: '20', label: '20s' },
  { value: '25', label: '25s' },
  { value: '30', label: '30s' },
];

const LayoutAndTimeContainer: FC<IProps & WithTranslation> = ({
  cardInfo,
  updateCardInfo,
}) => {
  const placeHolder = durations.find(
    duration => duration.value === cardInfo.duration.toString(),
  ).label;
  const layout = layouts.find(
    layout => layout.value === cardInfo.layout.toString(),
  );
  const layoutButton = layout.label;

  const [isOpen, changeOpen] = useState(false);

  const setOpen = () => {
    changeOpen(true);
  };

  const getLayout = option => {
    if (updateCardInfo) {
      updateCardInfo(cardInfo.id, 'layout', option.value.toString());
    }
    changeOpen(false);
  };

  const handleChange = option => {
    if (updateCardInfo) {
      updateCardInfo(cardInfo.id, 'duration', option.value);
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
          name="duration"
          isSearchable={false}
          options={durations}
          placeholder={placeHolder}
          handleChange={handleChange}
        />
      </div>
      <LayoutModal isOpen={isOpen} option={layout} onClose={getLayout} />
    </div>
  );
};

export default withTranslation('translations')(LayoutAndTimeContainer);
