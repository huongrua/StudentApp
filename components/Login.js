/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Alert,
  AsyncStorage
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  InputGroup,
  Input,
  Card,
  CardItem,
  Icon,
  Button
} from 'native-base';
import GLOBAL from "../components/Global.js";
export default class Login extends Component{
  constructor(props){
    super(props);
    this.state={
      username:"",
      password:"",
      token:"",
      message:""
    };
    this.checktoken();
  }
  render(){
    return (
              <Container>
                  <Header style = {styles.header}>
                      <Title>
                      Đăng nhập
                      </Title>
                  </Header>
                  <Content>
                      <Card style={styles.card}>
                           <CardItem>
                              <View>
                               <Image style={{ height:76, width:217}} source={require('../img/logo.png')} />
                               </View>
                           </CardItem>
                      </Card>
                          <Text style={styles.text}>Tên đăng nhập</Text>
                          <InputGroup borderType='rounded'>
                            <Icon name='ios-contact' style={{color:'#384850'}}/>
                            <Input onChangeText={(username) => this.setState({username})}
                              value={this.state.username}
                            />
                          </InputGroup>
                          <Text style={styles.text}>Mật khẩu</Text>
                          <InputGroup borderType='rounded'>
                              <Icon name='ios-unlock' style={{color:'#384850'}}/>
                              <Input secureTextEntry onChangeText={(password)=>this.setState({password})}
                              value={this.state.password}
                              />
                          </InputGroup>
                          <Button rounded style={{ alignSelf: 'center', width: 200, backgroundColor: '#00AAAD',marginTop: 10, marginBottom: 10 }} onPress={()=>{this.ClickCheck()}}>
                            Đăng nhập
                          </Button>
                          <View style={{justifyContent:'center', alignItems:'center'}}><Text>{this.state.message}</Text></View>

                  </Content>
              </Container>
          );
  }

  redirect(routeName, token, customerid, customername){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        accessToken: token,
        customerid: customerid,
        customername: customername
      }
    })
  }
  ClickCheck(){
    fetch(GLOBAL.BASE_URL+'/api/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson.UserName);
            this.savetoken(responseJson.key);
            if(responseJson.tag=="1"){
              this.setState({
                message: "",
                token: responseJson.key
              });              
              let accessToken = responseJson.key;              
              this.redirect('home', accessToken)
            }
            else {
              this.setState({
                message: "Ten hoac mat khau khong dung!"
              });
            }
      })
      .catch((error) => {
        //console.error(error);
      });
  }
  //luu lai token khi dang nhap
  savetoken = async(e)=>{
    await AsyncStorage.setItem('@Token:key', e);
  }  
  //Kiem tra token khi chay lai app
  checktoken = async()=>{
    try {      
      const value = await AsyncStorage.getItem('@Token:key');
      if (value !== null){
        // We have data!!
        //console.log(value)
        fetch(GLOBAL.BASE_URL+'/api/check', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: value,
        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
              if(responseJson.tag=="1"){
                this.setState({
                  message: ""
                });                                               
                this.redirect('home', value)
              }
              else {
                this.setState({
                  message: "Phiên làm việc đã hết!"
                });                 
              }
        })
        .catch((error) => {
          //console.error(error);
        });
        //console.log(value);
        this.setState({
          token: value
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  }
}
const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#00AAAD',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 5,
    marginBottom: 5,
  },
});
