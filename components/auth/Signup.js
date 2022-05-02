import { StatusBar } from 'react-native';
import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text , TextInput, Alert, Picker } from 'react-native'
import firebase from 'firebase'

export class Signup extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
            branch:'',
            phone:'',
            gphone:'',
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp(){
        const {email, password, name, branch,phone,gphone} = this.state;
        var data = this.state.branch;
        if(data == ""){
            Alert.alert("Please select your branch")
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("teachers")
                .doc(firebase.auth().currentUser.uid)
                .set({
                    name,
                    email,
                    branch,
                    phone,
                    gphone,
                }),
                firebase.firestore().collection("teacherContacts")
                .doc(branch)
                .set({
                    name,
                    branch,
                    phone,
                })
            })
            .catch((error) =>{
                Alert.alert(error.message)
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#262A43"/>
                <View style={{marginBottom:25}}>
                    <Text style={{fontWeight:'bold',color:'#3E64FF',fontSize:28, marginBottom:2}}>Create Account</Text>
                </View>
                <TextInput style={styles.textinput}
                    placeholder="Name" placeholderTextColor="#fff"
                    onChangeText={(name) => this.setState({name})}
                />
                <TextInput style={styles.textinput}
                    placeholder="Email" placeholderTextColor="#fff"
                    onChangeText={(email) => this.setState({email})}
                />
                <TextInput style={styles.textinput}
                    placeholder="Password" placeholderTextColor="#fff"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password})}
                />
                <TextInput style={styles.textinput}
                    placeholder="Phone no." placeholderTextColor="#fff"
                    keyboardType="phone-pad"
                    onChangeText={(phone) => this.setState({phone})}
                />
                <TextInput style={styles.textinput}
                    placeholder="Gatekeeper's phone no." placeholderTextColor="#fff"
                    keyboardType="phone-pad"
                    onChangeText={(gphone) => this.setState({gphone})}
                />
                <Picker style={{width:'78%', color:'#fff'}}
                    selectedValue={this.state.branch}
                    onValueChange={(itemValue,itemIndex) => this.setState({branch:itemValue})}
                    >
                    <Picker.Item label="Select your branch" value="" />
                    <Picker.Item label="CS" value="Cse" />
                    <Picker.Item label="CIVIL" value="Civil" />
                    <Picker.Item label="MECH" value="Mech" />
                    <Picker.Item label="EEE" value="EEE" />
                    <Picker.Item label="ET&T" value="Etnt" />
                </Picker>

                <TouchableOpacity style={styles.Button}
                onPress={()=>this.onSignUp()}>
                <Text style={{color:'#fff',fontWeight:'bold',fontSize:20}}>Signup</Text>
              </TouchableOpacity>

              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff',fontWeight:'bold', paddingTop:12}}>Already have an account? </Text>
    
              <TouchableOpacity
                onPress={()=> this.props.navigation.navigate("Hod")}>
                  <Text style={{color:'skyblue',fontWeight:'bold', paddingTop:12}}>Login</Text>
              </TouchableOpacity>
              </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#262A43',
      justifyContent: 'center',
      alignItems:'center',
    },
    textinput: {
        margin:10,
        width:325,
        height:48,
        paddingLeft:17,
        color:'#fff',
        backgroundColor:'#262A43',
        borderColor:'#3E64FF',
        borderRadius:30,
        borderWidth:1,
    },
    Button:{
        width: 325,
        height: 48,
        marginTop:25,
        paddingTop:11,
        paddingLeft:130,
        backgroundColor:'#3E64FF',
        borderRadius:30,
        marginBottom:15,
      },
  });

export default Signup
