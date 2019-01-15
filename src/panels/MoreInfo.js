import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui-connect';
import * as UI from "@vkontakte/vkui";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import Icon24Share from "@vkontakte/icons/dist/24/share";
import Icon24Logo from "@vkontakte/icons/dist/24/logo_vk"
import $ from "jquery";


class MoreInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: "moreInfo",
            fetchInProgress: true,
            thingInfo: {
                name: "-",
                category: "-",
                comments: "-",
                owner: "-",
                imageLink: null
            }
        };
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
            //console.log(data['result'][0]['lat'])
            this.setState({fetchInProgress: false});
            this.state.thingInfo.name = data['result'][0]['name'];
            this.state.thingInfo.category = data['result'][0]['category'];
            this.state.thingInfo.comments = data['result'][0]['comments'];
            this.state.thingInfo.owner = data['result'][0]['owner'];
            this.state.thingInfo.imageLink = data['result'][0]['imageLink'];
        }.bind(this));
    }

    openDialog(id) {
        let s = "https://vk.me/id";
        s = s + id;
        window.open(s, "_self")
    }

    render() {
        return (
            <UI.Panel id='moreInfo'>
                <UI.PanelHeader noShadow left={<UI.HeaderButton onClick={this.props.go} data-to={this.props.from === "myAds" ? "myAds" : "lost"}>{<Icon24Back/>}</UI.HeaderButton>}>Подробности потеряшки</UI.PanelHeader>
                {this.state.fetchInProgress ? <UI.ScreenSpinner/> :
                    <UI.Div>
                        <UI.Group title="Фотографии">
                            <UI.Gallery
                                slideWidth="100%"
                                style={{height: 250}}
                                align="center"
                            >
                                <img src={this.state.thingInfo.imageLink}/>
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
                        </UI.Group>

                        <UI.Group>
                            <UI.Div>
                                <div style={{display: 'flex'}}>
                                    <UI.Button
                                        style={{marginRight: 8}}
                                        size="xl">
                                        В избранное
                                    </UI.Button>
                                    <UI.Button size="m" stretched level="secondary">
                                        <Icon24Share/>
                                    </UI.Button>
                                </div>
                            </UI.Div>
                        </UI.Group>
                        <UI.Group title="Контакты">
                            <UI.FormLayout>
                                <UI.Cell>
                                    <UI.InfoRow title="Телефон">
                                        8-914-544-57-61
                                    </UI.InfoRow>
                                </UI.Cell>
                                <UI.Cell>
                                    <UI.InfoRow title="E-mail">
                                        drozdov.gleb.spb@gmail.com
                                    </UI.InfoRow>
                                </UI.Cell>
                                <UI.Button before={<Icon24Logo/>} size="xl" onClick={() => {
                                    this.openDialog(this.state.thingInfo.owner);
                                }
                                }>
                                    Написать продавцу
                                </UI.Button>
                            </UI.FormLayout>
                        </UI.Group>
                    </UI.Div>
                }
            </UI.Panel>

        )
    }
}

export default MoreInfo;