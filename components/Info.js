import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { StyleSheet, Text,Button, View, TextInput,Alert, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { fetchUser } from '../redux/app-redux';

const mapStateToProps =(state) => {
  return{
    currentUser: state.currentUser,
  };
}

const mapDispatchToProps = (dispatch) =>{
  return { 
    fetchUser: () => {dispatch(fetchUser())},
   };
}


class Info extends React.Component {

  constructor(props){
    super(props);
    this.state={
      currentUser: this.props.currentUser,
      items:[],
      semester:'',
      gaurdPhone:'',
      myPhone:'',
      myPhoneNo:'',
    }
    this.props.fetchUser();
  }
  componentDidMount(){
  this.unsuscribeAuth = firebase.auth().onAuthStateChanged(user=>{
    if(user){
      this.setState({
        email:user.email,
      })
    }
    else{
      this.props.navigation.navigate("Landing");
    }
    })
  }
  componentWillUnmount(){
    this.unsuscribeAuth()
  }
  userSignout(){
    firebase.auth().signOut()
  }

  changeSem(){
    var number = this.state.myPhoneNo;
    if(number ==''){
      Alert.alert("Enter your phone no.");
    }
    else if(number != this.props.currentUser.phone){
      Alert.alert("Enter your correct phone no.");
    }
    else{
      firebase.firestore()
      .collection('teachers')
      .doc(firebase.auth().currentUser.uid)
      .update({
        sem: this.state.semester,
        phone: this.state.myPhoneNo,
      })
      .then(() => {
        Alert.alert("Semester changed successfully")
        firebase.firestore()
        .collection('teacherContacts')
        .doc(`${this.props.currentUser.branch}-sem${this.state.semester}`)
        .set({
          name: this.props.currentUser.name,
          phone: this.state.myPhoneNo,
          branch: this.props.currentUser.branch,
        })
        firebase.auth().signOut()
      })
      .catch((error) =>{
        Alert.alert(error.message)
      })
    }
  }
    changeGaurdNo(){
    firebase.firestore()
      .collection('teachers')
      .doc(firebase.auth().currentUser.uid)
      .update({
        gphone: this.state.gaurdPhone,
      })
      .then(() => {
        Alert.alert("Changed successfully")
      })
      .catch((error) =>{
        Alert.alert(error.message)
      })
  }
  changeNo(){
    firebase.firestore()
      .collection('teachers')
      .doc(firebase.auth().currentUser.uid)
      .update({
        phone: this.state.myPhone,
      })
      .then(() => {
        Alert.alert("Changed successfully")
        firebase.firestore()
        .collection('teacherContacts')
        .doc(this.props.currentUser.branch)
        .update({
          phone: this.state.myPhone,
          name: this.props.currentUser.name,
        })
      })
      .catch((error) =>{
        Alert.alert(error.message)
      })
  }
  changeTeacherNo(){
    firebase.firestore()
      .collection('teachers')
      .doc(firebase.auth().currentUser.uid)
      .update({
        phone: this.state.myPhone,
      })
      .then(() => {
        Alert.alert("Changed successfully")
        firebase.firestore()
        .collection('teacherContacts')
        .doc(`${this.props.currentUser.branch}-sem${this.props.currentUser.sem}`)
        .update({
          phone: this.state.myPhone,
        })
      })
      .catch((error) =>{
        Alert.alert(error.message)
      })
  }
    
  handleChangeD = e => {
    this.setState({
      semester: e.nativeEvent.text
    });
  };
  handleChange = e => {
    this.setState({
      gaurdPhone: e.nativeEvent.text
    });
  };
  handleChangeA = e => {
    this.setState({
      myPhone: e.nativeEvent.text
    });
  };

  handleChangeB = e => {
    this.setState({
      myPhoneNo: e.nativeEvent.text
    });
  };

      render(){
        if(this.props.currentUser.sem){
          
          return (
            <View style={styles.container}>
              <StatusBar barStyle="light-content" backgroundColor="#262A43"/>
              <View style={styles.infoView}>

              <Text style={styles.info}>
                  You are logged in as {this.state.email}
              </Text>
  
              <Text style={styles.info}>
                  And your username is {this.props.currentUser.name}
              </Text>
              <Text style={styles.info}>
                  From {this.props.currentUser.branch} branch {this.props.currentUser.sem}sem
              </Text>
              </View>
              
              <View style={{alignItems:'center'}}>
              <TextInput placeholder="Enter your phone no."
               keyboardType='numeric'
              style={styles.changBar}
                value={this.state.myPhoneNo}
                onChange={this.handleChangeB}
              />
              </View>
              <View style={{flexDirection:'row'}}>
              <TextInput placeholder='Change Semester'
               keyboardType='numeric'
              style={styles.changSemBar}
                value={this.state.semester}
                onChange={this.handleChangeD}
              />

              <TouchableOpacity style={styles.changeSemButton}
                onPress={()=>this.changeSem()}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Done</Text>
              </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', alignItems:'center'}}>
              <TextInput placeholder="Change Phone No."
               keyboardType='numeric'
              style={styles.changGaurdBar}
                value={this.state.myPhone}
                onChange={this.handleChangeA}
              />

              <TouchableOpacity style={styles.changeSemButton2}
                onPress={()=>this.changeTeacherNo()}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Done</Text>
              </TouchableOpacity>
              </View>
              <View style={{alignItems:'center',flexDirection:'row'}}>
              <TextInput placeholder="Change Gatekeeper's No."
               keyboardType='numeric'
              style={styles.changGaurdBar}
                value={this.state.gaurdPhone}
                onChange={this.handleChange}
              />

              <TouchableOpacity style={styles.changeSemButton2}
                onPress={()=>this.changeGaurdNo()}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Done</Text>
              </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.logoutButton}
                onPress={()=>this.userSignout()}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Logout</Text>
              </TouchableOpacity>
              </View>
          );
        }
        else{
          return (
            <View style={styles.container}>
              <StatusBar barStyle="light-content" backgroundColor="#262A43"/>
              <Text style={{textAlign:'center',color:'#fff'}}>
                  You are logged in as {this.state.email}
              </Text>
  
              <Text style={{textAlign:'center',color:'#fff'}}>
                  And your username is {this.props.currentUser.name}
              </Text>
              <Text style={{textAlign:'center',marginBottom:15,color:'#fff'}}>
                  From {this.props.currentUser.branch} branch
              </Text>
              <View style={{alignItems:'center', flexDirection:'row'}}>
              <TextInput placeholder="Change Phone No."
               keyboardType='numeric'
              style={styles.changGaurdBar}
                value={this.state.myPhone}
                onChange={this.handleChangeA}
              />

              <TouchableOpacity style={styles.changeSemButton2}
                onPress={()=>this.changeNo()}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Done</Text>
              </TouchableOpacity>
              </View>
              <View style={{alignItems:'center', flexDirection:'row'}}>
              <TextInput placeholder="Change Gatekeeper's no."
               keyboardType='numeric'
              style={styles.changGaurdBar}
                value={this.state.gaurdPhone}
                onChange={this.handleChange}
              />

              <TouchableOpacity style={styles.changeSemButton2}
                onPress={()=>this.changeGaurdNo()}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Done</Text>
              </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.logoutButton}
                onPress={()=>this.userSignout()}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Logout</Text>
              </TouchableOpacity>
            </View>
          );
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262A43',
    justifyContent: 'center',
    alignItems:'center',
  },
  info:{
    textAlign:'center',
    color:'#fff',
    fontWeight:'bold',
  },
  infoView:{
    alignItems:'flex-start',
    marginBottom:15,
  },
  changSemBar:{
    width: 140,
    height: 45,
    margin:10,
    paddingLeft:9,
    backgroundColor:'#fff',
    borderRadius:25,
  },
  changGaurdBar:{
    width: 250,
    height: 45,
    margin:10,
    paddingLeft:9,
    backgroundColor:'#fff',
    borderRadius:25,
  },
  changBar:{
    width: 265,
    height: 45,
    margin:10,
    paddingLeft:9,
    backgroundColor:'#fff',
    borderRadius:25,
  },
  changeSemButton:{
    width: 100,
    height: 45,
    margin:10,
    paddingTop:12,
    paddingLeft:33,
    backgroundColor:'#3E64FF',
    borderRadius:25,
  },
  changeSemButton2:{
    width: 100,
    height: 45,
    margin:10,
    marginLeft:-90,
    paddingTop:12,
    paddingLeft:33,
    backgroundColor:'#3E64FF',
    borderRadius:25,
  },
  logoutButton:{
    width: 250,
    height: 45,
    marginTop:25,
    paddingTop:11,
    paddingLeft:104,
    backgroundColor:'#3E64FF',
    borderRadius:25,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Info);