import React, {Component} from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {
    View, Panel, PanelHeader,
    TabbarItem, Epic, Tabbar, HorizontalScroll,
    FixedLayout, Tabs, TabsItem,
    ListItem
} from '@vkontakte/vkui';
import Icon24Notification from "@vkontakte/icons/dist/24/notification";
import Icon24Filter from "@vkontakte/icons/dist/24/filter";
import Icon24Search from "@vkontakte/icons/dist/24/search";
import Icon28Search from "@vkontakte/icons/dist/28/search_outline";
import Icon24Education from "@vkontakte/icons/dist/24/education";
import Icon28User from "@vkontakte/icons/dist/28/user";
import LostThings from "./lost/LostThings";
import FoundThings from "./found/FoundThings";
import Filter from "./Filter";
import {withRouter} from 'react-router-dom';
import MyAds from "./MyAds";

class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStory: 'lost'
        };
        this.onStoryChange = this.onStoryChange.bind(this);
    }

    onStoryChange(e) {
        this.setState({activeStory: e.currentTarget.dataset.story})
    }


    render() {

        return (
            <Epic activeStory={this.state.activeStory} tabbar={
                <Tabbar>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'lost'}
                        data-story="lost"
                        label = "П"
                    ><Icon28Search/></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'found'}
                        data-story="found"
                        label = "Н"
                    ><Icon28Search/></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'myAds'}
                        data-story="myAds"
                    ><Icon28User/></TabbarItem>
                </Tabbar>
            }>

                <LostThings id="lost" userId={this.props.userId} goMain={this.props.goMain}/>
                <FoundThings id = "found" coordinates={this.props.coordinates}/>
                <MyAds id="myAds" userId = {this.props.userId} goMain={this.props.goMain}/>
            </Epic>
        );
    }
}


export default MainScreen;