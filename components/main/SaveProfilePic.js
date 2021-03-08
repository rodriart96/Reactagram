import React  from 'react'
import { View, Button, Image } from 'react-native';

import firebase from 'firebase';
require("firebase/firestore")
require("firebase/firebase-storage")

export default function SaveProfilePic(props, {navigation}) {
    
    const uploadImage = async () =>{
        const uri = props.route.params.image;
        const childPath = `posts/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        
        const res = await fetch(uri);
        const blob = await res.blob();

        const task = firebase.storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskSuccess = () =>{
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
            })
        }

        const taskError = snapshot =>{
                console.log(snapshot)
                console.log('ALGO PASO MENOL')
        }
        task.on("state_changed", taskProgress, taskError, taskSuccess)
    }

    const savePostData = (downloadURL) =>{
        firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection("userProfilePic")
        .update({
            downloadURL,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return (
        <View style={{flex:1}}>
            <Image source = {{uri: props.route.params.image}}/>
            <Image source={{ uri: props.route.params.image}} style={{ flex: 1 }} />
            <Button
                title='Save'
                onPress={() => uploadImage()}
                
            />
        </View>
    )
}
