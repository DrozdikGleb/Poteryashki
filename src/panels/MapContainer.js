import {withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import Geosuggest, {Suggest} from "react-geosuggest";
import React from "react";
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";

const MyMapComponent = withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: props.lat, lng: props.lng}}
        onClick={props.onClick}
    >
        {props.isMarkerShown && <Marker position={{lat: props.lat, lng: props.lng}}/>}
    </GoogleMap>
);

const google = window.google;

class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: null,
            lat: null,
            activePanel: "map"
        };
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
    }

    onSuggestSelect = (place: Suggest) => {
        const {
            location: {lat, lng}
        } = place;

        this.setState({
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        });
    };

    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="map" activePanel="map">
                    <UI.Panel id='map'>
                        <UI.PanelHeader key="map" left={<UI.HeaderButton onClick={this.props.go
                        } data-to="addThing">{<Icon24Back/>}</UI.HeaderButton>}>Карта</UI.PanelHeader>
                        <Geosuggest
                            placeholder="Start typing!"
                            onSuggestSelect={this.onSuggestSelect}
                            location={new google.maps.LatLng(53.558572, 9.9278215)}
                            radius={20}
                        />
                        <div>{this.state.lat}</div>
                        <div>{this.state.lng}</div>
                        {this.state.lat && <MyMapComponent isMarkerShown
                                                           containerElement={<div style={{height: `400px`}}/>}
                                                           mapElement={<div style={{height: `100%`}}/>}
                                                           lat={this.state.lat}
                                                           lng={this.state.lng}
                                                           onClick={x => {
                                                               const lat = x.latLng.lat();
                                                               const lng = x.latLng.lng();
                                                               this.setState({
                                                                   lat: parseFloat(lat),
                                                                   lng: parseFloat(lng)
                                                               });
                                                           }}
                        />}
                    </UI.Panel>
                </UI.View>
            </UI.Root>
        )
    }
}

export default MapContainer;