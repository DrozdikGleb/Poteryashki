import React from 'react';
import * as UI from '@vkontakte/vkui';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';


class LostThings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: "lost"
        }
    }

    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="lost" activePanel="lost">
                    <UI.Panel id='lost'>
                        <UI.PanelHeader noShadow>Lost</UI.PanelHeader>
                    </UI.Panel>
                </UI.View>
            </UI.Root>
        );
    }
}

export default LostThings;