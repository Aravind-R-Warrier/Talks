import React, { useEffect, useRef, useState, useCallback } from 'react';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';

function Chat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const { currentUser } = useUserStore();
  const { user, chatId,isCurrentUserBlocked,isRecieverBlocked } = useChatStore();
  const [img, setImg] = useState({
    file:null,
    url:''
  });
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => unSub();
  }, [chatId]);

  const handleEmoji = useCallback((e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  }, []);

  const handleImg=e=>{
    if(e.target.files[0]){
        setImg({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })
    }
}

  const handleSend = useCallback(async () => {
    if (text === "") return;

    let imgUrl=null;

    try {

      if(img.file){
        imgUrl=upload(img.file)
      }




      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && {img:imgUrl})
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const chatIndex = userChatData.chats.findIndex((c) => c.chatId === chatId);

          if (chatIndex !== -1) {
            userChatData.chats[chatIndex].lastMessage = text;
            userChatData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
            userChatData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatData.chats,
            });
          }
        }
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
    setImg({
      file:null,
      url:''
    })

    setText("")
  }, [chatId, currentUser, text, user]);

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username || "User"}</span>
            <p>{chat?.lastMessage || "No messages yet"}</p>
          </div>
        </div>
        <div className="icon">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div className="message own" key={message.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>{new Date(message.createdAt.seconds * 1000).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}

        {img.url &&<div className={message.senderId===currentUser?.id? "message own":"message"}>
          <div className="texts">
            <img src={img.url} />
          </div>
        </div>}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
          <img src="./img.png" alt="" />
          </label>
          <input type="file"id='file'style={{display:"none"}} onChange={handleImg}/>
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={(isCurrentUserBlocked||isRecieverBlocked)?'you cannot send a message':"Type your message"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isRecieverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
          {open && <div className="picker"><EmojiPicker onEmojiClick={handleEmoji} /></div>}
        </div>
        <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isRecieverBlocked}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
