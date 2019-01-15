import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import $ from "jquery";
import AddLostThing from "./AddLostThing";
import MapContainer from "./MapContainer";
import MoreInfo from "./MoreInfo";
import OnMapThing from "./OnMapThing";
import AllOnMap from "./AllOnMap";


class MyAds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            activePanel: "myAds",
            lost_array: [],
            lostThingInfo: null,
            placeName: null,
            pressId: 0
        };
        this.printLostUserAds = this.printLostUserAds.bind(this);
        this.getMoreInfoAboutLostThing = this.getMoreInfoAboutLostThing.bind(this);
        this.getAllUserLostThings();
    }

    getMoreInfoAboutLostThing(id, isMap) {
        if (!isMap) {
            this.setState({activePanel: 'moreInfo'})
        } else {
            this.setState({activePanel: 'onMap'})
        }
        this.state.pressId = id;
    }

    printLostUserAds(thing) {
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

    goBack = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    getAllUserLostThings() {
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/getLostUserAds.php',
                type: 'POST',
                dataType: "json",
                data: {
                    userId: this.props.userId
                }
            }
        ).done(function (data) {
            this.setState({lost_array: data['result']})
        }.bind(this));
    };

    render() {
        return (
            <UI.View activePanel={this.state.activePanel}>
                <UI.Panel id='myAds'>
                    <UI.PanelHeader noShadow
                                    key="panelHeaderMyAdsLost"
                                    >Мои объявления</UI.PanelHeader>
                    {this.state.lost_array && this.state.lost_array.map(thing => this.printLostUserAds(thing))}
                </UI.Panel>
                <MoreInfo id="moreInfo" idThing={this.state.pressId} go={this.goBack} from="myAds"/>
                <OnMapThing id="onMap" uID={this.state.pressId} lostThingInfo={this.state.lostThingInfo} go={this.goBack} from="myAds"/>
            </UI.View>
        )
    }
}

export default MyAds;