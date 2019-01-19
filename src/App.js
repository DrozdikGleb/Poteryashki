import React, {Component} from 'react';
import * as UI from '@vkontakte/vkui';
import connect from '@vkontakte/vkui-connect';
import '@vkontakte/vkui/dist/vkui.css';
import MainScreen from "./panels/MainScreen";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coordinates:null,
            activeView: 'mainView',
            fetchedUser: null
        };
    }

    componentWillMount() {
        connect.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({fetchedUser: e.detail.data});
                    break;
                case 'VKWebAppGeodataResult':
                    this.setState({coordinates: e.detail.data});
                    break;
                default:
                    console.log(e.detail.type);
            }
        });
        connect.send('VKWebAppGetUserInfo', {});
        connect.send("VKWebAppGetGeodata", {});
    }

    go = (e) => {
        this.setState({activeView: e.currentTarget.dataset.to})
    };

    goToMain = (e) => {
        this.setState({activeView: e.currentTarget.dataset.to})
    };

    render() {

        // TODO Сделать две панели для потеряшек и найдёнышей
        return (
            <UI.ConfigProvider insets={this.props.insets}>
                <UI.Root activeView={this.state.activeView}>
                    <UI.View id="mainView" activePanel="panelChoose">
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
                                               onClick={() => {
                                                   this.setState({activeView: "lost"});
                                               }
                                               }>
                                        Потеряшки
                                    </UI.Button>
                                </UI.Div>
                                <UI.Div>
                                    <UI.Button level="commerce" size="xl"
                                               onClick={() => {
                                                   this.setState({activeView: "found"});
                                               }}>
                                        Найдёныши
                                    </UI.Button>
                                </UI.Div>
                            </UI.Group>
                        </UI.Panel>
                    </UI.View>
                    <MainScreen id="lost" goMain={this.goToMain} coordinates = {this.state.coordinates}
                                userId={this.state.fetchedUser === null ? 5 : this.state.fetchedUser.id}/>
                </UI.Root>
            </UI.ConfigProvider>
        );
    }
}


export default App;