import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import $ from 'jquery';
import {GoogleMap, Marker, withGoogleMap} from "react-google-maps";


const MyMapComponent = withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={15}
        defaultCenter={{lat: props.lat, lng: props.lng}}
    >
        {props.isMarkerShown && <Marker position={{lat: props.lat, lng: props.lng}}/>}
    </GoogleMap>
);

class OnMapThing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            activePanel: "onMap",
            fetchInProgress: true
        }
    }

    componentDidMount() {
        $.ajax(
            {
                url: 'http://degi.shn-host.ru/lostthings/getLostThing.php',
                type: 'POST',
                dataType: "json",
                data: {
                    id: this.props.uID
                }
            }
        ).done(function (data) {
            //console.log(data['result'][0]['lat'])
            this.state.lat = parseFloat(data['result'][0]['lat']);
            this.state.lng = parseFloat(data['result'][0]['lng']);
            this.state.fetchInProgress = false;
        }.bind(this));
    }

    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="onMap" activePanel="onMap">
                    <UI.Panel id='onMap'>
                        <UI.PanelHeader noShadow left={<UI.HeaderButton onClick={this.props.go
                        } data-to="lost">{<Icon24Back/>}</UI.HeaderButton>}>Потеряшка на карте</UI.PanelHeader>
                        {this.state.fetchInProgress && <UI.ScreenSpinner/>}
                        {this.state.lat && <MyMapComponent
                            isMarkerShown
                            containerElement={<div style={{height: `100vh`}}/>}
                            mapElement={<div style={{height: `100%`}}/>}
                            lat={this.state.lat}
                            lng={this.state.lng}
                        />}
                    </UI.Panel>
                </UI.View>
            </UI.Root>
        )
    }
}

export default OnMapThing;