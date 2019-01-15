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

class FoundScreenMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStory: 'found'
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
                        selected={this.state.activeStory === 'found'}
                        data-story="found"
                    ><Icon24Notification/></TabbarItem>
                    <TabbarItem
                        onClick={this.onStoryChange}
                        selected={this.state.activeStory === 'filter'}
                        data-story="filter"
                    ><Icon24Filter/></TabbarItem>
                </Tabbar>
            }>
                <FoundThings id="found" goMain={this.props.goMain}/>
                <Filter id="filter"/>
            </Epic>
        );
    }
}


export default FoundScreenMain;