import React from "react";
import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import './App.css';
import { useRef, useState } from "react";

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDMZZwFAA6iaqDP-fudTRXY6mHuzR4RYUQ",
    authDomain: "demochatapp-faa02.firebaseapp.com",
    projectId: "demochatapp-faa02",
    storageBucket: "demochatapp-faa02.appspot.com",
    messagingSenderId: "338983032680",
    appId: "1:338983032680:web:3ab56109f0cfcee34a28dd",
    measurementId: "G-LX4WG9PH7V"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  

const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header >
        <Signout/>
      </header>
      <section>
        {user ? <ChatRoom/>: <Signin/>}
      </section>
    </div>
  );
}
function Signin(){
  const signInWithGoogle = ()=>{
    const provider= new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <div>
    <h1 className="welcome">Welcome to The Chat App</h1>
    <span class="icon"></span>
      <button onClick = {signInWithGoogle} className="signIn">Sign in with Google</button>
    </div>
  );
}
function Signout(){
  return auth.currentUser && (<div><h1 className="welcome-signout">Welcome to The Chat App</h1> <button onClick= {()=>auth.signOut()} className="signOut">Sign out</button></div>)
}
function ChatRoom(){
  const dummy = useRef();
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query,{idField:'id'});
  const[formValue,setFormValue] = useState('');
  const sendMessage = async(e) =>{
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messageRef.add({
      chat:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return(
    <>
      <main>
        {messages && messages.map(sg => <ChatMessage key={sg.id} message={sg}/>)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit" className="submit">Submit</button>
      </form>
    </>
  );
}
function ChatMessage(props){
  const{chat,uid, photoURL}=props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
return(
  <div className = {`message ${messageClass}`}>
  <img src = {photoURL}/>
  <p>{chat}</p></div>
);
}
export default App;
