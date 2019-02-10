import React from 'react';
import * as UI from '@vkontakte/vkui';
import $ from 'jquery';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import AddLostThing from './AddLostThing';
import MapContainer from "../MapContainer";
import MoreInfoLost from "./MoreInfoLost";
import OnMapThing from "../OnMapThing";
import AllOnMap from "../AllOnMap";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import Icon24Place from "@vkontakte/icons/dist/24/place";
import Geosuggest, {Suggest} from "react-geosuggest";
import FilterLost from "./FilterLost";
import Icon28Info from "@vkontakte/icons/dist/28/info_outline";

const google = window.google;

const centerStyle = {
    display: 'block',
    margin: 'auto'
};

class LostThings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            latSug: null,
            lngSug: null,
            activePanel: "lost",
            lost_array: [],
            lostThingInfo: null,
            found_nearby_array: [],
            placeName: null,
            pressId: 0,
            popout: null,
            message: null
        };
        this.printLostThingInfo = this.printLostThingInfo.bind(this);
        this.goToAddLostThing = this.goToAddLostThing.bind(this);
        this.getMoreInfoAboutLostThing = this.getMoreInfoAboutLostThing.bind(this);
        this.goToAllLostOnMap = this.goToAllLostOnMap.bind(this);
        this.getNearbyLostThings = this.getNearbyLostThings.bind(this);
        this.setFilteredArray = this.setFilteredArray.bind(this);
        this.setPopout = this.setPopout.bind(this);
        this.getNearbyLostThings(false);
    }

    getNearbyLostThings(sug) {
        var me = this;
        this.state.message = null;
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/getNearbyLostThings.php',
                type: 'GET',
                dataType: "json",
                data : {
                    distance : 1,
                    lat: sug ? this.state.latSug : this.state.lat,
                    lng: sug ? this.state.lngSug : this.state.lng,
                    table : "lost"
                }
            }
        ).done(function (data) {
            this.setState({lost_array: data['result']});
            if (data['result'] === null) {
                me.setState({message: "Возле этого места нет потерянных вещей"});
            }
        }.bind(this));
    };

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
            this.setState({activePanel: 'moreInfoLost'})
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

    setFilteredArray(array) {
        this.setState({lost_array: array});
    }

    onSuggestSelect = (place: Suggest) => {
        if (place == null) return;
        const {
            location: {lat, lng}
        } = place;
        console.log(place);
        this.setState({
            latSug: parseFloat(lat),
            lngSug: parseFloat(lng),
            placeName: place.description
        });
        this.state.found_nearby_array = null;
        this.getNearbyLostThings(true);
    };

    //элемент листа потерянной вещи
    printLostThingInfo(thing) {
        return <UI.Group>
            <UI.List>
                <UI.Cell
                    before={<UI.Avatar src={thing.imageLink} type="image" size={72}/>}
                    size="l"
                    description={thing.category}
                    asideContent={
                        <div style={{display: 'flex'}}>
                            <UI.Button size="s" level="outline" onClick={() => {
                                this.getMoreInfoAboutLostThing(thing._id, false);
                            }}><Icon28Info/></UI.Button>
                        </div>
                    }
                >
                    {thing.name}
                </UI.Cell>
            </UI.List>
        </UI.Group>
    }

    setPopout(alert) {
        this.setState({popout: alert});
    }

    render() {
        return (
            <UI.View popout={this.state.popout} activePanel={this.state.activePanel}>
                <UI.Panel id='lost'>
                    <UI.PanelHeader key="panelHeaderLost"

                                    left={[<UI.HeaderButton
                                        style={{display: 'inline-block'}}
                                        onClick={() => {
                                            this.setPanel('filterLost')
                                        }}
                                    ><Icon24Filter/></UI.HeaderButton>,
                                        <UI.HeaderButton
                                            onClick={() => {
                                                this.setPanel('allOnMap')
                                            }}
                                            style={{display: 'inline-block'}}><Icon24Place/></UI.HeaderButton>]}
                    >
                        Потеряшки
                    </UI.PanelHeader>
                    <Geosuggest
                        style={centerStyle}
                        placeholder="Введите место, где найдена вещь"
                        onSuggestSelect={this.onSuggestSelect}
                        location={new google.maps.LatLng(53.558572, 9.9278215)}
                        radius={20}
                    />
                    {this.state.lost_array !== null ? this.state.lost_array.map(thing => this.printLostThingInfo(thing)) : this.state.message ===null ? <UI.Div>Ищем потерянные вещи поблизости...<UI.Spinner/></UI.Div>
                        :<UI.Div>{this.state.message}</UI.Div>}
                </UI.Panel>
                <AddLostThing setPopout={this.setPopout} id="addThing" setPanel={this.setPanel} lat={this.state.lat}
                              lng={this.state.lng}
                              placeName={this.state.placeName}
                              userId={this.props.userId}/>
                <MapContainer id="map" go={this.goToAddLostThing}/>
                <MoreInfoLost goToMap = {this.getMoreInfoAboutLostThing} setPopout={this.setPopout} id="moreInfoLost" idThing={this.state.pressId} go={this.go}/>
                <OnMapThing id="onMap" from ="lost" uID={this.state.pressId} lostThingInfo={this.state.lostThingInfo} go={this.go}/>
                <AllOnMap id="allOnMap" from="lost" setPanel={this.setPanel} lostArray={this.state.lost_array}/>
                <FilterLost id="filterLost" setPanel={this.setPanel} setFilteredArray={this.setFilteredArray}/>
            </UI.View>


        );
    }
}

export default LostThings;