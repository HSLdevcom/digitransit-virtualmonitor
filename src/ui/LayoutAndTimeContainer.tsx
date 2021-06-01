import React, { FC } from 'react';
import { WithTranslation, withTranslation } from "react-i18next";
import Dropdown from './Dropdown';
import Icon from './Icon';
import './LayoutAndTimeContainer.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
};

const layouts = [
    {
        label: 'Yksijakoinen',
        options: [
            { value: '1', label: (<Icon img="layout1"/>)},
            { value: '2', label: (<Icon img="layout2"/>)},
            { value: '3', label: (<Icon img="layout3"/>)}
        ]
    },
    {
        label: 'Kaksijakoinen',
        options: [
            { value: '4', label: (<Icon img="layout4" />)},
            { value: '5', label: (<Icon img="layout5" />)},
            { value: '6', label: (<Icon img="layout6" />)}
        ]
    },
    {
        label: 'Kaksijakoinen yhdistelmä',
        options: [
            { value: '7', label: (<Icon img="layout7" />)},
            { value: '8', label: (<Icon img="layout8" />)}
        ]
    },
    {
        label: 'Itään / länteen',
        options: [
            { value: '9', label: (<Icon img="layout9" />)},
            { value: '10', label: (<Icon img="layout10" />)},
            { value: '11', label: (<Icon img="layout11" />)}
        ]
    }
];

const times = [
    { value: '3', label: '3s'},
    { value: '5', label: '5s'},
    { value: '10', label: '10s'},
    { value: '15', label: '15s'},
    { value: '20', label: '20s'},
    { value: '25', label: '25s'},
    { value: '30', label: '30s'},
];

const LayoutAndTimeContainer : FC<IProps & WithTranslation> = () => {
    return (
        <div className="layout-and-time-container">
            <div>
                <Dropdown name="layout" isSearchable={false} options={layouts} placeholder={layouts[0].options[0].label}/>
            </div>
            <div>
                <Dropdown name="time" isSearchable={false} options={times} placeholder={times[1].label}/>
            </div>
        </div>
    )
}

export default withTranslation('translations')(LayoutAndTimeContainer);