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
            activePanel: "found",
            placeName: null,
            found_nearby_array: null,
            lat : props.coordinates === null ? 60.015659 : props.coordinates.lat,
            lng : props.coordinates === null ? 30.231652 : props.coordinates.long
        };
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
        this.getNearbyFoundThings = this.getNearbyFoundThings.bind(this);
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
        this.state.found_nearby_array = null;
        this.getNearbyFoundThings(true);
    };

    getNearbyFoundThings(sug) {
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/getNearbyThings.php',
                type: 'GET',
                dataType: "json",
                data : {
                    distance : 20,
                    lat: sug ? this.state.latSug : this.state.lat,
                    lng: sug ? this.state.lngSug : this.state.lng
                }
            }
        ).done(function (data) {
            this.setState({found_nearby_array: data['result']})
        }.bind(this));
    };

    printLostThingInfo(thing) {
        return <UI.Group>
            <UI.List>
                <UI.Cell
                    before={<UI.Avatar src={thing.imageLink} type="image" size={72}/>}
                    size="l"
                    description={thing.category}
                    bottomContent={
                        <div style={{display: 'flex'}}>
                            <UI.Button size="m">На карте</UI.Button>
                            <UI.Button size="m" level="secondary" style={{marginLeft: 8}}>Подробности</UI.Button>
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

                    {this.state.found_nearby_array !== null ? this.state.found_nearby_array.map(thing => this.printLostThingInfo(thing)) : <UI.Div>Ищем найденные вещи поблизости...<UI.Spinner/></UI.Div>}

                </UI.Panel>
                <AllOnMap id="allOnMap" from = "found" setPanel = {this.setPanel}/>
                <FilterFound id="filterFound" setPanel = {this.setPanel}/>
            </UI.View>
        )
    }
}

export default FoundThings;