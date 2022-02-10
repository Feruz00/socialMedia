import {useState, useEffect,useRef, useCallback} from 'react';
import { message, Button, Card, List, Typography, Avatar, Tag } from 'antd';
import axios from 'axios';
import config from '../../config'
import calculateTime from '../../calculateTime'
import {Auth} from '../../context'
import {LoadingOutlined, SyncOutlined} from '@ant-design/icons'
import { UserOutlined } from '@ant-design/icons';

const {Text, Link} = Typography
const success = () => {
    message.error({
      content: 'Something wrong went. Try again!',
      style: {
        marginTop: '20vh',
      },
      duration: 1
    });
};
const Notifications = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [errorMsg, setErrorMsg] = useState(false)
    const btnref = useRef()
    const [mLoading, setMLoading] = useState(false)
    const {setUser} = Auth()
    const [pageNumber, setPageNumber] = useState(1)
    const ref = useRef()
    const [hasMore, setHasMore] = useState(true)
    
    // console.log(user)
    useEffect( ()=>{
        
        document.title = 'trillo | Notifications'
        const getData = async ()=>{
            setLoading(true);
            try {
                const res = await axios.get(`${config}/api/v1/notifications/`,{withCredentials: true})
                if(res.data.length === 0) setHasMore(false)
                setData(res.data) 
                setPageNumber(p=>p+1)
            } catch (error) {
                if(error.response) {
                    btnref.current.click()
                }
                setErrorMsg(true)
                console.error(error)
            }
            setMLoading(false)
            setLoading(false)
        }
        getData()
        return async ()=>{
            try {
                await axios({
                    method: 'PUT',
                    url: `${config}/api/v1/notifications/`,
                    withCredentials: true
                })    
                setUser(prev=>({...prev, unreadNotifications: false }))
            } catch (error) {
                btnref.current.click()
            }
            
        }
    },[] );


    return (
        <div style={{ width: '100%' ,  margin: '3.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Button ref={btnref} style={{display: 'none'}}  onClick={success}></Button>
            {loading ? <LoadingOutlined style={{ fontSize: '2rem' , marginTop: '5rem'}}/>:
            data &&
            <Card  className='__card' >
                <List
                    itemLayout='horizontal'
                    dataSource={data.notifications}
                    renderItem={item=>(
                        <List.Item>
                            <List.Item.Meta
                                avatar={item.user.logo.length>0? <Avatar src={`${config}/${item.user.logo}`} /> : <Avatar style={{ display: 'flex', justifyContent: 'center' }} icon={<UserOutlined />} />}
                                title={<>
                                {item.type === 'newLike' && <Text style={{fontWeight: '400'}}> New Like your <Link href={`/posts/${item.post._id}`}>post.</Link> {'  '} {calculateTime(item.date)} </Text>}
                                {item.type === 'newComment' && <Text style={{fontWeight: '400'}}> New Comment your <Link href={`/posts/${item.post._id}`}>post.</Link> {'  '} {calculateTime(item.date)} </Text>}
                                {item.type === 'jogap' && <Text style={{fontWeight: '400'}}> <Link href={`/user/${item.user.username}`}>{item.user.username}.</Link> user answered comment this <Link href={`/posts/${item.post._id}`}>post.</Link> {'  '} {calculateTime(item.date)} </Text>}
                                {item.type === 'newFollower' && <Text style={{fontWeight: '400'}}> <Link href={`/user/${item.user.username}`}>{item.user.username}.</Link> follow you  {'  '} {calculateTime(item.date)}  </Text>}
                                
                                </>
                                
                                }

                                description={
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        {
                                            item.ansUser.map( t=><Tag  key={t.username} color="#108ee9"><Link href={`/user/${t.username}`} style={{color: 'white'}}>@{t.username}</Link></Tag> )
                                        }
                                        {item.text}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                >

                </List>
                {mLoading && <LoadingOutlined style={{ fontSize: '2rem' }}/>}
                {!hasMore && !mLoading &&  <SyncOutlined style={{ fontSize: '2rem', fontStyle: 'italic', marginBottom: '1rem' }}/> }
           
            </Card>
            }
           
            
            {/* Notifications page */}
        </div>
    );
}

export default Notifications;
