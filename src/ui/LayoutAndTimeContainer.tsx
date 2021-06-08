import React, {FC, useState} from 'react';
import { WithTranslation, withTranslation } from "react-i18next";
import {log} from "util";
import Dropdown from './Dropdown';
import Icon from './Icon';
import './LayoutAndTimeContainer.scss';
import LayoutModal from "./LayoutModal";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
};

const layouts = [
            { value: '1', label: (<><Icon img="layout1" /><span className="row-count">4</span></>)},
            { value: '2', label: (<><Icon img="layout3" /><span className="row-count">8</span></>)},
            { value: '3', label: (<><Icon img="layout2" /><span className="row-count">12</span></>)},
            { value: '4', label: (<><Icon img="layout4"/><span className="row-count">4+4</span></>)},
            { value: '5', label: (<><Icon img="layout6"/><span className="row-count">8+8</span></>)},
            { value: '6', label: (<><Icon img="layout5"/><span className="row-count">12+12</span></>)},
            { value: '7', label: (<><Icon img="layout7"/><span className="row-count">4+8</span></>)},
            { value: '8', label: (<><Icon img="layout8"/><span className="row-count">8+12</span></>)},
            { value: '9', label: (<><Icon img="layout9"/><span className="row-count">4+4</span></>)},
            { value: '10', label: (<><Icon img="layout11"/><span className="row-count">8+8</span></>)},
            { value: '11', label: (<><Icon img="layout10"/><span className="row-count">12+12</span></>)}

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
    const [isOpen, changeOpen] = useState(false)
    const [layout, setLayout] = useState(layouts[1])

    const setOpen = () => {
        changeOpen(true)
    }
    const getLayout = (option) => {
       changeOpen(false)
         setLayout(layouts[option.value - 1])
    }
    return (
        <div className="layout-and-time-container">
            <div role="button" onClick={setOpen}>
                <button className="layout" name="layout" >{layout.label} </button>
            </div>
            <div>
                <Dropdown name="time" isSearchable={false} options={times} placeholder={times[1].label}/>
            </div>
            <LayoutModal isOpen={isOpen} option={layout} onClose={getLayout} />
        </div>
    )
}

export default withTranslation('translations')(LayoutAndTimeContainer);