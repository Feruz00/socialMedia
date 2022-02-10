import { useConversation } from "../../conversation";
import {useState} from 'react'
import {SendOutlined} from '@ant-design/icons'
import Top from './Top'
import Center from "./Center";
import Chatcenter from "./Chatcenter";
import Bottom from "./Bottom";

export default function OpenConversation(){

    const { currentConversation } = useConversation()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="open_conver">
            {
                currentConversation===null ? <h4 className="_start_messaging"> Start messaging {'    '} <SendOutlined  style ={ { color:"#87CEEB", fontSize: '1.7rem', marginLeft: '.4rem'}}  /> </h4> :
                <>
                    <Top isOpen={isOpen} setIsOpen={setIsOpen}  />
                    {isOpen ? <Center/> : <Chatcenter />  }
                    {!isOpen && <Bottom />}
                </>
            }
        </div>
    )
}