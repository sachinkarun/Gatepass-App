import React, { useState } from 'react';
import * as SMS from 'expo-sms';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,Image } from 'react-native';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';

export default function ItemComponent(props) {
  propTypes = {
    items: PropTypes.array.isRequired
  }
  const sendAcceptedSms = async (studentPhone, name, branch, sem, reason, gaurdianPhone) =>{
        await SMS.sendSMSAsync(
          [`${currentUser.gphone}`,`${studentPhone}`,`${gaurdianPhone}`],
          `This is to inform that ${name} student of ${branch} ${sem} sem is allowed to go home for following reason: 

${reason} 
granted by: ${currentUser.name}`
          );
  }
  const sendCancelSms = async (studentPhone, name, branch, sem) =>{
    await SMS.sendSMSAsync(`${studentPhone}`,
    `This is to inform that ${name} student of ${branch} ${sem} sem is not allowed to go home.`
    );
}
var currentUser;
    firebase.firestore()
        .collection("teachers")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            currentUser = snapshot.data();
        })

  const acceptReq=(item)=>{
    var query = firebase.database().ref(`chouksey/${item.branch}`).orderByKey();
    query.once("value")
      .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var pkey = childSnapshot.key; 
        var chval = childSnapshot.val();

        //check if remove this child
        if(chval.name == item.name && chval.branch == item.branch){

            //Adding the accepted requests on another collection
            firebase.database().ref(`PermissionGranted/${item.branch}`).push().set({
              name: item.name,
              branch: item.branch,
              sem: item.sem,
              phone: item.phone,
              reason: item.reason,
              enrollmentNo: item.enrollmentNo,
              imageUrl: item.imageUrl,
            });

          firebase.database().ref(`chouksey/${item.branch}/${pkey}`).set(null)
            sendAcceptedSms(item.phone,item.name,item.branch,item.sem,item.reason,item.gaurdianPhone);
          return true;
        }
      });
    });
  }

  const deleteReq=(item)=>{
    var db = firebase.database().ref(`chouksey/${item.branch}`);
    var query = firebase.database().ref(`chouksey/${item.branch}`).orderByKey();
    query.once("value")
      .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var pkey = childSnapshot.key; 
        var chval = childSnapshot.val();

        //check if remove this child
        if(chval.name == item.name && chval.branch == item.branch){
          firebase.database().ref(`chouksey/${item.branch}/${pkey}`).set(null)
          sendCancelSms(item.phone,item.name, item.branch, item.sem);
          return true;
        }
      });
    });
  } 

    return (
      <View style={styles.itemsList}>
        {props.items.map((item,index) => {
          return (
            <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.itemlist}
                key={index}>
                    <View style={{flexDirection:'row',marginLeft:50}}>
              <Image source={{uri:item.imageUrl}} style={{marginLeft:-15,width:115,height:115,borderRadius:10 }}/>
                      <View style={{marginLeft:40}}>
              <Text style={styles.itemtext0}>{item.name}</Text>
              <Text style={styles.itemtext1}>Branch: {item.branch}</Text>
              <Text style={styles.itemtext1}>Semester: {item.sem}</Text>
              <Text style={styles.itemtext1}>Enrollment no: {item.enrollmentNo}</Text>
                      </View>
                    </View>

              <View style={styles.buttons}>
              <TouchableOpacity 
                onPress={()=>{acceptReq(item)}}
                style={styles.accept}><Text style={{color:'#fff',fontSize:20,fontWeight:'bold'}}>Allow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={()=>{deleteReq(item)}}
                style={styles.reject}><Text style={{color:'#262A43',fontSize:20,fontWeight:'bold'}}>Deny</Text>
              </TouchableOpacity>
              </View>
              </View>
            </View>
            <View>
              <View style={styles.itemlist2}
                key={index}>
                  <ScrollView>
              <Text style={styles.itemtext2}>{item.name}</Text>
              <Text style={styles.itemtext3}>{item.branch}/{item.sem} sem ({item.currtime})</Text>
              <Text style={{fontWeight:'bold',paddingLeft:15,color:"#fff"}}>Reason:</Text>
              <Text style={{color:"#fff",paddingLeft:15}}>{item.reason}</Text>
              <Text style={{fontWeight:'bold',paddingLeft:15,color:"#fff"}}>Address:</Text>
              <Text style={{color:"#fff",paddingLeft:15}}>{item.address}</Text>
              </ScrollView>
              </View>
            </View>
            </ScrollView>
          );
        })}
      </View>
    );
  }

const styles = StyleSheet.create({
  itemsList: {
    alignItems:'center',
    marginHorizontal:10,
    marginTop:-4,
  },
  itemtext0: {
    fontSize: 15,
    color:'#fff',
    fontWeight:'bold',
    marginLeft:-25,
    paddingTop:10,
  },
  itemtext1: {
    fontSize: 15,
    color:'#fff',
    fontWeight:'bold',
    marginLeft:-25,
    paddingTop:3,
  },
  itemtext2: {
    fontSize: 18,
    color:'#fff',
    fontWeight:'bold',
    textAlign: 'center',
    paddingTop:10,
  },
  itemtext3: {
    fontSize: 18,
    color:'#fff',
    fontWeight:'bold',
    textAlign: 'center',
  },
  buttons: {
    flexDirection:'row',
    margin:10,
    marginRight:65,
    justifyContent:'space-evenly',
    paddingTop:5,
  },
  accept: {
    backgroundColor:'#3E64FF',
    width:128,
    height:53,
    borderRadius:30,
    paddingTop:12,
    paddingLeft:38,
    marginLeft:52,
    marginRight:70,
  },
  reject: {
    backgroundColor:'#C4C4C4',
    width:128,
    height:53,
    borderRadius:30,
    paddingTop:12,
    paddingLeft:40,
  },
  itemlist:{
    justifyContent:'center',
    backgroundColor:'#3B4056',
    borderRadius:20,
    marginTop:20,
    marginRight:5,
    marginLeft:3,
    width:362,
    height:222,
    borderBottomColor:"#2b4154",
    borderBottomWidth:1,
    borderRightColor:"#2b4154",
    borderRightWidth:2,
  },
  itemlist2:{
    justifyContent:'center',
    backgroundColor:'#3B4056',
    borderRadius:20,
    marginTop:20,
    marginRight:5,
    paddingBottom:25,
    paddingRight:5,
    width:362,
    height:222,
    borderBottomColor:"#2b4154",
    borderBottomWidth:1,
    borderRightColor:"#2b4154",
    borderRightWidth:2,
  },
});