import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon28Cancel from "@vkontakte/icons/dist/28/cancel_outline";
import Icon28Write from "@vkontakte/icons/dist/28/write";
import Icon24Add from "@vkontakte/icons/dist/24/add";
import $ from "jquery";
import AddLostThing from "./lost/AddLostThing";
import MapContainer from "./MapContainer";
import OnMapThing from "./OnMapThing";
import AllOnMap from "./AllOnMap";
import AddFoundThing from "./found/AddFoundThing";
import EditFoundThing from "./found/EditFoundThing";
import EditLostThing from "./lost/EditLostThing";

const centerStyle = {
    display: 'inline-block',
    verticalAlign: 'middle'
};

class MyAds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            popout: null,
            chosen_lat_found: null,
            chosen_lng_found: null,
            activePanel: "myAds",
            lost_array: [],
            found_array: [],
            lostThingInfo: null,
            placeName: null,
            activeTab: "lost",
            pressId: 0
        };
        this.printUserAds = this.printUserAds.bind(this);
        this.getMoreInfoAboutLostThing = this.getMoreInfoAboutLostThing.bind(this);
        this.goToAddLostOrFoundThing = this.goToAddLostOrFoundThing.bind(this);
        this.deleteUserThing = this.deleteUserThing.bind(this);
        this.goToEditLostOrFoundThing = this.goToEditLostOrFoundThing.bind(this);
        this.setPopout = this.setPopout.bind(this);
        this.getAllUserLostThings();
        this.getAllUserFoundThings();
    }

    getMoreInfoAboutLostThing(id, isMap) {
        if (!isMap) {
            this.setState({activePanel: 'moreInfo'})
        } else {
            this.setState({activePanel: 'onMap'})
        }
        this.state.pressId = id;
    }

    goToAddLostOrFoundThing() {
        if (this.state.activeTab === 'lost') {
            this.setState({activePanel: 'addLostThing'})
        } else {
            this.setState({activePanel: 'addFoundThing'})
        }
    }

    goToEditLostOrFoundThing(id) {
        if (this.state.activeTab === 'lost') {
            this.setState({activePanel: 'editLostThing'})
        } else {
            this.setState({activePanel: 'editFoundThing'})
        }
        this.state.pressId = id
    }

    deleteUserThing(thing_id) {
        let a = "Found";
        if (this.state.activeTab === 'lost') {
            a = "Lost";
        }
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/deleteUser' + a + 'Thing.php',
                type: 'POST',
                dataType: "json",
                data: {
                    thing_id: thing_id
                }
            }
        ).done(function (data) {
            alert(data);
        }.bind(this));
        if (a === "Found") {
            this.getAllUserFoundThings();
        } else {
            this.getAllUserLostThings();
        }
    }

    setPanel = (name) => {
        this.setState({activePanel: name});
        this.getAllUserFoundThings();
        this.getAllUserLostThings();
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

    getAllUserFoundThings() {
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/getFoundUserAds.php',
                type: 'POST',
                dataType: "json",
                data: {
                    userId: this.props.userId
                }
            }
        ).done(function (data) {
            this.setState({found_array: data['result']})
        }.bind(this));
    }

    setPopout(alert) {
        this.setState({popout: alert});
    }

    printUserAds(thing) {
        return <UI.Group>
            <UI.List>
                <UI.Cell
                    before={<UI.Avatar src={thing.imageLink} type="image" size={72}/>}
                    size="l"
                    description={thing.category}
                    bottomContent={
                        <div style={{display: 'flex'}}>
                        </div>
                    }
                    asideContent={
                        <div style={{display: 'flex'}}>
                            <UI.Button style={{marginRight: "10px"}} size="s" level="outline" onClick={() => {
                                this.goToEditLostOrFoundThing(thing._id)
                            }}><Icon28Write/></UI.Button>
                            <UI.Button size="s" level="outline" onClick={() => {
                                this.deleteUserThing(thing._id)
                            }}><Icon28Cancel/></UI.Button>
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
                <UI.Panel id='myAds'>
                    <UI.PanelHeader noShadow
                                    key="panelHeaderMyAdsLost"
                                    left={<UI.HeaderButton onClick={() => {
                                        this.goToAddLostOrFoundThing()
                                    }}><Icon24Add/></UI.HeaderButton>}
                    >Мои объявления</UI.PanelHeader>
                    <UI.Group>
                        <UI.Tabs theme="light">
                            <UI.TabsItem
                                onClick={() => {
                                    this.setState({activeTab: 'lost'});
                                    this.getAllUserLostThings();
                                }}
                                selected={this.state.activeTab === 'lost'}
                            >
                                Потеряшки
                            </UI.TabsItem>
                            <UI.TabsItem
                                onClick={() => {
                                    this.setState({activeTab: 'found'});
                                    this.getAllUserFoundThings();
                                }}
                                selected={this.state.activeTab === 'found'}
                            >
                                Найдёныши
                            </UI.TabsItem>
                        </UI.Tabs>
                        {this.state.activeTab === 'lost' ? this.state.lost_array && this.state.lost_array.map(thing => this.printUserAds(thing))
                            : this.state.found_array && this.state.found_array.map(thing => this.printUserAds(thing))}
                    </UI.Group>
                </UI.Panel>
                <AddFoundThing setPopout = {this.setPopout} id="addFoundThing" userId={this.props.userId} setPanel={this.setPanel}/>
                <AddLostThing setPopout = {this.setPopout} id="addLostThing" userId={this.props.userId} setPanel={this.setPanel}/>
                <EditFoundThing id="editFoundThing" thing_id = {this.state.pressId} userId = {this.props.userId} setPanel={this.setPanel}/>
                <EditLostThing id="editLostThing" thing_id = {this.state.pressId} userId = {this.props.userId} setPanel={this.setPanel}/>
            </UI.View>
        )
    }
}

export default MyAds;