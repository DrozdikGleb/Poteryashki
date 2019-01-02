import React, {Component} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24Notification from '@vkontakte/icons/dist/24/notification';
import {
    View, Panel, PanelHeader,
    TabbarItem, Epic, Tabbar, HorizontalScroll,
    FixedLayout, Tabs, TabsItem,
    ListItem
} from '@vkontakte/vkui';
import LostThings from "./LostThings";
import FoundThings from "./FoundThings";

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
                        selected={this.state.activeStory === 'found'}
                        data-story="found"
                    ><Icon24Notification/></TabbarItem>
                </Tabbar>
            }>
                <LostThings id="lost"/>
                <FoundThings id="found"/>

            </Epic>
        )
    }
}

export default EpicContainer;