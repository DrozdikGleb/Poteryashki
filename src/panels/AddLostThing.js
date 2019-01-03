import React from 'react';
import * as UI from "@vkontakte/vkui";
import $ from 'jquery'


class AddLostThing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: "addThing",
            thingInfo: {
                name: 'тук',
                category: 'тук',
                place: 'тук',
                comments: 'тук'
            }
        };
        this.addLostThing = this.addLostThing.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    addLostThing() {
        $.ajax(
            {
                url: 'http://degi.shn-host.ru/lostthings/addLostThing.php',
                type: 'GET',
                dataType: "json",
                data: {
                    name: this.state.thingInfo.name,
                    category: this.state.thingInfo.category,
                    place: this.state.thingInfo.place,
                    comments: this.state.thingInfo.comments
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


    render() {
        return (
            <UI.Root activeView={this.state.activePanel}>
                <UI.View id="addThing" activePanel="addThing">
                    <UI.Panel id='addThing'>
                        <UI.PanelHeader>Добавление потеряшки</UI.PanelHeader>
                        <UI.FormLayout>
                            <UI.Input type="text" top="Название" value={this.state.thingInfo.name} name="name"
                                      onChange={this.onInputChange}/>
                            <UI.Select top="Категория" placeholder="Выберите категорию">
                                <option value="clothes">Одежда</option>
                                <option value="people">Люди</option>
                                <option value="documents">Документы</option>
                            </UI.Select>
                            <UI.Button>
                                Указать на карте
                            </UI.Button>
                            <UI.Textarea top="Комментарий"/>
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