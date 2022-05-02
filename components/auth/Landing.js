import React from 'react'
import {Text, TouchableOpacity, View, Image, StyleSheet, StatusBar} from 'react-native'

export default function Landing({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#262A43" />
            <Image style={{width:320,height:220,marginBottom:100}} source={require('./icon.png')}/>
            <TouchableOpacity style={styles.Button1}
                onPress={()=> navigation.navigate("Hod")}>
                <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>Register as Hod</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.Button2}
                onPress={()=>{navigation.navigate("Teacher")}}>
                <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>Register as Class Teacher</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#262A43',
        justifyContent:'center',
        alignItems:'center',
    },
    Button1:{
        width: 325,
        height: 48,
        marginTop:10,
        paddingTop:12,
        paddingLeft:103,
        backgroundColor:'#3E64FF',
        borderRadius:30,
        marginBottom:15,
      },
      Button2:{
        width: 325,
        height: 48,
        marginTop:10,
        paddingTop:12,
        paddingLeft:72,
        backgroundColor:'#3E64FF',
        borderRadius:30,
        marginBottom:15,
      },
})