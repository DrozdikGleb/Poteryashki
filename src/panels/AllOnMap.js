import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import $ from 'jquery';
import {GoogleMap, Marker, withGoogleMap} from "react-google-maps";


const MyMapComponent = withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: 0.0, lng: 0.0}}
    >
        {props.isMarkerShown && props.markers.map(marker => (
            <Marker
                position={{ lat: parseFloat(marker.lat), lng: parseFloat(
                    marker.lng) }}
                key={marker._id}
            />
        ))}
    </GoogleMap>
);

class AllOnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            activePanel: "allOnMap",
            fetchInProgress: true
        }
    }

    componentWillMount() {
       this.state.fetchInProgress = false;
        this.state.lat = this.props.lostArray[0]['lat'];
        console.log(this.state.lat);
    }

    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="allOnMap" activePanel="allOnMap">
                    <UI.Panel id='allOnMap'>
                        <UI.PanelHeader noShadow left={<UI.HeaderButton onClick={this.props.go
                        } data-to="lost">{<Icon24Back/>}</UI.HeaderButton>}>Все потеряшки на карте</UI.PanelHeader>
                        {this.state.fetchInProgress && <UI.ScreenSpinner/>}
                        {this.state.lat && <MyMapComponent
                            isMarkerShown
                            markers = {this.props.lostArray}
                            containerElement={<div style={{height: `100vh`}}/>}
                            mapElement={<div style={{height: `100%`}}/>}
                        />}
                    </UI.Panel>
                </UI.View>
            </UI.Root>
        )
    }
}

export default AllOnMap;