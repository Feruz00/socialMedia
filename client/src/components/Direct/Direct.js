import Sidebar from './Sidebar';
import OpenConversation from './OpenConversation';
import './stil.css'
import {useEffect} from 'react'
export default function Direct(){
    useEffect(()=>{
        
        document.title = 'trillo | Direct page'
    },[])
    return <div className="conversation" >
        <Sidebar />
        <OpenConversation   />
    </div>
}