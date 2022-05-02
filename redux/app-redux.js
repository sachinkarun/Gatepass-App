import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as firebase from 'firebase';

//
// Initial State...
//
const initialState = {
    currentUser: "",
};

//
// Reducer...
//

const reducer = (state = initialState, action) => {
    switch(action.type) {

        case "setCurrentUser": 
            return { ...state, currentUser: action.value };

        default: 
            return state;
    }
};

//
// Store...
//

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export { store };

//
// Action Creators...
//

const setCurrentUser = (currentUser) => {
    return {
        type: "setCurrentUser",
        value: currentUser,
    };
}

const fetchUser=()=>{
    return ((dispatch) =>{
        firebase.firestore()
            .collection("teachers")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                var currentUser = snapshot.data();
                    dispatch(setCurrentUser(currentUser))
            })
        })
    }

export { setCurrentUser, fetchUser };