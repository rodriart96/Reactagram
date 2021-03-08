import React from 'react';
import { useState , useEffect } from 'react';
import { StyleSheet,View, Text, Image, FlatList, Button } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import firebase from 'firebase';
require("firebase/firestore");

import {connect} from 'react-redux';


function Profile(props) {
    const [userPost, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState(null);
    const [following, setFollowing] = useState(false);
    const [profilePic, setprofilePic] = useState(null);

    useEffect(() => {
        const { currentUser, posts ,profilePic, bio } = props;

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
            setprofilePic(profilePic)
            setBio(bio)
        }
        else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                        console.log(snapshot)
                    }
                    else {
                        console.log('does not exist')
                    }
                })
                firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .collection("Bio")
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setBio(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })    

                firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setprofilePic(snapshot.data());
                        
                    }
                    else {
                        console.log('Doesnt possess one')
                    }
                })

            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })
        }
        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])


    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }
    
    const onLogout = () =>{
        firebase.auth().signOut();
    }

    if(user=== null){
        return <View/>
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.InfoContainer}>
                

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        
                        <Text style={styles.user}> {user.name}</Text>
                        <Text style={styles.user}>{user.following}</Text>
                        {following ? (
                            <Button
                                title="Following"
                                onPress={() => onUnfollow()}
                            />
                        ) :
                            (
                                <Button
                                    title="Follow"
                                    onPress={() => onFollow()}
                                />
                            )}
                    </View>
                ):<View >

                    <Text style={styles.user}> {user.name}</Text>
                    <Text style={styles.bio}> {user.bio}</Text>

                <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'center', marginTop:20}}>

                   <Button style={styles.editProfile}
                   title = 'Edit Profile'
                   color="#edeef7"
                     onPress={
                        ()=> props.navigation.
                        navigate('Edit' ,
                        {user})}
                />
                    <Button style={styles.logout}
                    color="#edeef7"
                        title="Logout"
                        onPress={() => onLogout()}
                    /> 
                </View>
                 
            </View> }
            </View>
            <Text style={styles.bar}/>

            <View style={styles.GalleryContainer}>
                <FlatList
                    numColumns = {3}
                    horizontal = {false}
                    data = {userPost}

                    renderItem ={({ item })=> (
                        <View style={styles.imageContainer}>
                           <Image
                        style={styles.image}
                        source={{uri: item.downloadURL}}
                        /> 
                        </View>
                        
                    )}
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bar:{
        height:1,
        backgroundColor: 'grey',
    },
    container:{
        flex:1,
        backgroundColor: '#1a1918'

    },
    InfoContainer:{
        margin: 20,
        marginTop:40

    },
    GalleryContainer:{
        flex:1,
        marginTop: 5,
        backgroundColor: '#1a1918'

    },
    user:{
        color:'#edeef7',
        marginLeft: 20,
        fontSize:18
    },
    bio:{
        color:'#edeef7',
        marginLeft: 20,
        fontSize:15
    },
    editProfile:{
        flex: 1,
        color:'white',
        marginBottom: 20,
        marginLeft: 20,
        fontSize:18
    },
    logout:{
        flex: 1,
        color:'#edeef7',
        marginBottom: 20,
        marginLeft: 20,
        fontSize:18
    },
    profilePic:{
        flex:1,
    },
    image:{
        flex: 1,
        aspectRatio: 1/1
    },
    imageContainer:{
        flex: 1/3,
        marginBottom: 3,
        backgroundColor: '#1a1918'

    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
})

export default connect(mapStateToProps, null)(Profile);
