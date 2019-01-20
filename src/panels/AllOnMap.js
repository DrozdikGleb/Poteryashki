import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import $ from 'jquery';
import {GoogleMap, Marker, withGoogleMap} from "react-google-maps";


const MyMapComponent = withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={11}
        defaultCenter={{lat: 59.933963, lng: 30.337563}}
    >
        {props.isMarkerShown && props.markers.map(marker => (
            <Marker
                position={{
                    lat: parseFloat(marker.lat), lng: parseFloat(
                        marker.lng)
                }}
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
            lost_array: [],
            activePanel: "allOnMap",
            fetchInProgress: true
        };
        this.getAllLostThings = this.getAllLostThings.bind(this);
        this.getAllLostThings();
    }

    componentWillMount() {
        this.state.fetchInProgress = false;
        console.log(this.state.lat);
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

    render() {
        return (
            <UI.Panel id='allOnMap'>
                <UI.PanelHeader noShadow left={<UI.HeaderButton onClick={() => {this.props.from === "found" ? this.props.setPanel("found") : this.props.setPanel("lost")}
                }>{<Icon24Back/>}</UI.HeaderButton>}>Все потеряшки на карте</UI.PanelHeader>
                {this.state.fetchInProgress && <UI.ScreenSpinner/>}
                {this.state.lost_array && <MyMapComponent
                    isMarkerShown
                    markers={this.state.lost_array}
                    containerElement={<div style={{height: `100vh`}}/>}
                    mapElement={<div style={{height: `100%`}}/>}
                />}
            </UI.Panel>
        )
    }
}

export default AllOnMap;