import React from 'react'
import './userinfo.css'
import { useUserStore } from '../../../lib/userStore'


function Userinfo() {
  const {currentUser}= useUserStore()
  return (
    <div className='userinfo'>
      {/* users */}
      <div className={currentUser.avatar || "user"}>
        <img src="./avatar.png" alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      {/* icons */}
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div>
  )
}

export default Userinfo
