import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { StyleSheet, Text, View,TouchableOpacity, ScrollView} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import ItemFunction from './ItemFunction';
import { fetchUser } from '../redux/app-redux';
import { Feather as Icon, FontAwesome as FAIcon } from '@expo/vector-icons';

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

class Main extends React.Component {

  constructor(props){
    super(props);
    this.state={
      currentUser: this.props.currentUser,
      items:[],
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

  showStudents(){

    if(this.props.currentUser.sem){
      firebase.database().ref(`chouksey/${this.props.currentUser.branch}`).orderByChild("sem").equalTo(`${this.props.currentUser.sem}`).on('value', snapshot => {
        let data = snapshot.val();
        if(snapshot.val()){
          let items = Object.values(data);
          this.setState({ items });
        }
        else{
          this.setState({items:''})
        }
      });
    }
    else{
      firebase.database().ref(`chouksey/${this.props.currentUser.branch}`).on('value', snapshot => {
        let data = snapshot.val();
        if(snapshot.val()){
          let items = Object.values(data);
          this.setState({ items });
        }
        else{
          this.setState({items:''})
        }
      });
    }
  }

      render(){
        return (
          <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor='#262A43'/>

            <View style={{flexDirection:'row-reverse',marginTop:15,marginRight:165}}>

              <TouchableOpacity style={{marginLeft:130,backgroundColor:"#3B4056",width:35,height:35,alignItems:'center',justifyContent:'center',borderRadius:10}}
                onPress={()=> this.props.navigation.navigate("Info")}>
                <Icon name='info' size={26} color='#fff'/>
                </TouchableOpacity>

              <TouchableOpacity style={{backgroundColor:"#3B4056",width:35,height:35,alignItems:'center',justifyContent:'center',borderRadius:10}}
                onPress={()=>this.showStudents()}>
              <Icon name='rotate-ccw' size={26} color='#fff'/>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {this.state.items.length > 0 ? (
                <ItemFunction
                items={this.state.items} />
                ) : (
                  <Text style={{color:'#fff', marginTop:10,fontWeight:'bold'}}>No requests or the screen is not refreshed</Text>
                  )}
            </ScrollView>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#262A43',
    justifyContent: 'flex-start',
    alignItems:'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);