import React from 'react';
import * as UI from "@vkontakte/vkui";
import $ from "jquery";
import Icon24Search from "@vkontakte/icons/dist/24/search";
import 'flatpickr/dist/themes/material_green.css'
import Flatpickr from 'react-flatpickr'
import "react-datepicker/dist/react-datepicker.css";
import '../../styles/my_picker_style.css'
import moment from "moment";
import Icon24Back from "@vkontakte/icons/dist/24/back";


class FilterLost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenDate: null,
            timeFrom: null,
            timeTo: null,
            activePanel: "filterLost",
            lost_array: [],
            thingInfo: {
                category: null,
                name:null
            }
        };
        this.makeFilterRequest = this.makeFilterRequest.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
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

    makeFilterRequest() {
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/filterBy.php',
                type: 'GET',
                dataType: "json",
                data: {
                    table: "lost",
                    date: this.state.chosenDate,
                    timeFrom: this.state.timeFrom,
                    timeTo: this.state.timeTo,
                    name: this.state.thingInfo.name,
                    category: this.state.thingInfo.category,
                }
            }
        ).done(function (data) {
            this.props.setFilteredArray(data['result']);
            this.props.setPanel("lost");
        }.bind(this));
    }

    render() {
        return (
            <UI.Panel id='filterLost'>
                <UI.PanelHeader noShadow left={<UI.HeaderButton onClick={() => {
                    this.props.setPanel("lost");
                }
                }>{<Icon24Back/>}</UI.HeaderButton>}>Фильтр</UI.PanelHeader>
                <UI.Group>
                    <UI.FormLayout>
                        <UI.FormLayout>
                            <UI.Input type="Наименование" top="Наименование"
                                      value={this.state.thingInfo.name}
                                      name="name"
                                      onChange={this.onInputChange}/>
                        </UI.FormLayout>
                        <UI.Select top="Категория" placeholder="Выберите категорию"
                                   value={this.state.thingInfo.category}
                                   name="category"
                                   onChange={this.onInputChange}
                        >
                            <option value="одежда">Одежда</option>
                            <option value="люди">Люди</option>
                            <option value="документы">Документы</option>
                            <option value="другое">Другое</option>
                        </UI.Select>

                        <UI.Div align="left">
                            <UI.InfoRow title="Выберите дату и время потери">
                                <Flatpickr
                                    value={this.state.chosenDate}
                                    options={
                                        {
                                            maxTime: "today"
                                        }
                                    }
                                    onChange={date => {
                                        this.setState({chosenDate: moment(date.toString()).format('YYYY-MM-DD')})
                                    }}
                                />
                            </UI.InfoRow>

                            <UI.InfoRow title="От"><Flatpickr
                                options={
                                    {
                                        enableTime: "true",
                                        noCalendar: "true",
                                        dateFormat: "H:i",
                                        time_24hr: true
                                    }
                                }
                                value={this.state.timeFrom}
                                onChange={time => {
                                    this.setState({timeFrom: moment(time.toString()).format('H:mm')})
                                }}
                            /></UI.InfoRow>

                            <UI.InfoRow title="До">
                                <Flatpickr
                                    data-disable-time
                                    options={
                                        {
                                            enableTime: "true",
                                            noCalendar: "true",
                                            dateFormat: "H:i",
                                            time_24hr: true
                                        }
                                    }
                                    value={this.state.timeTo}
                                    onChange={time => {
                                        this.setState({timeTo: moment(time.toString()).format('H:mm')})
                                    }}
                                />
                            </UI.InfoRow>
                        </UI.Div>
                        <UI.Div align="center">
                            <UI.Button size = "xl" before={<Icon24Search/>} onClick={() => this.makeFilterRequest()}>
                                Показать
                            </UI.Button>
                        </UI.Div>
                    </UI.FormLayout>
                </UI.Group>
            </UI.Panel>
        )
    }
}

export default FilterLost;