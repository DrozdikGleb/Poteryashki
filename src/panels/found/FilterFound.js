import React from 'react';
import * as UI from "@vkontakte/vkui";
import DatePicker from "react-datepicker/es";
import $ from "jquery";
import Icon24Back from "@vkontakte/icons/dist/24/back";


class FilterFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            activePanel: "filterFound",
            found_array: [],
            thingInfo: {
                category: 'тук'
            }
        };
        this.handleDataChange = this.handleDataChange.bind(this);
        this.makeFilterRequest = this.makeFilterRequest.bind(this);
        this.printThingInfo = this.printThingInfo.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    handleDataChange(date) {
        this.setState({
            startDate: date
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

    makeFilterRequest() {
        $.ajax(
            {
                url: 'https://degi.shn-host.ru/lostthings/filterByFound.php',
                type: 'POST',
                dataType: "json",
                data: {
                    category: this.state.thingInfo.category,
                }
            }
        ).done(function (data) {
            this.setState({found_array: data['result']})
        }.bind(this));
    }

    printThingInfo(thing) {
        return <UI.Group title='Найденная вещь'>
            <UI.List>
                <UI.Cell asideContent={<UI.Div>{thing.date}</UI.Div>}>
                    <UI.InfoRow title="наименование">
                        {thing.name}
                    </UI.InfoRow>
                </UI.Cell>
                <UI.Cell>
                    <UI.InfoRow title="Категория">
                        {thing.category}
                    </UI.InfoRow>
                </UI.Cell>
            </UI.List>
        </UI.Group>
    }

    render() {
        return (
            <UI.Panel id='filterFound'>
                <UI.PanelHeader noShadow left={<UI.HeaderButton onClick={() => {
                    this.props.setPanel("found");
                }
                }>{<Icon24Back/>}</UI.HeaderButton>}>Фильтр</UI.PanelHeader>
                <UI.FormLayout>
                    <UI.Select top="Категория" placeholder="Выберите категорию"
                               value={this.state.thingInfo.category}
                               name="category"
                               onChange={this.onInputChange}
                    >
                        <option value="одежда">Одежда</option>
                        <option value="люди">Люди</option>
                        <option value="документы">Документы</option>
                    </UI.Select>
                    <UI.Div align="center">
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleDataChange}
                            placeholderText="Нажмите для выбора даты и времени"
                            locale="ru"
                            dateFormat="d MMMM yyyy"
                            timeCaption="Время"
                        />
                    </UI.Div>
                    <UI.Checkbox>Рядом со мной</UI.Checkbox>
                    <UI.Div align="center">
                        <UI.Button onClick={() => this.makeFilterRequest()}>
                            Показать
                        </UI.Button>
                    </UI.Div>
                </UI.FormLayout>
                {this.state.found_array && this.state.found_array.map(thing => this.printThingInfo(thing))}
            </UI.Panel>
        )
    }
}

export default FilterFound;