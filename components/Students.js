/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import 
{
View,
Text,
TextInput,
ListView,
StyleSheet,
TouchableOpacity,
Modal,
TouchableHighlight,
Alert,
alertMessage,
Image,
AsyncStorage
}
from 'react-native';

import GLOBAL from "../components/Global.js";
export default class Students extends Component{
    constructor(props){
        super(props);        
        this.state = {
            modalVisible: false,
            loading: true,
            studentid:'',
            studentname:'',
            address:'',
            age:20,
            students: [],
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1!=r2}),
            action:'',
            title: ''
        }
    }
    student(studentid, studentname, age){
        this.studentid = studentid;
        this.studentname = studentname;
        this.age = age;
    }
    setModalVisible(visible){
        this.setState({
            modalVisible:visible
        });
    }   
    addStudent(visible){
        this.setState({
            modalVisible:visible,
            studentname: '',
            age: 20,
            action:'new',
            title: 'Thêm mới sinh viên'
        });
    }    
    updateStudent = async(visible)=>{
        var _data = await this.state.students.slice(0);  
        var token = await AsyncStorage.getItem('@Token:key');             
        if (this.state.action=='new'){
            var indexOfItem = _data.findIndex((x) => x.studentid === this.state.studentid);  
            console.log(indexOfItem);
            if(indexOfItem!=-1){
                Alert.alert(
                'Mã sinh viên này đã tồn tại?',
                alertMessage,
                [
                    {text: 'Ok', onPress: () => console.log('Cancel Pressed!')},                    
                ]
                );                
            } 
            else{
                _data.push(new this.student(this.state.studentid, this.state.studentname, this.state.age));
                this.setState({
                    modalVisible:visible,
                    students: _data,
                    dataSource: this.state.dataSource.cloneWithRows(_data)
                });    
                fetch(GLOBAL.BASE_URL+'/api/student', {
                method: 'POST', 
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "StudentId": this.state.studentid,
                    "StudentName": this.state.studentname,
                    "Address": this.state.address,
                    "Age": this.state.age,
                    "token": token
                })
                });  
            }                        
        }
        if (this.state.action=='edit'){                       
             var indexOfItem = _data.findIndex((x) => x.studentid === this.state.studentid);     
             _data[indexOfItem] = {
                 studentid: this.state.studentid,
                 studentname: this.state.studentname,
                 age: this.state.age.toString()
             }             
             this.setState({
                modalVisible:visible,
                students: _data,
                dataSource: this.state.dataSource.cloneWithRows(_data)
            });    
             
            fetch(GLOBAL.BASE_URL+'/api/student/'+this.state.studentid, {
            method: 'PUT', 
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "StudentName": this.state.studentname,
                "Address": this.state.address,
                "Age": this.state.age,
                "token": token
            })
            });  
        }
        
             
    }  
     editStudent(visible, rowdata){        
        this.setState({
            modalVisible:visible,
            studentid: rowdata.studentid,
            studentname: rowdata.studentname,
            age: rowdata.age,
            action:'edit',
            title: 'Sửa sinh viên'
        });       
    }  
    deleteStudent = async(visible, rowdata)=>{  
        var _data = await this.state.students.slice(0);    
        var token = await AsyncStorage.getItem('@Token:key');                     
        var indexOfItem = _data.findIndex((x) => x.studentid === rowdata.studentid);        
        if(indexOfItem!=-1){
        _data.splice(indexOfItem, 1);
        }        
        this.setState(
        {            
            dataSource: this.state.dataSource.cloneWithRows(_data),
            students: _data
        }
        );
        var token = await AsyncStorage.getItem('@Token:key');
        fetch(GLOBAL.BASE_URL+'/api/student/'+rowdata.studentid, {method: 'DELETE', headers:{'Authorization': token}})            
    }  

    render(){
        return(
            <View style={styles.container}>            
            <View style={styles.list}>
                <ListView enableEmptySections = {true} dataSource = {this.state.dataSource}
                renderRow={(rowdata) => 
                <TouchableOpacity onPress={() => {this.editStudent(true, rowdata)}}>
                <View style={styles.rowlst}>
                    <View style={{flex:1, padding:10, justifyContent:'center', alignItems:'flex-start'}}>
                        <Text>{rowdata.studentid}</Text>
                    </View>
                    <View style={{flex:3, padding:10, justifyContent:'center', alignItems:'flex-start'}}>
                         <Text>{rowdata.studentname}</Text>
                    </View>      
                    <View style={{flex:1, padding:10, justifyContent:'center', alignItems:'flex-end'}}>
                         <Text>{rowdata.age.toString()}</Text>
                    </View>                                                              
                    
                    <View style={{flex:1/2, padding:1, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity onPress={() => 
                                              Alert.alert(
                                                'Bạn có muốn xóa sinh viên này không?',
                                                alertMessage,
                                                [
                                                  {text: 'Không', onPress: () => console.log('Cancel Pressed!')},
                                                  {text: 'Có', onPress: () =>   {this.deleteStudent(true, rowdata)}},
                                                ]
                                              )}>
                         <Image
                            style={{width:15, height:15}}
                            source={require('../img/delete_icon.png')}
                            />
                         </TouchableOpacity>  
                    </View> 
                    
                </View>
                </TouchableOpacity>
                }
                />
            </View>
            <View style={{flex:10}}>
                        </View>            
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}
                >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{this.state.title}</Text>                    
                    </View>
                    <View style={styles.body}>
                        <View style={styles.rows}>
                            <View style={{flex:1}}>
                                <Text>Mã SV</Text>
                            </View>
                            <View style={{flex:3, flexDirection:'row'}}>
                                <View style={{flex:1}}>   
                                    <TextInput
                                    style={{borderColor: 'gray', borderBottomWidth: 0, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth:0}}
                                    onChangeText={(studentid) => this.setState({studentid})}
                                    value={this.state.studentid}
                                    />                              
                                </View>
                                <View style={{flex:1}}>                                 
                                </View>                                 
                            </View>                            
                        </View>
                        <View style={styles.rows}>
                            <View style={{flex:1}}>
                                <Text>Tên SV</Text>
                            </View>
                            <View style={{flex:3}}>
                                 <TextInput
                                    style={{borderColor: 'gray', borderBottomWidth: 0, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth:0}}
                                    onChangeText={(studentname) => this.setState({studentname})}
                                    value={this.state.studentname}
                                />
                            </View>
                        </View>
                        <View style={styles.rows}>
                            <View style={{flex:1}}>
                                <Text>Tuổi</Text>
                            </View>
                            <View style={{flex:3, flexDirection:'row'}}>
                                <View style={{flex:1}}>   
                                    <TextInput keyboardType = 'numeric'
                                    style={{borderColor: 'gray', borderBottomWidth: 0, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth:0}}
                                    onChangeText={(age) => this.setState({age})}
                                    value={this.state.age.toString()}
                                    />                              
                                </View>
                                <View style={{flex:1}}>                                 
                                </View>                                 
                            </View>                            
                        </View>
                        <View style={{flex:10}}>
                        </View>
                    </View>
                    <View style={styles.bottom}>
                        <View style={styles.button}>
                        <TouchableHighlight onPress={() => {
                            this.updateStudent(!this.state.modalVisible)
                            }}>
                            <Text style={styles.title}>Nhận</Text>
                        </TouchableHighlight>
                        </View>
                        <View style={styles.button}>
                        <TouchableHighlight onPress={() => {
                            this.setModalVisible(!this.state.modalVisible)
                            }}>
                            <Text style={styles.title}>Hủy</Text>
                        </TouchableHighlight>
                        </View>
                    </View>
                    
                </View>
            </Modal>
            
            </View>
        );
    }
    componentDidMount(){ 
        this.loaddata();           
    }
    loaddata = async()=>{             
        var token = await AsyncStorage.getItem('@Token:key');        
        if (token == null){
            token = '';
        }  
        var _data = [];         
        fetch(GLOBAL.BASE_URL+'/api/student', {method: 'GET', headers:{'Authorization': token}})
          .then((response) => response.json())
          .then((responseJson) => {              
              _data = _data.concat(responseJson.recordsets[0]);              
              this.setState({
                  dataSource: this.state.dataSource.cloneWithRows(_data),  
                  students: _data,                
                  loading: false
              });
          })
          .catch((error) => {
              this.setState({
                  loading: false,
                  students: _data,
                  dataSource: this.state.dataSource.cloneWithRows(_data)
              });
              console.error(error);
        });         
    }
}
const styles = StyleSheet.create(
    {
        container:{
            flex:1,
            flexDirection:'column'
        },
        header:{
            flex:1,
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',            
        },
        title:{
            color:'#00AAAD',
            fontSize: 18
        },     
        headerlst:{
            flex:2/5,
            flexDirection: 'row',
            backgroundColor: '#00AAAD',
            alignItems: 'center',
            justifyContent:  'center',
            marginTop: 10,
            marginLeft: 2,
            marginRight: 2
        },  
        rowlst:{
            flex:2,
            flexDirection: 'row',            
            marginLeft: 2,
            marginRight: 2,
            padding: 2,                        
            borderBottomWidth: 0.5,
            borderBottomColor: '#00AAAD'
        },   
        list:{
            flex:9
        },
        body:{
            flex:9,
            flexDirection:'column',
            alignItems: 'flex-start',
            justifyContent: 'center'
        },
        rows:{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10
        },
        bottom:{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center'
        },
        button:{
            flex:1,
            alignItems:'center',
            justifyContent:'center'
        },
        actionButtonIcon: {
            fontSize: 20,
            height: 22,
            color: 'white',
        },        

    }
);
