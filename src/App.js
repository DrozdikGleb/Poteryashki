import React, {Component} from 'react';
import * as UI from '@vkontakte/vkui';
import connect from '@vkontakte/vkui-connect';
import '@vkontakte/vkui/dist/vkui.css';
import MainScreen from './panels/MainScreen';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'panelChoose',
            fetchedUser: null
        };
    }

    componentWillMount() {
        connect.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({fetchedUser: e.detail.data});
                    break;
                default:
                    console.log(e.detail.type);
            }
        });
        connect.send('VKWebAppGetUserInfo', {});
    }

    goMain = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    render() {

        // TODO Сделать две панели для потеряшек и найдёнышей
        return (
            <UI.ConfigProvider insets={this.props.insets}>
                <UI.Root activeView="mainView">
                    <UI.View id="mainView" activePanel={this.state.activePanel}>
                        <UI.Panel id="panelChoose">
                            <UI.PanelHeader>Выбор роли</UI.PanelHeader>
                            {this.state.fetchedUser &&
                            <UI.Group title="получено с VK Connect">
                                <UI.ListItem
                                    before={this.state.fetchedUser.photo_200 ?
                                        <UI.Avatar src={this.state.fetchedUser.photo_200}/> : null}
                                    description={this.state.fetchedUser.city && this.state.fetchedUser.city.title ? this.state.fetchedUser.city.title : ''}
                                >
                                    {`${this.state.fetchedUser.first_name} ${this.state.fetchedUser.last_name}`}
                                </UI.ListItem>
                            </UI.Group>}
                            <UI.Group>
                                <UI.Div>
                                    <h1 align="center">Выберите категорию</h1>
                                </UI.Div>
                                <UI.Div>
                                    <UI.Button level="commerce" size="xl"
                                               onClick={() => {this.setState({activePanel: "mainScreen"})}}>
                                        Потеряшки
                                    </UI.Button>
                                </UI.Div>
                                <UI.Div>
                                    <UI.Button level="commerce" size="xl"
                                               onClick={() => {this.setState({activePanel: "mainScreen"})}}>
                                        Найдёныши
                                    </UI.Button>
                                </UI.Div>
                            </UI.Group>
                        </UI.Panel>
                        <MainScreen id="mainScreen" goMain = {this.goMain} accessToken={this.props.accessToken}
                                    userId={this.state.fetchedUser === null ? 5 : this.state.fetchedUser.id}/>
                    </UI.View>
                </UI.Root>
            </UI.ConfigProvider>
        );
    }
}

export default App;