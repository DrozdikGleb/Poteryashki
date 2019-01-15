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
            placeName: null,
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
                url: 'https://degi.shn-host.ru/lostthings/getAllLostThings.php',
                type: 'GET',
                dataType: "json"
            }
        ).done(function (data) {
            //alert(JSON.stringify(data));
            this.setState({lost_array: data['result']})
        }.bind(this));
    };

    goToAddLostThing(lat, lng, placeName) {
        this.state.lat = lat;
        this.state.lng = lng;
        this.state.placeName = placeName;
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

    setPanel = (name) => {
        this.setState({activePanel: name})
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
            <UI.View activePanel={this.state.activePanel}>
                <UI.Panel id='lost'>
                    <UI.PanelHeader key="panelHeaderLost"
                                    left={<UI.HeaderButton onClick={this.props.goMain} data-to="mainView">{
                                        <Icon24Back/>}</UI.HeaderButton>}
                    >
                        Потеряшки
                    </UI.PanelHeader>
                    <UI.Group>
                        <UI.Cell before={<UI.Button level="commerce" onClick={() => this.goToAddLostThing()}>
                            Добавить потеряшку
                        </UI.Button>}
                                 asideContent={<UI.Button level="commerce" onClick={() => this.goToAllLostOnMap()}>
                                     Все потеряшки на карте
                                 </UI.Button>}>
                        </UI.Cell>
                    </UI.Group>
                    <UI.Search/>
                    {this.state.lost_array && this.state.lost_array.map(thing => this.printLostThingInfo(thing))}
                </UI.Panel>
                <AddLostThing id="addThing" setPanel={this.setPanel} lat={this.state.lat} lng={this.state.lng}
                              placeName={this.state.placeName}
                              userId={this.props.userId}/>
                <MapContainer id="map" go={this.goToAddLostThing}/>
                <MoreInfo id="moreInfo" idThing={this.state.pressId} go={this.go}/>
                <OnMapThing id="onMap" uID={this.state.pressId} lostThingInfo={this.state.lostThingInfo} go={this.go}/>
                <AllOnMap id="allOnMap" setPanel={this.setPanel} lostArray={this.state.lost_array}/>
            </UI.View>


        );
    }
}

export default LostThings;