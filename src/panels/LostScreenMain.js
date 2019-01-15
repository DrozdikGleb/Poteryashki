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
import Icon24Education from "@vkontakte/icons/dist/24/education";
import LostThings from "./LostThings";
import FoundThings from "./FoundThings";
import Filter from "./Filter";
import {withRouter} from 'react-router-dom';
import MyAds from "./MyAds";

class LostScreenMain extends Component {
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
                    ><Icon24Notification/></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'filter'}
                        data-story="filter"
                    ><Icon24Filter/></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'myAds'}
                        data-story="myAds"
                    ><Icon24Education/></TabbarItem>
                </Tabbar>
            }>

                <LostThings id="lost" userId={this.props.userId} goMain={this.props.goMain}/>
                <Filter id="filter"/>
                <MyAds id="myAds" userId = {this.props.userId} goMain={this.props.goMain}/>
            </Epic>
        );
    }
}


export default LostScreenMain;