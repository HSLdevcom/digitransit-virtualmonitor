import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { verticalLayouts, horizontalLayouts } from './Layouts';
import Dropdown from './Dropdown';
import LayoutModal from './LayoutModal';
import { ICardInfo } from '../util/Interfaces';

interface IProps {
  cardInfo: ICardInfo;
  updateLayout: (cardId: number, layout: number) => void;
  updateCardInfo: (
    cardId: number,
    type: string,
    value: string | number,
    lang?: string,
  ) => void;
  orientation: string;
  durationEditable: boolean;
  allowInformationDisplay: boolean;
  disableLayoutButton?: boolean;
}

const durations = [
  { value: 3, label: '3s' },
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 15, label: '15s' },
];

const LayoutAndTimeContainer: FC<IProps> = ({
  cardInfo,
  updateCardInfo,
  updateLayout,
  orientation,
  durationEditable,
  allowInformationDisplay,
  disableLayoutButton,
}) => {
  const [t] = useTranslation();
  const [open, setOpen] = useState(false);
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

  const onSave = option => {
    if (option) {
      updateLayout(cardInfo.id, option);
      setOpen(false);
    }
  };

  const handleChange = option => {
    if (updateCardInfo) {
      updateCardInfo(cardInfo.id, 'duration', option.value);
    }
  };
  return (
    <div className="layout-and-time-container">
      <div
        role="button"
        onClick={() => {
          if (!disableLayoutButton) {
            setOpen(true);
          }
        }}
      >
        <button
          className="layout-button"
          name="layout"
          aria-label={t('layout')}
          disabled={disableLayoutButton}
        >
          {layoutButton}
        </button>
      </div>
      <div className="duration">
        <Dropdown
          name="duration"
          options={durations}
          placeholder={!durationEditable ? '-' : placeHolder}
          handleChange={handleChange}
          isDisabled={!durationEditable}
        />
      </div>
      <LayoutModal
        allowInformationDisplay={allowInformationDisplay}
        orientation={orientation}
        option={layout}
        open={open}
        onClose={() => setOpen(false)}
        onSave={onSave}
      />
    </div>
  );
};

export default LayoutAndTimeContainer;
