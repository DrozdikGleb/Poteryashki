import React, {Component} from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import MainScreen from './panels/MainScreen';

class App extends Component {

    componentWillMount() {
    }

    render() {
        let activePanel = this.props.pageId === 'about' ? 'aboutPanel' : 'mainScreen';
        // isWebView={isWebView}
        return (
            <UI.ConfigProvider insets={this.props.insets} >
                <UI.Root activeView="mainView">
                    <UI.View id="mainView" activePanel={activePanel}>
                        <MainScreen id="mainScreen" accessToken={this.props.accessToken}/>
                    </UI.View>
                </UI.Root>
            </UI.ConfigProvider>
        );
    }
}

// export default connect(mapStateToProps)(App);
export default App;