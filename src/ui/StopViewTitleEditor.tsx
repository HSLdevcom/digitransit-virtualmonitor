import React, {FC, useState} from 'react';
import './StopViewTitleEditor.scss';
import Icon from './Icon';
import { WithTranslation, withTranslation } from 'react-i18next';

interface IProps {
    id: number,
    title: string,
    updateValue?: Function,
}

const StopViewTitleEditor : FC<IProps & WithTranslation> = ({id, title, updateValue, t}) => {
    const [newTitle, setNewTitle] = useState(title);
    const [changed, setChanged] = useState(false);

    const onClick = event  => {
        event.target.select();

    };
    const isKeyboardSelectionEvent = event => {
        const backspace = [8, 'Backspace'];
        const space = [13, ' ', 'Spacebar'];
        const enter = [32, 'Enter'];

        const key = (event && (event.key || event.which || event.keyCode)) || '';

        if (key && typeof event.target.selectionStart === 'number' &&
            event.target.selectionStart === 0 && 
            event.target.selectionEnd === event.target.value.length
            && event.target.value === newTitle) {
            if (backspace.concat(space).includes(key)) {
                setNewTitle('');
                setChanged(true);
            } else if (key.length === 1) {
                setNewTitle(key);
                setChanged(true);
            }
            return false;
        }

        if (key && backspace.includes(key)) {
            setNewTitle(newTitle.slice(0, -1));
            setChanged(true);
            return false;
        }
        if (!key || !enter.includes(key)) {
            if (key.length === 1) {
                setNewTitle(newTitle.concat(key));
                setChanged(true);
            }
            return false;
        }
        event.preventDefault();
        if (updateValue) {
            updateValue(id, newTitle);
            setChanged(false);
        }
        return true;
    };
    return (
        <div className="stop-title">
            <p className="description">{t('stoptitle')}{id}</p>
            <div className="stop-title-input-container">
                <input className="stop-title-input" id={`stop-title-input${id}`}
                   onClick={ e => onClick(e) }
                   onKeyDown={ e => isKeyboardSelectionEvent(e) }
                   value={ changed ? newTitle : title }
                />
                <div role="button">
                    <Icon img="edit" color={'#007ac9'}/>
                </div>
            </div>
        </div>
    );
}
/*class StopViewTitleEditor extends React.Component<WithTranslation & IProps, IState > {
    constructor(props: IProps) {
        super(props);
        this.state = {
            value: props.title,
        }
    }

    onClick = () => {
        const {id} = this.props;
        if(this.state.value === this.props.t('stopText')) {
            this.setState({value: ''},function (){
                document?.getElementById(`stop-title-input${id}`)!.focus();
            })
        } else {
            document?.getElementById(`stop-title-input${id}`)!.focus();
        }

  onClick = () => {
    if (this.state.value === this.props.t('stopsText')) {
      this.setState({ value: '' }, function () {
        document?.getElementById('stop-title-input')!.focus();
      });
    } else {
      document?.getElementById('stop-title-input')!.focus();
    }

    render() {
        const {t, id, title} = this.props;
        return (
            <div className="stop-title">
                <p className="description">{t('stoptitle')}{id}</p>
                <div className="stop-title-input-container">
                    <input className="stop-title-input" id={`stop-title-input${id}`}
                       value={this.state.value || title}
                       onKeyDown={ e => this.isKeyboardSelectionEvent(e)}
                    />
                    <div role="button" onClick={this.onClick}>
                        <Icon img="edit" color={'#007ac9'}/>
                    </div>
                </div>
            </div>
        )
    }
}*/

export default withTranslation('translations')(StopViewTitleEditor);
