import React, {useState} from 'react'
import {TextInput, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import firebase from 'firebase';
require('firebase/firestore')


export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }
    return (
        <View style={styles.container}>
            <TextInput
                placeholderTextColor='#edeef7' 
                inputStyle='#edeef7'
                style={styles.TextInput}
                placeholder ="Escribe aqui..."
                onChangeText={(search)=>fetchUsers(search)}
            />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) =>(
                    <TouchableOpacity style={styles.separacion}
                    onPress={() => props.navigation.navigate("Profile", {uid: item.id})}
                    >
                    <Text style={styles.user}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    separacion:{
        marginTop:20
    },
    user:{
        color:'#edeef7',
        marginLeft: 30,
        fontSize:18
    },container:{
        flex:1,
        backgroundColor: '#1a1918'

    },
    TextInput:{
        color:'#edeef7',

    }
})