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
    }

    componentDidMount() {

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
                url: 'http://degi.shn-host.ru/lostthings/addLostThing.php',
                type: 'POST',
                contentType: false,
                processData: false,
                data: this.formData
            }
        ).done(function (data) {
            alert(data);
        })
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

    selectFile(e) {
        console.log(e.target.files);
        this.state.image = e.target.files[0];
    }


    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="addThing" activePanel="addThing">
                    <UI.Panel id='addThing'>
                        <UI.PanelHeader key="addThing" left={<UI.HeaderButton onClick={this.props.go
                        } data-to="lost">{<Icon24Back/>}</UI.HeaderButton>}>Добавление потеряшки</UI.PanelHeader>
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
                                <UI.Cell>
                                    <UI.Avatar src="https://pp.userapi.com/c837122/v837122442/52e4a/YBw6FdAxcC8.jpg">

                                    </UI.Avatar>
                                    <UI.File input type="file" accept="image/*" capture top="Загрузите ваше фото"
                                             before={<Icon24Camera/>} size="l"
                                             onChange={this.selectFile.bind(this)}>
                                        Загрузить фото
                                    </UI.File>
                                </UI.Cell>

                            </UI.List>
                        </UI.Group>
                        <UI.Group title="Местоположение">
                            <UI.Cell>
                                <UI.Button onClick={this.props.go} data-to="map">
                                    Указать на карте
                                </UI.Button>
                            </UI.Cell>
                        </UI.Group>
                        <UI.Group title="Дата и время" align="center">
                            <UI.Cell >
                                <Flatpickr
                                    data-enable-time
                                    options = {
                                        {
                                            maxDate:"today"
                                        }
                                    }
                                    value={this.state.startDate}
                                    onChange={date => { this.setState({date}) }}
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
                </UI.View>
            </UI.Root>
        )
    }
}

export default AddLostThing;