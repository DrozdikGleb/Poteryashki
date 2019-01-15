import React from 'react';
import * as UI from "@vkontakte/vkui";
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Camera from '@vkontakte/icons/dist/24/camera';
import $ from 'jquery';
import DatePicker, {registerLocale} from 'react-datepicker'
import {DateFormatInput, TimeFormatInput} from 'material-ui-next-pickers'
import 'flatpickr/dist/themes/material_green.css'
import Flatpickr from 'react-flatpickr'
import "react-datepicker/dist/react-datepicker.css";
import '../styles/my_picker_style.css'
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);


class AddLostThing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: "addThing",
            startDate: new Date(),
            image: null,
            imageDownloaded: null,
            thingInfo: {
                name: 'тук',
                category: 'тук',
                place: 'тук',
                comments: 'тук',
                phone: '-'
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
        this.formData.append('place', this.props.lat && (this.props.lat.toString() + "," + this.props.lng.toString()));
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
                <UI.PanelHeader key="addThing" left={<UI.HeaderButton onClick={() => {
                    this.props.setPanel("lost");
                }
                }>{<Icon24Back/>}</UI.HeaderButton>}>Добавление потеряшки</UI.PanelHeader>
                <UI.Group title="Информация">
                    <UI.List>
                        <UI.Cell><UI.InfoRow title="Название">
                            <UI.Input type="text" value={this.state.thingInfo.name}
                                      name="name"
                                      onChange={this.onInputChange}/>
                        </UI.InfoRow></UI.Cell>

                        <UI.Cell><UI.InfoRow title="Категория"><UI.Select top="Категория"
                                                                          placeholder="Выберите категорию"
                                                                          value={this.state.thingInfo.category}
                                                                          name="category"
                                                                          onChange={this.onInputChange}>
                            <option value="одежда">Одежда</option>
                            <option value="люди">Люди</option>
                            <option value="документы">Документы</option>
                        </UI.Select></UI.InfoRow></UI.Cell>
                        <UI.Cell><UI.InfoRow title="Описание">
                            <UI.Textarea top="Комментарий" value={this.state.thingInfo.comments}
                                         name="comments" onChange={this.onInputChange}/>
                        </UI.InfoRow></UI.Cell>
                        <UI.Cell before={<UI.File input type="file" accept="image/*" capture top="Загрузите ваше фото"
                                                  before={<Icon24Camera/>} size="l"
                                                  onChange={this.selectFile.bind(this)}>
                            Загрузить фото
                        </UI.File>}
                                 asideContent={<UI.Avatar type="image" src={this.state.imageDownloaded}/>}>


                        </UI.Cell>

                    </UI.List>
                </UI.Group>
                <UI.Group title="Местоположение">
                    <UI.Cell before={<UI.Button onClick={() => {
                        this.props.setPanel("map");
                    }}>
                        Указать на карте
                    </UI.Button>}
                             asideContent={this.props.placeName && <UI.InfoRow title="Место потери">
                                 {this.props.placeName}
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
                        <UI.Input type="phone" top="Телефон" value={this.state.thingInfo.phone}
                                  name="phone"
                                  onChange={this.onInputChange}/>
                        <UI.Input type="email" top="E-mail"/>
                        <UI.Checkbox>Связаться по ВК</UI.Checkbox>
                    </UI.FormLayout>
                </UI.Group>
                <UI.Group>
                    <UI.Button size="xl" level="commerce" onClick={() => this.addLostThing()}>
                        Добавить
                    </UI.Button>
                </UI.Group>
            </UI.Panel>
        )
    }
}

export default AddLostThing;