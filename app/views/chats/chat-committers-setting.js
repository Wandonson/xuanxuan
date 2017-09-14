import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HTML from '../../utils/html-helper';
import Icon from '../../components/icon';
import Lang from '../../lang';
import App from '../../core';
import Chat from '../../core/models/chat';
import SelectBox from '../../components/select-box';
import Checkbox from '../../components/checkbox';

class ChatCommittersSetting extends Component {

    constructor(props) {
        super(props);

        let chat = props.chat;
        let type = chat.committersType;
        let members = chat.getMembersSet(App.members);
        let whitelist = chat.whitelist || new Set();
        let isEmptyWhiteList = !whitelist.size;
        let adminsCount = 0;
        members.forEach(x => {
            if(chat.isAdmin(x)) {
                adminsCount++;
                if(isEmptyWhiteList) whitelist.add(x.id);
            }
        });
        this.state = {type, members, adminsCount, whitelist}
    }

    getCommitters() {
        let type = this.state.type;
        if(type === 'whitelist') {
            return this.state.whitelist;
        } else if(type === 'admins') {
            return '$ADMINS';
        }
        return '';
    }

    handleSelectChange = type => {
        this.setState({type});
    }

    handleCheckboxChange(memberId, isChecked) {
        let whitelist = this.state.whitelist;
        if(isChecked) {
            whitelist.add(memberId);
        } else {
            whitelist.delete(memberId);
        }
        this.setState({whitelist});
    }

    render() {
        let {
            chat,
            className,
            children,
            ...other
        } = this.props;

        const options = [
            {value: Chat.COMMITTERS_TYPES.all, label: `${Lang.string('chat.committers.type.all')}(${this.state.members.length})`},
            {value: Chat.COMMITTERS_TYPES.admins, label: `${Lang.string('chat.committers.type.admins')}(${this.state.adminsCount})`},
            {value: Chat.COMMITTERS_TYPES.whitelist, label: `${Lang.string('chat.committers.type.whitelist')}(${this.state.whitelist.size})`},
        ];

        return <div {...other}
            className={HTML.classes('app-chat-committers-setting', className)}
        >
            <div className="text-gray space-sm flex flex-middle"><Icon name="information-outline"/>&nbsp; {Lang.string('chat.committers.committersSettingTip')}</div>
            <SelectBox className="space-sm" style={{width: '50%'}} value={this.state.type} options={options} onChange={this.handleSelectChange}/>
            {
                this.state.type === 'whitelist' && <div className="checkbox-list rounded box outline">
                {
                    this.state.members.map(member => {
                        return <Checkbox key={member.id} className="inline-block" onChange={this.handleCheckboxChange.bind(this, member.id)} checked={this.state.whitelist.has(member.id)} label={member.displayName}/>
                    })
                }
                </div>
            }
            {children}
        </div>;
    }
}

export default ChatCommittersSetting;
