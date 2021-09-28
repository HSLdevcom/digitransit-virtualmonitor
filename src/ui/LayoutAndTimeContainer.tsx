import React, { FC, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { verticalLayouts, horizontalLayouts } from './Layouts';
import Dropdown from './Dropdown';
import LayoutModal from './LayoutModal';
import { ICardInfo } from './CardInfo';

interface IProps {
  cardInfo: ICardInfo;
  updateCardInfo: (cardId: number, type: string, value: string) => void;
  orientation: string;
  durationEditable: boolean;
}

const durations = [
  { value: 3, label: '3s' },
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 15, label: '15s' },
];

const LayoutAndTimeContainer: FC<IProps & WithTranslation> = ({
  cardInfo,
  updateCardInfo,
  orientation,
  durationEditable,
}) => {
  const placeHolder = durations.find(
    duration => duration.value === cardInfo.duration,
  ).label;
  const layoutRows =
    orientation === 'horizontal' ? horizontalLayouts : verticalLayouts;
  const layouts = [];
  layoutRows.forEach(row => layouts.push(...row.options));

  let layout = layouts.find(l => l.value === cardInfo.layout.toString());
  if (!layout) {
    layout = layouts[0];
  }
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
      <div className="duration">
        <Dropdown
          name="duration"
          isSearchable={false}
          options={durations}
          placeholder={!durationEditable ? '-' : placeHolder}
          handleChange={handleChange}
          isDisabled={!durationEditable}
        />
      </div>
      <LayoutModal
        orientation={orientation}
        isOpen={isOpen}
        option={layout || layouts[0]}
        onClose={getLayout}
      />
    </div>
  );
};

export default withTranslation('translations')(LayoutAndTimeContainer);
