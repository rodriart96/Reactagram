import React, { useState } from 'react';
import {View, Button, TextInput} from 'react-native';
import firebase from 'firebase';
import AddProfileImg from './AddProfileImg'

const EmptyScreen = () =>{
    return(null)
}

export function Edit({navigation})  {
    const [name, setName]= useState(null);
    const [bio, setBio] = useState(null);
    const [profilePic, setprofilePic]= useState(null);

    const edit = () =>{
            firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update(name)

            firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update(bio)
           
           if(profilePic){
            firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set(profilePic)

           }else{
               profilePic
           }
    }

        return (
            <View>
                <TextInput
                    placeholder = 'User Name'
                    onChangeText = {(name) => setName({name})}
                />
                <TextInput
                    placeholder = 'User Bio'
                    onChangeText = {(bio) => setBio({bio})}
                />
                <Button title="Foto de perfil"  
                onPress={() => navigation.navigate("AddProfileImg")}

            />

                <Button
                    onPress={() =>edit()}
                    title = 'Edit Profile'
                />
            </View>
        ) }

export default Edit;