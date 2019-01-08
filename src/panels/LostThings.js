import React from 'react';
import * as UI from '@vkontakte/vkui';
import $ from 'jquery';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import AddLostThing from './AddLostThing';
import MapContainer from "./MapContainer";
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import MoreInfo from "./MoreInfo";
import OnMapThing from "./OnMapThing";
import AllOnMap from "./AllOnMap";
import Icon24Back from "@vkontakte/icons/dist/24/back";


class LostThings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //TODO добавить в AddLostThing.js lat and lng
            lat: null,
            lng: null,
            activePanel: "lost",
            lost_array: [],
            lostThingInfo: null,
            pressId: 0

        };
        this.printLostThingInfo = this.printLostThingInfo.bind(this);
        this.goToAddLostThing = this.goToAddLostThing.bind(this);
        this.getMoreInfoAboutLostThing = this.getMoreInfoAboutLostThing.bind(this);
        this.goToAllLostOnMap = this.goToAllLostOnMap.bind(this);
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
            //alert(JSON.stringify(data));
            this.setState({lost_array: data['result']})
        }.bind(this));
    };

    goToAddLostThing(lat, lng) {
        this.state.lat = lat;
        this.state.lng = lng;
        return this.setState({activePanel: 'addThing'})
    }

    goToAllLostOnMap() {
        return this.setState({activePanel: 'allOnMap'})
    }

    getMoreInfoAboutLostThing(id, isMap) {
        if (!isMap) {
            this.setState({activePanel: 'moreInfo'})
        } else {
            this.setState({activePanel: 'onMap'})
        }
        this.state.pressId = id;
    }

    go = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    //элемент листа потерянной вещи
    printLostThingInfo(thing) {
        return <UI.Group>
            <UI.List>
                <UI.Cell
                    before={<UI.Avatar src={thing.imageLink} type="image" size={72}/>}
                    size="l"
                    description={thing.category}
                    bottomContent={
                        <div style={{display: 'flex'}}>
                            <UI.Button size="m" onClick={() => {
                                this.getMoreInfoAboutLostThing(thing._id, true)
                            }
                            }>На карте</UI.Button>
                            <UI.Button onClick={() => {
                                this.getMoreInfoAboutLostThing(thing._id, false);
                            }} size="m" level="secondary" style={{marginLeft: 8}}>Подробности</UI.Button>
                        </div>
                    }>
                    {thing.name}
                </UI.Cell>
            </UI.List>
        </UI.Group>
    }

    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="lost" activePanel="lost">
                    <UI.Panel id='lost'>
                        <UI.PanelHeader key="addThing" left={<UI.HeaderButton onClick={this.props.go
                        } data-to="panelChoose">{<Icon24Back/>}</UI.HeaderButton>}
                                        right={<UI.HeaderButton onClick={() => this.goToAddLostThing()}>
                                            Добавить потеряшку
                                        </UI.HeaderButton>}>
                            Потеряшки
                        </UI.PanelHeader>
                        <UI.Search/>
                        <UI.Button level="commerce" onClick={() => this.goToAllLostOnMap()}>
                            Все потеряшки на карте
                        </UI.Button>
                        {this.state.lost_array && this.state.lost_array.map(thing => this.printLostThingInfo(thing))}
                    </UI.Panel>
                </UI.View>
                <AddLostThing id="addThing" go={this.go} lat={this.state.lat} lng={this.state.lng}
                              userId={this.props.userId}/>
                <MapContainer id="map" go={this.goToAddLostThing}/>
                <MoreInfo id="moreInfo" idThing={this.state.pressId} go={this.go}/>
                <OnMapThing id="onMap" uID={this.state.pressId} lostThingInfo={this.state.lostThingInfo} go={this.go}/>
                <AllOnMap id="allOnMap" go={this.go} lostArray={this.state.lost_array}/>
            </UI.Root>
        );
    }
}

export default LostThings;