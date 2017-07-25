/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Index from './components/Index.js';
export default class ShopApp extends Component {
  render() {
    return (
      <Index/>
    );
  }
}
AppRegistry.registerComponent('ShopApp', () => ShopApp);
