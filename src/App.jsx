import { useEffect } from "react";
import Chat from "./Components/chat/Chat"
import Detail from "./Components/detail/Detail"
import List from "./Components/list/List"
import Login from "./Components/login/Login";
import Notification from "./Components/notification/Notification.Jsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";


const App = () => {
  const {currentUser,fetchUserInfo}=useUserStore()
  const{chatId}=useChatStore()
  useEffect(()=>{
const unSub=onAuthStateChanged(auth,(user)=>{
  // console.log(user)
  fetchUserInfo(user?.uid)
})

return ()=>{
  unSub()
}
  },[fetchUserInfo])
  // console.log(currentUser)

  return (
    <div className='container'>

      {currentUser?(<>
      <List/>
      {chatId &&<Chat/>}
    {chatId &&<Detail/>}
      </>):
      (<Login/>)}
     <Notification/>
    </div>
  )
}

export default App