import React from 'react';
import * as UI from '@vkontakte/vkui';
import $ from 'jquery'
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import AddLostThing from './AddLostThing';


class LostThings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: "lost",
            lost_array: []
        };
        this.printLostThingInfo = this.printLostThingInfo.bind(this);
        this.goToAddLostThing = this.goToAddLostThing.bind(this);
        this.getAllLostThings();
    }

    getAllLostThings() {
        $.ajax(
            {
                url: 'http://degi.shn-host.ru/lostthings/getAllLostThings.php',
                type: 'GET',
                dataType: "json"
            }
        ).done(function (data) {
            this.setState({lost_array: data['result']})
        }.bind(this));
    };

    goToAddLostThing() {
        return this.setState({activePanel: 'addThing'})
    }

    //элемент листа потерянной вещи
    printLostThingInfo(thing) {
        return <UI.Group title='Потерянная вещь'>
            <UI.List>
                <UI.Cell>
                    <UI.InfoRow title="наименование">
                        {thing.name}
                    </UI.InfoRow>
                </UI.Cell>
                <UI.Cell>
                    <UI.InfoRow title="Категория">
                        {thing.category}
                    </UI.InfoRow>
                </UI.Cell>
            </UI.List>
        </UI.Group>
    }

    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="lost" activePanel="lost">
                    <UI.Panel id='lost'>
                        <UI.PanelHeader key = "addThing" right = {<UI.HeaderButton onClick = {() => this.goToAddLostThing()}>
                            Добавить потеряшку
                        </UI.HeaderButton>}>
                            Lost
                        </UI.PanelHeader>
                        {this.state.lost_array.map(thing => this.printLostThingInfo(thing))}
                    </UI.Panel>
                </UI.View>
                <AddLostThing id = "addThing"/>
            </UI.Root>
        );
    }
}

export default LostThings;