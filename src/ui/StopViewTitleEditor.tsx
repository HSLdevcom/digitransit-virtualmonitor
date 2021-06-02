import React from 'react';
import './StopViewTitleEditor.scss';
import Icon from './Icon';
import { WithTranslation, withTranslation } from "react-i18next";


interface IProps  {
    i18n, tReady, t
}
interface IState {
    value?: string,
}
class StopViewTitleEditor extends React.Component<WithTranslation, IState, IProps > {
    constructor(props: IProps) {
        super(props);
        this.state = {
            value: props.t('stopsText')
        }
        this.onClick = this.onClick.bind(this);
        this.updateValue = this.updateValue.bind(this);
    }

    onClick = () => {
        if(this.state.value === this.props.t('stopsText')) {
            this.setState({value: ''},function (){
                document?.getElementById('stop-title-input')!.focus();
            })
        } else {
            document?.getElementById('stop-title-input')!.focus();
        }

    }
    updateValue = (e) => {
        this.setState({value: e.target.value})
    }
    render() {
        const {t} = this.props
        return (
            <div className="stop-title">
                <p className="description">{t('stoptitle')}</p>
                <input className="stop-title-input" id={"stop-title-input"}
                       value={this.state.value}
                       onChange={e => this.updateValue(e)}
                />
                <div role="button" onClick={this.onClick}>
                    <Icon img="edit" color={'#007ac9'}/>
                </div>
            </div>
        )
    }
}

export default  withTranslation('translations')(StopViewTitleEditor);