import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";


class FoundThings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: "found"
        }
    }

    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="found" activePanel="found">
                    <UI.Panel id='found'>
                        <UI.PanelHeader noShadow>Found</UI.PanelHeader>
                    </UI.Panel>
                </UI.View>
            </UI.Root>
        )
    }
}

export default FoundThings;