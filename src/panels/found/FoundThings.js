import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import {GoogleMap, Marker, withGoogleMap} from "react-google-maps";
import Geosuggest, {Suggest} from "react-geosuggest";
import Icon24Place from "@vkontakte/icons/dist/24/place";
import $ from "jquery";
import AllOnMap from "../AllOnMap";
import FilterFound from "./FilterFound";
import Icon28Info from "@vkontakte/icons/dist/28/info_outline";
import Icon28Write from "@vkontakte/icons/dist/28/write";
import Icon28Cancel from "@vkontakte/icons/dist/28/cancel_outline";
import MoreInfoFound from "./MoreInfoFound";
import OnMapThing from "../OnMapThing";

const google = window.google;

const centerStyle = {
    display: 'block',
    margin: 'auto'
};

class FoundThings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latSug: null,
            lngSug: null,
            message: null,
            activePanel: "found",
            placeName: null,
            found_array: null,
            popout: null,
            lat : props.coordinates === null ? 60.015659 : props.coordinates.lat,
            lng : props.coordinates === null ? 30.231652 : props.coordinates.long
        };
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
        this.getNearbyFoundThings = this.getNearbyFoundThings.bind(this);
        this.setFilteredArray = this.setFilteredArray.bind(this);
        this.getMoreInfoAboutFoundThing = this.getMoreInfoAboutFoundThing.bind(this);
        this.setPopout = this.setPopout.bind(this);
        this.getNearbyFoundThings(false);
    }

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
        this.state.found_array = null;
        this.getNearbyFoundThings(true);
    };

    setFilteredArray(array) {
        this.setState({found_array: array});
    }

    getNearbyFoundThings(sug) {
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
                    table: "found"
                }
            }
        ).done(function (data) {
            this.setState({found_array: data['result']});
            if (data['result'] === null) {
                me.setState({message: "Возле этого места нет найденных вещей"});
            }
        }.bind(this));
    };

    go = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    getMoreInfoAboutFoundThing(id, isMap) {
        if (!isMap) {
            this.setState({activePanel: 'moreInfoFound'})
        } else {
            this.setState({activePanel: 'onMap'})
        }
        this.state.pressId = id;
    }

    setPopout(alert) {
        this.setState({popout: alert});
    }

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
                                this.getMoreInfoAboutFoundThing(thing._id, false);
                            }}><Icon28Info/></UI.Button>
                        </div>
                    }>
                    {thing.name}
                </UI.Cell>
            </UI.List>
        </UI.Group>
    }


    render() {
        return (
            <UI.View popout = {this.state.popout} activePanel={this.state.activePanel}>
                <UI.Panel id='found' style = {centerStyle}>
                    <UI.PanelHeader noShadow
                                    key="panelHeaderFound"
                                    left={[<UI.HeaderButton
                                        onClick = {() => {this.setPanel('filterFound')}}
                                        style={{display: 'inline-block'}}><Icon24Filter/></UI.HeaderButton>,
                                        <UI.HeaderButton
                                            onClick = {() => {this.setPanel('allOnMap')}}
                                            style={{display: 'inline-block'}}><Icon24Place/></UI.HeaderButton>]}>Найдёныши</UI.PanelHeader>
                    <Geosuggest
                        style = {centerStyle}
                        placeholder="Введите место, где потеряна вещь"
                        onSuggestSelect={this.onSuggestSelect}
                        location={new google.maps.LatLng(53.558572, 9.9278215)}
                        radius={20}
                    />

                    {this.state.found_array !== null ? this.state.found_array.map(thing => this.printLostThingInfo(thing)) : this.state.message ===null ? <UI.Div>Ищем найденные вещи поблизости...<UI.Spinner/></UI.Div>
                    :<UI.Div>{this.state.message}</UI.Div>}

                </UI.Panel>
                <OnMapThing id="onMap" from = "found" uID={this.state.pressId} setPopout={this.setPopout} lostThingInfo={this.state.lostThingInfo} go={this.go}/>
                <MoreInfoFound goToMap = {this.getMoreInfoAboutFoundThing} setPopout={this.setPopout} id="moreInfoFound" idThing={this.state.pressId} go={this.go}/>
                <AllOnMap id="allOnMap" from = "found" setPanel = {this.setPanel}/>
                <FilterFound id="filterFound" setPanel = {this.setPanel} setFilteredArray = {this.setFilteredArray}/>
            </UI.View>
        )
    }
}

export default FoundThings;