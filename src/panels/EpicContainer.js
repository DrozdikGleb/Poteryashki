import React, {Component} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24Notification from '@vkontakte/icons/dist/24/notification';
import Icon24Filter from '@vkontakte/icons/dist/24/filter';
import Icon24Education from '@vkontakte/icons/dist/24/education';
import {
    View, Panel, PanelHeader,
    TabbarItem, Epic, Tabbar, HorizontalScroll,
    FixedLayout, Tabs, TabsItem,
    ListItem
} from '@vkontakte/vkui';
import LostThings from "./LostThings";
import FoundThings from "./FoundThings";
import Filter from "./Filter";

class EpicContainer extends Component {
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

    go = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

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
                        selected={this.state.activeStory === 'found'}
                        data-story="found"
                    ><Icon24Education/></TabbarItem>
                </Tabbar>
            }>
                <LostThings id="lost" userId = {this.props.userId} goMain = {this.props.goMain}/>
                <FoundThings id="found"/>
                <Filter id="filter"/>
            </Epic>
        )
    }
}

export default EpicContainer;