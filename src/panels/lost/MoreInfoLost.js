import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon24Share from "@vkontakte/icons/dist/24/share";
import Icon24Logo from "@vkontakte/icons/dist/24/logo_vk";
import Icon24Copy from "@vkontakte/icons/dist/24/copy";
import Icon16Map from "@vkontakte/icons/dist/16/place";
import Lightbox from 'react-images';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import moment from "moment";

import connect from '@vkontakte/vkui-connect';
import $ from "jquery";

const centerStyle = {
    display: 'block',
    margin: 'auto'
};


class MoreInfoLost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: "moreInfoLost",
            fetchInProgress: true,
            thingInfo: {
                name: "-",
                category: "-",
                comments: "-",
                owner: "-",
                imageLink: null,
                phone: null,
                email: null,
                date: null,
                place: null,
                lat: null,
                lng: null
            },
            isOpen: false,
        };
        this.showMessage = this.showMessage.bind(this);
        this.openDialog = this.openDialog.bind(this);
    }

    componentDidMount() {
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/getLostThing.php',
                type: 'POST',
                dataType: "json",
                data: {
                    id: this.props.idThing
                }
            }
        ).done(function (data) {
            if (data['ok'] === true) {
                this.setState({fetchInProgress: false});
                this.state.thingInfo.name = data['result'][0]['name'];
                this.state.thingInfo.category = data['result'][0]['category'];
                this.state.thingInfo.comments = data['result'][0]['comments'];
                this.state.thingInfo.owner = data['result'][0]['owner'];
                this.state.thingInfo.imageLink = data['result'][0]['imageLink'];
                this.state.thingInfo.phone = data['result'][0]['phone'];
                this.state.thingInfo.email = data['result'][0]['email'];
                this.state.thingInfo.date = data['result'][0]['date'];
                this.state.thingInfo.place = data['result'][0]['place'];
                this.state.thingInfo.lat = data['result'][0]['lat'];
                this.state.thingInfo.lng = data['result'][0]['lng'];
            }
        }.bind(this));
    }

    openDialog(id) {
        let s = "https://vk.me/id";
        s = s + id;
        window.open(s, "_self")
    }

    showMessage(message, info) {
        this.props.setPopout(
            <UI.Alert
                actions={[{
                    title: 'OK',
                    autoclose: true,
                    style: 'destructive'
                }]}
                onClose={() => this.props.setPopout(null)}
            >
                <h2>{message}</h2>
                <p>{info}</p>
            </UI.Alert>
        );
    }

    render() {
        const {isOpen} = this.state;
        return (
            <UI.Panel id='moreInfoLost'>
                <UI.PanelHeader noShadow left={<UI.HeaderButton onClick={this.props.go}
                                                                data-to={this.props.from === "myAds" ? "myAds" : "lost"}>{
                    <Icon24Back/>}</UI.HeaderButton>}>Подробности</UI.PanelHeader>
                {this.state.fetchInProgress ? <UI.ScreenSpinner/> :
                    <UI.Div>
                        <UI.Group title="Фотографии">
                            <UI.Gallery
                                slideWidth="100%"
                                style={{height: 250}}
                                align="center"
                            >
                                <img onClick={() => this.setState({isOpen: true})}
                                     src={this.state.thingInfo.imageLink}/>
                                <Lightbox
                                    images={[{src: this.state.thingInfo.imageLink}]}
                                    isOpen={isOpen}
                                    onClose={() => this.setState({isOpen: false})}
                                />
                            </UI.Gallery>
                        </UI.Group>

                        <UI.Group title="Информация">
                            <UI.Cell>
                                <UI.InfoRow title="Название">
                                    {this.state.thingInfo.name}
                                </UI.InfoRow>
                            </UI.Cell>
                            <UI.Cell>
                                <UI.InfoRow title="Категория">
                                    {this.state.thingInfo.category}
                                </UI.InfoRow>
                            </UI.Cell>
                            <UI.Cell multiline>
                                <UI.InfoRow title="Описание">
                                    {this.state.thingInfo.comments}
                                </UI.InfoRow>
                            </UI.Cell>
                            <UI.Cell multiline>
                                <UI.InfoRow title="Когда потеряно:">
                                    {this.state.thingInfo.date === null ? "Не указано" : moment(this.state.thingInfo.date).format('H:mm YYYY-MM-DD')}
                                </UI.InfoRow>
                            </UI.Cell>
                        </UI.Group>

                        <UI.Group title="Местоположение">
                            <UI.Cell multiline>
                                <UI.InfoRow title="Где потеряно:">
                                    {this.state.thingInfo.place}
                                </UI.InfoRow>
                            </UI.Cell>
                            <UI.Div>
                                {this.state.thingInfo.lat !== "null" &&
                                <UI.Button style={centerStyle} before={<Icon16Map/>} size="l" onClick={() => {
                                    this.props.goToMap(this.props.idThing, true);
                                }}>Показать на карте</UI.Button>}
                            </UI.Div>
                        </UI.Group>

                        <UI.Group>
                            <UI.Div>
                                <div style={{display: 'flex'}}>
                                    <UI.Button before={<Icon24Share/>} size="xl" stretched level="commerce" onClick={
                                        () => {
                                            connect.send("VKWebAppShare", {"link": "http://vk.com/app6790532#post/" + this.props.idThing});
                                        }
                                    }>
                                        Поделиться
                                    </UI.Button>
                                </div>
                            </UI.Div>
                        </UI.Group>
                        <UI.Group title="Контакты">
                            <UI.FormLayout>
                                <CopyToClipboard text={this.state.thingInfo.phone}>
                                    <UI.Cell asideContent={<Icon24Copy onClick={() => {
                                        this.showMessage("телефон скопирован", this.state.thingInfo.phone)
                                    }}/>}>
                                        <UI.InfoRow title="Телефон">
                                            {this.state.thingInfo.phone}
                                        </UI.InfoRow>
                                    </UI.Cell>
                                </CopyToClipboard>
                                <CopyToClipboard text={this.state.thingInfo.email}>
                                    <UI.Cell asideContent={<Icon24Copy onClick={() => {
                                        this.showMessage("email скопирован", this.state.thingInfo.email)
                                    }}/>}>
                                        <UI.InfoRow title="E-mail">
                                            {this.state.thingInfo.email}
                                        </UI.InfoRow>
                                    </UI.Cell>
                                </CopyToClipboard>
                                <UI.Button before={<Icon24Logo/>} size="xl" onClick={() => {
                                    this.openDialog(this.state.thingInfo.owner);
                                }
                                }>
                                    Связаться по вк
                                </UI.Button>
                            </UI.FormLayout>
                        </UI.Group>
                    </UI.Div>
                }
            </UI.Panel>

        )
    }
}

export default MoreInfoLost;