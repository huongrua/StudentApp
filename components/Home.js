/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage
}
from 'react-native';
import { Container, Content, InputGroup, Input, Footer, FooterTab, Header, Title, Button, Icon, Tabs, Badge, H1, H2 } from 'native-base';
import Students from "../components/Students.js";
import GLOBAL from "../components/Global.js";
export default class Home extends Component {
  constructor(props){
    super(props);        
  }
  logout = async(routeName)=> {
    try {
      await AsyncStorage.removeItem('@Token:key');
    } catch (error) {
      console.log(error.message);
    }
    this.props.navigator.push({
      name: routeName
    })
  }
      render() {
        return (
          <Container>
                    <Header style = {{backgroundColor:'#00AAAD',justifyContent:'center', alignItems:'center'}}>
                        <Button transparent onPress={()=>this.refs.reg.addStudent(true)}>
                          <Icon name="ios-add-circle-outline" />
                        </Button>                    
                        <Title><Text>Danh sách sinh viên</Text></Title>                        
                        <Button transparent onPress={()=>this.logout('login')}>
                          <Icon name="ios-log-out" />
                        </Button>  
                    </Header>
                    <Content>
                        <Students ref = "reg"/>
                    </Content>                    
            </Container>
        );
    }
  }
