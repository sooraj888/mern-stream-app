import React from 'react'
import "./VideoList.css"
import { contents } from './data'
import { useNavigate } from 'react-router-dom'

export default function VideoList() {
    const navigation = useNavigate();
  return (
    <div className='videoListContainer'>
        {
            contents.map((item,key)=>{
                if(key >= 3) {
                    return;
                }
                return <div className='videoContainer' key={key} onClick={()=>{
                    navigation(`/video/${item.videoId}`);
                }}>
                    asdflakjfla
                </div>
            })
        }
    </div>
  )
}
