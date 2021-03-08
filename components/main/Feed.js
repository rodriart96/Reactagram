import React from 'react';
import { useState , useEffect } from 'react';
import { StyleSheet,View, Text, Image, FlatList, Button } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import firebase from 'firebase';
require("firebase/firestore");

import {connect} from 'react-redux';

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        
        if( props.usersFollowingLoaded == props.following.length && props.following.length !== 0 ){

            props.feed.sort(function(x,y) {
                return y.creation - x.creation;
            })

            setPosts(props.feed);
        }

    }, [props.usersFollowingLoaded, props.feed])
    
    
    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }


    
    return (
        <View style={styles.container}>
            <View style={styles.GalleryContainer}>
                <FlatList
                    numColumns = {1}
                    horizontal = {false}
                    initialNumToRender={5}
                    data = {posts}
                    renderItem ={({ item })=> (
                    
                        <View style={styles.imageContainer}>
                            <Text style={styles.text}>{item.user.name}</Text>

                           



                            { item.currentUserLike ?
                                (
                                    <View>
                                        
                                    <Image
                                        style={styles.image}
                                        source={{uri: item.downloadURL}}
                                    />

                                    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                                        <MaterialCommunityIcons style={styles.heart} name="heart"  size={26}
                                        onPress={() => onDislikePress(item.user.uid, item.id)} 
                                        />

                                        <MaterialCommunityIcons style={styles.commentButton} name="comment-outline"  size={26}
                                            onPress={
                                            ()=> props.navigation.
                                            navigate('Comment' ,
                                            {postId: item.id , uid: item.user.uid})}
                                        />
                                        </View>
                                    </View>
                                )
                                :
                                (

                                    <View>
                                        
                                            <Image
                                            style={styles.image}
                                            source={{uri: item.downloadURL}}
                                        
                                        />
                                        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                                            <MaterialCommunityIcons style={styles.heartLine} name="heart-outline"  size={26}
                                            onPress={() => onLikePress(item.user.uid, item.id)} 
                                            />

                                            <MaterialCommunityIcons style={styles.commentButton} name="comment-outline"  size={26}
                                                onPress={
                                                ()=> props.navigation.
                                                navigate('Comment' ,
                                                {postId: item.id , uid: item.user.uid})}
                                            />
                                        </View>
                                    </View>
                                )
                            }


                            
                            
                            <Text style={styles.user}>{item.user.name} {item.caption} </Text>
                            <Text style={styles.comment} onPress={()=> props.navigation.
                                navigate('Comment' ,
                                {postId: item.id , uid: item.user.uid})}
                                >View Comments...
                            </Text>
                            <Text style={styles.bar}/>
                        </View>
                        
                    )}
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        
    },
    InfoContainer:{
        margin: 20,
    },
    GalleryContainer:{
        flex:1,
    },
    text:{
        color:'#edeef7',
        marginBottom: 20,
        marginLeft: 20,
        paddingTop: 20,
        fontSize:18
    },
    user:{
        color:'#edeef7',
        marginBottom: 20,
        marginLeft: 20,
        fontSize:18
    },
    comment:{
        color:'#edeef7',
        marginBottom: 20,
        marginLeft: 20,
        fontSize:13
        
    },
    commentButton:{
        color:'#edeef7',
        marginBottom: 20,
        marginLeft: 20,
        marginTop:20
    },
    image:{
        flex: 1,
        aspectRatio: 1/1
    },
    imageContainer:{
        flex: 1/3,
        backgroundColor: '#1a1918'
    },
    bar:{
        height:1,
        backgroundColor: 'grey',
    },
    loading:{
        flex: 1,
        justifyContent: 'center'
    },
    heart:{
        marginTop:20,
        color: '#ff005c',
        marginLeft: 20
    },
    heartLine:{
        marginTop:20,
        color: '#ff005c',
        marginLeft: 20
    }
    
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed);
