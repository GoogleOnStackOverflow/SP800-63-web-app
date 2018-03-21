import * as firebase from 'firebase';
import firebaseConfig from './config';

var app = firebase.initializeApp(firebaseConfig);
var db = app.database();

export const SaveResultToDB = (name, state) => {
  try {
    db.ref('results/' + String(name)).set(state);
  } catch (e) {
    console.error(e);
  }
}

export const DeleteResultFromDB = (name) => {
  try {
    db.ref('results/' + String(name)).set(null);
  } catch (e) {
    console.error(e);
  }
}

export const GetAllResultNames = (callback) => {
  try {
    db.ref('results/').on('value', snapshot => {
      if(snapshot.val())
        callback(Object.keys(snapshot.val()));
      else
        callback([]);
    })
  } catch (e) {
    console.error(e);
  }
}

export const GetResultByName = (name, callback) => {
  try {
    db.ref('results/').once('value').then(snapshot => {
      if(snapshot)
        callback(snapshot.val()[name]);
    })
  } catch (e) {
    console.error(e);
  }
}