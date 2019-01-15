import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";


class FoundThings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: "found"
        }
    }

    render() {
        return (
            <UI.View activePanel={this.state.activePanel}>
                <UI.Panel id='found'>
                    <UI.PanelHeader noShadow
                                    key="panelHeaderFound"
                                    left={<UI.HeaderButton onClick={this.props.goMain} data-to="mainView">{
                                        <Icon24Back/>}</UI.HeaderButton>}>Найдёныши</UI.PanelHeader>
                </UI.Panel>
            </UI.View>
        )
    }
}

export default FoundThings;