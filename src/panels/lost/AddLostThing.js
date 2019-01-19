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


class AddLostThing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            thingLat: null,
            thingLng: null,
            placeNameInter: null,
            placeName: null,
            activePanel: "addThing",
            startDate: new Date(),
            image: null,
            isClickedMap: false,
            imageDownloaded: null,
            phone: null,
            email: null,
            thingInfo: {
                name: 'тук',
                category: 'тук',
                place: 'тук',
                comments: 'тук',
                phone: null,
                email: null
            }
        };
        this.addLostThing = this.addLostThing.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);
    }

    componentDidMount() {
        this.hydrateStateWithLocalStorage();

        // add event listener to save state to localStorage
        // when user leaves/refreshes the page
        window.addEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );
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
                default:
                    alert("error");
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );

        // saves if component has a chance to unmount
        this.saveStateToLocalStorage();
    }

    addLostThing() {
        this.formData = new FormData();

        this.formData.append('name', this.state.thingInfo.name);
        this.formData.append('userId', this.props.userId);
        this.formData.append('category', this.state.thingInfo.category);
        this.formData.append('place', this.state.thingLat && (this.state.thingLat.toString() + "," + this.state.thingLng.toString()));
        this.formData.append('comments', this.state.thingInfo.comments);
        this.formData.append('date', this.state.startDate.toLocaleString());
        this.formData.append("image", this.state.image);

        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/addLostThing.php',
                type: 'POST',
                contentType: false,
                processData: false,
                data: this.formData
            }
        ).done(function (data) {
            alert(data);
        });
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
        console.log(event.target.files[0]);
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

    hydrateStateWithLocalStorage() {
        for (let key in this.state) {
            if (key === "imageDownloaded") continue;
            if (localStorage.hasOwnProperty(key)) {

                let value = localStorage.getItem(key);

                try {
                    value = JSON.parse(value);
                    this.setState({[key]: value});
                } catch (e) {
                    this.setState({[key]: value});
                }
            }
        }
    }

    saveStateToLocalStorage() {
        for (let key in this.state) {
            if (key === "imageDownloaded") continue;
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }
    }


    render() {
        return (
            <UI.Panel id={this.props.id}>
                {this.state.isClickedMap ? <UI.Div><UI.PanelHeader key="mapLost" left={<UI.HeaderButton onClick={() => {
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
                        <UI.PanelHeader key="addThing" left={<UI.HeaderButton onClick={() => {
                            this.props.setPanel("myAds");
                        }
                        }>{<Icon24Back/>}</UI.HeaderButton>}>Добавление потеряшки</UI.PanelHeader>
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
                                    <option value="люди">Люди</option>
                                    <option value="документы">Документы</option>
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
                            <UI.Cell before={<UI.Button before={<Icon24Map/>} onClick={() => {
                                this.setState({isClickedMap: true});
                            }}>
                                Указать на карте
                            </UI.Button>}
                                     asideContent={this.state.placeName && <UI.InfoRow title="Место потери">
                                         {this.state.placeName}
                                     </UI.InfoRow>}>

                            </UI.Cell>
                        </UI.Group>
                        <UI.Group title="Дата и время" align="center">
                            <UI.Cell>
                                <Flatpickr
                                    data-enable-time
                                    options={
                                        {
                                            maxDate: "today"
                                        }
                                    }
                                    value={this.state.startDate}
                                    onChange={date => {
                                        this.setState({date})
                                    }}
                                />

                            </UI.Cell>
                        </UI.Group>
                        <UI.Group title="Контакты">
                            <UI.FormLayout>
                                <UI.Input type="number" top="Телефон" value={this.state.thingInfo.phone}
                                          onClic
                                          name="phone"
                                          onClick={() => {
                                              connect.send("VKWebAppGetPhoneNumber", {})
                                          }}
                                          onChange={this.onInputChange}/>
                                <UI.Input type="email" top="E-mail" value={this.state.thingInfo.email} onClick={() => {
                                    connect.send("VKWebAppGetEmail", {})
                                }
                                } name="email" onChange={this.onInputChange}/>
                            </UI.FormLayout>
                        </UI.Group>
                        <UI.Group>
                            <UI.Button size="xl" level="commerce" onClick={() => this.addLostThing()}>
                                Добавить
                            </UI.Button>
                        </UI.Group>
                    </UI.Div>
                }
            </UI.Panel>
        )
    }
}

export default AddLostThing;