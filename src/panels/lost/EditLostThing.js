import React from 'react';
import * as UI from "@vkontakte/vkui";
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import Icon24Map from '@vkontakte/icons/dist/24/place';
import $ from 'jquery';
import DatePicker, {registerLocale} from 'react-datepicker'
import 'flatpickr/dist/themes/material_green.css'
import Flatpickr from 'react-flatpickr'
import "react-datepicker/dist/react-datepicker.css";
import '../../styles/my_picker_style.css'
import ru from 'date-fns/locale/ru';
import Geosuggest, {Suggest} from "react-geosuggest";
import {GoogleMap, Marker, withGoogleMap} from "react-google-maps";
import connect from "@vkontakte/vkui-connect";

registerLocale('ru', ru);

const MyMapComponent = withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: props.lat, lng: props.lng}}
        center={{lat: props.lat, lng: props.lng}}
        onClick={props.onClick}
    >
        {props.isMarkerShown && <Marker position={{lat: props.lat, lng: props.lng}}/>}
    </GoogleMap>
);

const google = window.google;


class EditLostThing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            thingLat: null,
            thingLng: null,
            placeNameInter: null,
            placeName: null,
            activePanel: "editLostThing",
            startDate: new Date(),
            image: null,
            isClickedMap: false,
            imageDownloaded: null,
            phone: null,
            email: null,
            thingInfo: {
                name: null,
                category: null,
                place: null,
                comments: null,
                phone: null,
                email: null
            }
        };
        this.updateLostThing = this.updateLostThing.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.getLostThingInfo = this.getLostThingInfo.bind(this);
        this.getLostThingInfo();
    }

    componentWillMount() {

        connect.subscribe((e) => {
            const {thingInfo} = this.state;
            switch (e.detail.type) {
                case 'VKWebAppGetEmailResult' :
                    thingInfo["email"] = e.detail.data.email;
                    this.setState(thingInfo);
                    break;
                case 'VKWebAppGetPhoneNumberResult' :
                    thingInfo["phone"] = e.detail.data.phone_number;
                    this.setState(thingInfo);
                    break;
                case 'VKWebAppGetPersonalCardResult' :
                    thingInfo["email"] = e.detail.data.email;
                    thingInfo["phone"] = e.detail.data.phone;
                    this.setState(thingInfo);
                    break;
                default:
            }
        });
    }

    updateLostThing() {
        this.formData = new FormData();
        this.formData.append('thing_id', this.props.thing_id);
        this.formData.append('name', this.state.thingInfo.name);
        this.formData.append('userId', this.props.userId);
        this.formData.append('category', this.state.thingInfo.category);
        this.formData.append('place', this.state.thingLat && (this.state.thingLat.toString() + "," + this.state.thingLng.toString()));
        this.formData.append('comments', this.state.thingInfo.comments);
        this.formData.append('date', this.state.startDate.toLocaleString());
        this.formData.append("image", this.state.image);
        this.formData.append("phone", this.state.phone !== null ? this.state.phone : "Не указан");
        this.formData.append("email", this.state.phone !== null ? this.state.email : "Не указан");

        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/editLostThing.php',
                type: 'POST',
                contentType: false,
                processData: false,
                data: this.formData
            }
        ).done(function (data) {

        });
        this.props.setPanel("myAds");
    }

    getLostThingInfo() {
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/getLostThing.php',
                type: 'POST',
                dataType: "json",
                data: {
                    id: this.props.thing_id
                }
            }
        ).done(function (data) {
            this.setState({fetchInProgress: false});
            this.state.thingInfo.name = data['result'][0]['name'];
            this.state.thingInfo.category = data['result'][0]['category'];
            this.state.thingInfo.comments = data['result'][0]['comments'];
            this.state.thingInfo.owner = data['result'][0]['owner'];
            this.state.imageDownloaded = data['result'][0]['imageLink'];
            this.state.thingLat = data['result'][0]['lat'];
            this.state.thingLng = data['result'][0]['lng'];
            this.state.thingInfo.phone = data['result'][0]['phone'];
            this.state.thingInfo.email = data['result'][0]['email'];
        }.bind(this));
    }

    onInputChange(e) {
        const {
            name,
            value
        } = e.currentTarget;

        const {thingInfo} = this.state;

        thingInfo[name] = value;

        this.setState({
            thingInfo
        })
    }

    handleDataChange(date) {
        this.setState({
            startDate: date
        });
    }

    selectFile(event) {
        //console.log(event.target.files[0]);
        this.state.image = event.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({imageDownloaded: e.target.result});
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    onSuggestSelect = (place: Suggest) => {
        if (place == null) return;
        const {
            location: {lat, lng}
        } = place;
        console.log(place);
        this.setState({
            thingLat: parseFloat(lat),
            thingLng: parseFloat(lng),
            placeNameInter: place.description
        });
    };

    render() {
        return (
            <UI.Panel id={this.props.id}>
                {this.state.isClickedMap ? <UI.Div><UI.PanelHeader key="mapFound" left={<UI.HeaderButton onClick={() => {
                        this.setState({isClickedMap: false})
                    }
                    }>{<Icon24Back/>}</UI.HeaderButton>}>На карте</UI.PanelHeader>

                        <Geosuggest
                            placeholder="Введите место, где потеряна вещь"
                            onSuggestSelect={this.onSuggestSelect}
                            location={new google.maps.LatLng(53.558572, 9.9278215)}
                            radius={20}
                        />
                        <div>{this.state.thingLat}</div>
                        <div>{this.state.thingLng}</div>
                        {this.state.thingLat && <MyMapComponent isMarkerShown
                                                                containerElement={<div style={{height: `400px`}}/>}
                                                                mapElement={<div style={{height: `100%`}}/>}
                                                                lat={this.state.thingLat}
                                                                lng={this.state.thingLng}
                                                                onClick={x => {
                                                                    const lat = x.latLng.lat();
                                                                    const lng = x.latLng.lng();
                                                                    this.setState({
                                                                        thingLat: parseFloat(lat),
                                                                        thingLng: parseFloat(lng)
                                                                    });
                                                                }}
                        />}
                        <UI.Button style={{margin: '5px'}} size="xl" level="commerce" onClick={() => {
                            this.setState({placeName: this.state.placeNameInter !== null ? this.state.placeNameInter : "Не выбрано"});
                            this.setState({isClickedMap: false})
                        }}>Подтвердить</UI.Button>
                    </UI.Div> :


                    <UI.Div>
                        <UI.PanelHeader key="editFoundThing" left={<UI.HeaderButton onClick={() => {
                            this.props.setPanel("myAds");
                        }
                        }>{<Icon24Back/>}</UI.HeaderButton>}>Редактирование</UI.PanelHeader>
                        <UI.Group title="Информация">
                            <UI.List>
                                <UI.Cell><UI.InfoRow
                                    title={<div>Название <span style={{color: "#4CAF50"}}>*</span></div>}>
                                    <UI.Input type="text" value={this.state.thingInfo.name}
                                              name="name"
                                              onChange={this.onInputChange}/>
                                </UI.InfoRow></UI.Cell>

                                <UI.Cell><UI.InfoRow
                                    title={<div>Категория<span style={{color: "#4CAF50"}}>*</span></div>}><UI.Select
                                    top="Категория"
                                    placeholder="Выберите категорию"
                                    value={this.state.thingInfo.category}
                                    name="category"
                                    onChange={this.onInputChange}>
                                    <option value="одежда">Одежда</option>
                                    <option value="обувь">Обувь</option>
                                    <option value="электроника">Электроника</option>
                                    <option value="канцтовары">Канцтовары</option>
                                    <option value="аксессуары">Аксессуары</option>
                                    <option value="документы">Документы</option>
                                    <option value="деньги">Деньги</option>
                                    <option value="другое">Другое</option>
                                </UI.Select></UI.InfoRow></UI.Cell>
                                <UI.Cell><UI.InfoRow
                                    title={<div>Описание<span style={{color: "#4CAF50"}}>*</span></div>}>
                                    <UI.Textarea top="Комментарий" value={this.state.thingInfo.comments}
                                                 name="comments" onChange={this.onInputChange}/>
                                </UI.InfoRow></UI.Cell>
                                <UI.Cell
                                    before={<UI.File input type="file" accept="image/*" capture
                                                     top="Загрузите ваше фото"
                                                     before={<Icon24Camera/>} size="l"
                                                     onChange={this.selectFile.bind(this)}>
                                        Загрузить фото
                                    </UI.File>}
                                    asideContent={<UI.Avatar type="image" src={this.state.imageDownloaded}/>}>


                                </UI.Cell>

                            </UI.List>
                        </UI.Group>
                        <UI.Group title={<div>Местоположение<span style={{color: "#4CAF50"}}>*</span></div>}>
                            <UI.Div>
                                <UI.Button size = "xl"  before={<Icon24Map/>} onClick={() => {
                                    this.setState({isClickedMap: true});
                                }}>
                                    Указать на карте
                                </UI.Button>
                            </UI.Div>
                            <UI.Div>
                                <UI.InfoRow title="Место потери">
                                    {this.state.placeName}</UI.InfoRow>
                            </UI.Div>
                        </UI.Group>
                        <UI.Group title="Дата и время" align="center">
                            <UI.Cell>
                                <Flatpickr
                                    data-enable-time
                                    value={this.state.startDate}
                                    onChange={date => {
                                        this.setState({startDate: date})
                                    }}
                                />

                            </UI.Cell>
                        </UI.Group>
                        <UI.Group title="Контакты">
                            <UI.FormLayout>
                                <UI.Button size = "xl" onClick = {() => {connect.send("VKWebAppGetPersonalCard", {"type": ["phone", "email"]})}}>Оставить контакты</UI.Button>
                                <UI.Input top="Телефон" value={this.state.thingInfo.phone}
                                          onClic
                                          name="phone"
                                          onChange={this.onInputChange}/>
                                <UI.Input type="email" top="E-mail" value={this.state.thingInfo.email}
                                          name="email" onChange={this.onInputChange}/>
                            </UI.FormLayout>
                        </UI.Group>
                        <UI.Group>
                            <UI.Button size="xl" level="commerce" onClick={() => this.updateLostThing()}>
                                Обновить
                            </UI.Button>
                        </UI.Group>
                    </UI.Div>
                }
            </UI.Panel>
        )
    }
}

export default EditLostThing;