import {useEffect,useRef, useState} from 'react';
import {useParams, Redirect} from 'react-router-dom'
import {message, Button} from 'antd'
import axios from 'axios'
import config from '../../config'
import Cardpost from '../Home/Posts/CardPost';

import {RedoOutlined, LoadingOutlined, SyncOutlined} from '@ant-design/icons'
const success = () => {
    message.error({
      content: 'Post Not Found',
      style: {
        marginTop: '20vh',
      },
      duration: 1
    });
};

const Postbyid = () => {
    const {postId} = useParams()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [linkLoad, setLinkLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const btnref = useRef()
    
    useEffect( ()=>{
        
        document.title = `trillo | Post`
        const getData = async ()=>{
            setLoading(true);
            try {
                const res = await axios.get(`${config}/api/v1/posts/getpost/${postId}`,{withCredentials: true})
                setData(res.data) 
            } catch (error) {
                if(error.response) {
                    btnref.current.click()
                }
                setErrorMsg(true)
                console.error(error)
            }
            setLoading(false)
        }
        getData()
    },[postId] )

    useEffect(()=>{
        errorMsg && setTimeout( ()=>{ setLinkLoad(true) }, 2000 )
    },[errorMsg])
    console.log('geldim')
    return (
        <>
            <Button ref={btnref} style={{display: 'none'}}  onClick={success}></Button>
            {
                linkLoad && <Redirect to="/" />
            }  

            <div style={{ width: '100%' ,  margin: '3.2rem'}}>
                {(loading || !data) ? <LoadingOutlined style={{ fontSize: '2rem' }}/>
                : data && <Cardpost
                    userId={data.user._id}
                    images={data.files} 
                    tags={data.tags} 
                    likes={data.likes} 
                    isHome={true} 
                    location={data.location}
                    avatar = {data.user.logo}
                    description={data.description}
                    comments={data.comments}
                    username={data.user.username}
                    date={data.date}
                    postId={data._id}
                />}
                </div> 
                   
        </>
    );
}

export default Postbyid;
