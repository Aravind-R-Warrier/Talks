import React, { useState } from 'react';
import './detail.css';
import { auth, db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

function Detail() {
  const { user, isCurrentUserBlocked, isRecieverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.error("Error updating block status:", err);
    }
  };

  // Toggle shared photos visibility
  const [showPhotos, setShowPhotos] = useState(false);

  const handleTogglePhotos = () => {
    setShowPhotos((prev) => !prev);
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || './avatar.png'} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum, dolor sit amet.</p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>chat settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title" onClick={handleTogglePhotos}>
            <span>shared photos</span>
            <img src={showPhotos ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
          {showPhotos && (
            <div className="photos">
              <div className="photoItem">
                <div className="photoDetail">
                  <img src="https://dreamlandadventuretourism.com/wp-content/uploads/2023/12/img-world-ticket-from-dream.webp" alt="" />
                  <span>Photoname</span>
                </div>
                <img src="./download.png" className="icon" alt="" />
              </div>
              {/* Repeat for other photos */}
            </div>
          )}
        </div>

        <div className="option">
          <div className="title">
            <span>shared files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isRecieverBlocked
            ? "User blocked"
            : "Block user"}
        </button>

        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Detail;
