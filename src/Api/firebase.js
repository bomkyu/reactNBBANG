import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, onSnapshot, getDocs, query, where, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: "n--bbang",
  storageBucket: "n--bbang.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
};

// Firebase 앱을 초기화합니다.
const app = initializeApp(firebaseConfig);

// Firestore Timestamp 가져오기
const timestamp = Timestamp.now();

// 타임스탬프를 원하는 형식으로 변환하는 함수
function formatTimestamp(timestamp) {
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}




// 필요한 Firebase 서비스를 가져옵니다.
export const db = getFirestore(app);

export const imageUpload = async (image) => {
  const storage = getStorage();
  // Storage에 업로드할 위치 지정
  const storageRef = ref(storage, "images/" + formatTimestamp(timestamp));

  try {
    //이미지를 업로드
    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    
    return url;
    
  } catch(error){
    alert(error);
    return;
  }
}

export const Insert = async (fbCollection, obj) => {
  try {
    const collectionRef = collection(db, fbCollection);
    const docRef = doc(collectionRef);
      
    const updatedData = {
      ...obj,
      sq: docRef.id,
      dateTime : formatTimestamp(timestamp)
    };
      
    await setDoc(docRef, updatedData);
  } catch (e) {
    //console.error("Error adding document: ", e);
  }
}

export const Select = async (fbCollection, w) => {
  try {
    let q;
    if(w){
      q = query(collection(db, fbCollection), where(w.field, w.operator, w.value));
    }else{
      q = query(collection(db, fbCollection));
    }
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data())
    });
    return data;
  } catch (error) {
    return alert(`에러발생! ${error}`)
  }
}

export const Update = async (fbCollection, sq, obj) => {
  try {
    const updateDocRef = doc(collection(db, fbCollection), sq); // 문서 참조 생성
    await updateDoc(updateDocRef , obj);
  } catch (error) {
    return alert(`에러발생! ${error}`)
  }
}

export const Delete = async (fbCollection, sq, callback) => {
  if(window.confirm('정말로 삭제하실껀가요?')){
    try {
      const deleteDocRef = doc(collection(db, fbCollection), sq); // 문서 참조 생성
      await deleteDoc(deleteDocRef);

      if (typeof callback === 'function') {
        callback(); // callback 호출
      }

    } catch (error) {
      return alert(`에러발생! ${error}`)
    }
  }else{

  }
  
  
}

/*
  User 컬렉션과 FreindRequest 컬렉션을 조인 시킴.
  snapshot으로 이벤트가 있을때 바로 UI가 바뀜.
*/
export const FriendSelect = (session, callback) => {
  return new Promise((resolve, reject) => {
    try {
      const q = query(collection(db, 'User'), where("id", "!=", session));
    
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userArr = [];
        querySnapshot.forEach((doc) => {
          userArr.push(doc.data());
        });
    
        const q2 = query(collection(db, 'FriendRequest'));
        onSnapshot(q2, (friendRequestSnapshot) => {
          const friendRequestArr = [];
          friendRequestSnapshot.forEach((doc) => {
            friendRequestArr.push(doc.data());
          });
    
          const userListArr = userArr.map((param) => {
            const send = friendRequestArr.filter((filter) => filter.sendFriend === session && filter.requestFriend === param.id);
            const request = friendRequestArr.filter((filter) => filter.requestFriend === session && filter.sendFriend === param.id);
            const sortation = send.length > 0 ? { sortation: 'send', status: send[0].status, sq: send[0].sq } : request.length > 0 ? { sortation: 'request', status: request[0].status, sq: request[0].sq } : { sortation: 'none' };
            
            return { ...param, request: sortation };
          });
          //console.log('firebase ////', userListArr);
          resolve(userListArr);
          if (typeof callback === 'function') {
            callback(userListArr); // callback 호출
          }
        });
      });
    } catch (error) {
      reject( alert(`에러발생! ${error}`))
    }
  });
}