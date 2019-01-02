import React, {Component} from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import EpicContainer from './EpicContainer';

class MainScreen extends Component {
    constructor(props) {
        super(props);

    }

    componentWillMount() {
    }

    componentDidUpdate() {
    }

    render() {

        return (
            <UI.Panel id={this.props.id}>
                <UI.PanelHeader>
                    Потеряшки
                </UI.PanelHeader>
                <EpicContainer/>
            </UI.Panel>
        );
    }
}

export default MainScreen;