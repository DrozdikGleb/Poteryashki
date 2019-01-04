import React from 'react';
import * as UI from "@vkontakte/vkui";
import Icon24Back from '@vkontakte/icons/dist/24/back';
import $ from 'jquery'
import DatePicker, {registerLocale} from 'react-datepicker'
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
            thingInfo: {
                name: 'тук',
                category: 'тук',
                place: 'тук',
                comments: 'тук'
            }
        };
        this.addLostThing = this.addLostThing.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
    }

    addLostThing() {
        $.ajax(
            {
                url: 'http://degi.shn-host.ru/lostthings/addLostThing.php',
                type: 'POST',
                dataType: "json",
                data: {
                    name: this.state.thingInfo.name,
                    category: this.state.thingInfo.category,
                    place: this.state.thingInfo.place,
                    comments: this.state.thingInfo.comments,
                    date: this.state.startDate.toLocaleString()
                }
            }
        ).done(function (data) {
            alert(JSON.stringify(data));
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

    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="addThing" activePanel="addThing">
                    <UI.Panel id='addThing'>
                        <UI.PanelHeader key="addThing" left={<UI.HeaderButton onClick={this.props.go
                        } data-to = "lost">{<Icon24Back/>}</UI.HeaderButton>}>Добавление потеряшки</UI.PanelHeader>
                        <UI.FormLayout>
                            <UI.Input type="text" top="Название" value={this.state.thingInfo.name} name="name"
                                      onChange={this.onInputChange}/>
                            <UI.Select top="Категория" placeholder="Выберите категорию"
                                       value={this.state.thingInfo.category}
                                       name="category" onChange={this.onInputChange}>
                                <option value="одежда">Одежда</option>
                                <option value="люди">Люди</option>
                                <option value="документы">Документы</option>
                            </UI.Select>

                            <UI.Button onClick = {this.props.go} data-to = "map">
                                Указать на карте
                            </UI.Button>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleDataChange}
                                placeholderText="Нажмите для выбора даты и времени"
                                locale="ru"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="d MMMM, yyyy HH:MM"
                                timeCaption="Время"
                            />
                            <UI.Textarea top="Комментарий" value={this.state.thingInfo.comments}
                                         name="comments" onChange={this.onInputChange}/>
                            <UI.Button align="center" onClick={() => this.addLostThing()}>
                                Добавить
                            </UI.Button>
                        </UI.FormLayout>
                    </UI.Panel>
                </UI.View>
            </UI.Root>
        )
    }
}

export default AddLostThing;