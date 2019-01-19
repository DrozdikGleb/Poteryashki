import React from 'react';
import * as UI from '@vkontakte/vkui';
import $ from 'jquery';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import AddLostThing from './AddLostThing';
import MapContainer from "../MapContainer";
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import MoreInfo from "../MoreInfo";
import OnMapThing from "../OnMapThing";
import AllOnMap from "../AllOnMap";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import Icon24Place from "@vkontakte/icons/dist/24/place";
import Geosuggest, {Suggest} from "react-geosuggest";
import FilterLost from "./FilterLost";

const google = window.google;

const centerStyle = {
    display: 'block',
    margin: 'auto'
};

class LostThings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //TODO добавить в AddLostThing.js lat and lng
            lat: null,
            lng: null,
            latSug:null,
            lngSug:null,
            activePanel: "lost",
            lost_array: [],
            lostThingInfo: null,
            found_nearby_array:[],
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
        //this.getNearbyFoundThings();
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

                                    left={[<UI.HeaderButton
                                        style={{display: 'inline-block'}}
                                        onClick = {() => {this.setPanel('filterLost')}}
                                        ><Icon24Filter/></UI.HeaderButton>,
                                        <UI.HeaderButton
                                            onClick = {() => {this.setPanel('allOnMap')}}
                                            style={{display: 'inline-block'}}><Icon24Place/></UI.HeaderButton>]}
                    >
                        Потеряшки
                    </UI.PanelHeader>
                    <Geosuggest
                        style = {centerStyle}
                        placeholder="Введите место, где потеряна вещь"
                        onSuggestSelect={this.onSuggestSelect}
                        location={new google.maps.LatLng(53.558572, 9.9278215)}
                        radius={20}
                    />
                    {this.state.lost_array && this.state.lost_array.map(thing => this.printLostThingInfo(thing))}
                </UI.Panel>
                <AddLostThing id="addThing" setPanel={this.setPanel} lat={this.state.lat} lng={this.state.lng}
                              placeName={this.state.placeName}
                              userId={this.props.userId}/>
                <MapContainer id="map" go={this.goToAddLostThing}/>
                <MoreInfo id="moreInfo" idThing={this.state.pressId} go={this.go}/>
                <OnMapThing id="onMap" uID={this.state.pressId} lostThingInfo={this.state.lostThingInfo} go={this.go}/>
                <AllOnMap id="allOnMap" from = "lost" setPanel={this.setPanel} lostArray={this.state.lost_array}/>
                <FilterLost id="filterLost" setPanel = {this.setPanel}/>
            </UI.View>


        );
    }
}

export default LostThings;