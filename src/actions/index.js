import  { auth, provider ,db ,storage } from "../firebase";
import {  ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, orderBy, onSnapshot ,addDoc,query,runTransaction,doc ,updateDoc,getDoc,DocumentReference,arrayRemove,arrayUnion} from 'firebase/firestore';

import { SET_USER ,SET_LOADING_STATUS ,GET_ARTICLES} from "./actionType";
import { signInWithPopup } from "firebase/auth";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});


export const setLoading = (status) => ({
 type:SET_LOADING_STATUS ,
 status:status,
});


export const getArticles = (payload) => ({
  type:GET_ARTICLES,
  payload:payload,
})



export const getPosts = (posts) => ({
  type: 'GET_POSTS',
  payload: posts,
});

export function signInAPI() {
  return async (dispatch) => {
    try {
      console.log("Before authentication");
      await signInWithPopup(auth, provider).then((payload) => {
        dispatch(setUser(payload.user));
      });
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })

      .catch((error) => {
        console.log(error.message);
      });
  };
}



export function postArticleAPI(payload) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    if (payload.image !== "") {
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, payload.image);
      uploadTask.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progress: ${progress}%`);
        if (snapshot.state === 'RUNNING') {
          console.log(`Progress: ${progress}%`);
        }
      }, (error) => {
        alert(error.message);
      }, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          const docData = {
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: payload.timestamp,
              image: payload.user.photoURL
            },
            video: payload.video,
            shareImg: downloadURL,
            comments: 0,
            description: payload.description,
          };

          // Check if likes property is present in payload
          if (payload.likes) {
            docData.likes = payload.likes;
          } else {
            docData.likes = {
              count: 0,
              whoLiked: [],
            };
          }

          const docRef = await addDoc(collection(db, 'articles'), docData);
          dispatch(setLoading(false));
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      });
    } else if (payload.video) {
      try {
        const docData = {
          actor: {
            description: payload.user.email,
            title: payload.user.displayName,
            date: payload.timestamp,
            image: payload.user.photoURL
          },
          video: payload.video,
          shareImg: '',
          comments: 0,
          description: payload.description,
        };

        // Check if likes property is present in payload
        if (payload.likes) {
          docData.likes = payload.likes;
        } else {
          docData.likes = {
            count: 0,
            whoLiked: [],
          };
        }

        const docRef = await addDoc(collection(db, 'articles'), docData);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };
}


export function getArticlesAPI(){
  return async (dispatch) => {
    let payload
    try {
      const unsubscribe = onSnapshot(
        query(collection(db, 'articles'), orderBy("actor.date", "desc")),
        (snapshot) => {
          payload = snapshot.docs.map((doc) => doc.data());
          console.log(payload);
          dispatch(getArticles(payload));
      });
      
      

    } catch (error) {
      console.error("Error fetching articles:", error);
      // Handle the error as needed
    }
  }
}







export async function updateArticleAPI(payload) {
  try {
    console.log("Payload:", payload);
    const { id, update } = payload;
    const articleRef = doc(db, 'articles', id);

    // Ensure the `likes` object is destructured properly
    const { likes } = update;

    // Check if `likes` object exists
    if (likes) {
      const { count, whoLiked } = likes;

      console.log("Likes count:", count);
      console.log("Who liked:", whoLiked);

      // Document reference
      const articleDoc = await getDoc(articleRef);

      // Check if the document exists
      if (articleDoc.exists()) {
        // Convert whoLiked to an array
        const whoLikedArray = Array.isArray(whoLiked) ? whoLiked : [whoLiked];

        // Update Firestore document with likes
        await updateDoc(articleRef, { likes: { count, whoLiked: arrayUnion(...whoLikedArray) } });

        console.log("Article updated successfully!");
      } else {
        console.error("Document does not exist");
      }
    } else {
      console.error("Invalid payload format: 'likes' property is missing");
    }
  } catch (error) {
    console.error("Error updating article", error);
  }
}




