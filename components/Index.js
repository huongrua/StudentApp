/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 import React, {Component} from 'react';
 import {
   Text,
   View,
   Navigator
 }
from 'react-native';
import Login from "../components/Login.js";
import Home from "../components/Home.js";
export default class Index extends Component {
  renderScene(route,navigator){
    switch (route.name) {
      case "login": return(<Login navigator={navigator}/>);
      case "home": return(<Home navigator={navigator} {...route.passProps}/>);      
    }
  }
  render() {
    return (
      <View  style={{flex:1}}>
      <Navigator
      initialRoute={{name:"login"}}
      renderScene={this.renderScene.bind(this)}
      configureScene={(route, routeStack) =>
        Navigator.SceneConfigs.FadeAndroid}
      />
      </View>
    );
  }
}
