import React, {useState, useEffect}from 'react'
import { StyleSheet,View, Text,FlatList, Button, TextInput } from 'react-native';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUsersData} from '../../redux/actions/index';

import firebase from 'firebase';
require("firebase/firestore");

function Comment(props) {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [text, setText] = useState("")

    useEffect( ()=>{

        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
            console.log(text)
    }

    return (
        <View style={styles.container}>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.container}>
                        {item.user !== undefined ?
                            <Text style={styles.text}>
                                {item.user.name}:  {item.text} 
                            </Text>
                            : null}
                    </View>
                )}
            />
            <View>
                <TextInput
                        placeholder='Comment...'
                        onChangeText={(text) => setText(text)} />
                    <Button
                        onPress = {() => onCommentSend()}
                        title = "Send"
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
        marginTop: 20
    },
    text:{
        marginBottom: 20,
        marginLeft: 20,
        paddingTop: 20
    },
    image:{
        flex: 1,
        aspectRatio: 1/1
    },
    imageContainer:{
        flex: 1/3,
        marginBottom: 5,
        backgroundColor: 'grey'
    }
})
const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
