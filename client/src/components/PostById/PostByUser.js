import React, {useRef,useCallback, useState} from 'react'
import Cardpost from '../Home/Posts/CardPost';
import {Divider, Skeleton, Card, Space, Alert, Typography, Button, message, notification} from 'antd'
import {useEffect} from 'react'
import config from '../../config'
import axios from 'axios'
import {Auth} from '../../context'
import { useParams } from 'react-router-dom'
import {RedoOutlined, LoadingOutlined, SyncOutlined} from '@ant-design/icons'
const {Title, Link} = Typography

const success = () => {
    message.error({
      content: 'Something wrong went! Try again',
      style: {
        marginTop: '20vh',
      },
      duration: .5
    });
};

export default function Postbyuser(){

    const [loading, setLoading] = useState(false)
    const [mLoading, setMLoading] = useState(false)
    const [data, setData] = useState([])
    const [errorMsg, setErrorMsg] = useState(false)
    const btnref = useRef()
    const [hasMore, setHasMore] = useState(true)
    const [pageNumber, setPageNumber] = useState(1)
    const [searchTags, setSearchTags] = useState([]);
    const tagRef = useRef()
    const {setUser} = Auth()
    const {feruz} = useParams()

    useEffect(()=>{
        document.title = `trillo | Post of ${feruz}`
        return async () => {
            try {
                await axios({
                    method: "PUT",
                    url: `${config}/api/v1/posts/unread`,
                    withCredentials: true,
                })
                setUser(prev=>({ ...prev, unreadPosts: false}))
            } catch (error) {
                btnref.current.click()
            }
        };
    },[])
    useEffect(() => {
        const getData = async ()=>{
            if(data.length === 0) setLoading(true);
            else setMLoading(true)
            try {
                const res = await axios.get(`${config}/api/v1/posts/getpostbyuser/${feruz}`,{withCredentials: true, params: {p: pageNumber}})
                if(res.data.length === 0) setHasMore(false)
                setData(prev=>[...prev, ...res.data])
                
            } catch (error) {
                setErrorMsg(true)
                console.error(error)
            }
            setLoading(false)
            setMLoading(false)
        }
        getData()
    }, [pageNumber]);

    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        if (loading || mLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])
    
    return (
        <div style={{ margin: '3.2rem' }} className='__home'>
            {/* <div className='tags_boyunca_gozleg'>
                <Space direction='vertical'>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}} > 
                        <Button type="primary">Submit</Button>
                        <Button type='secondary'>Close</Button>
                    </div>
                </Space>
            </div> */}
            <Button ref={btnref}   onClick={success}></Button>
           {
                loading ? <Card className='__card' style={{ height: '10rem' }}>
                    <Skeleton avatar active paragraph={{rows: 6}} />    
                </Card> :
                errorMsg ?  <Card className='__card'>
                    <Alert message={<> <Title level={5} style={{fontWeight: '400'}}> Something wrong went! <Link href='/' style={{ transform: 'translateY(-.2rem)' }}><RedoOutlined style={{fontSize: '1.5rem'}}/></Link> </Title></>}
                    type="error" style={{ textAlign: 'center' }} />
                </Card> :
                data.length === 0 ? <Card className='__card'>
                    <Alert message={<> <Title level={5} style={{fontWeight: '400'}}> No Posts </Title></>}
                    type="success" style={{ textAlign: 'center' }} />
                </Card>:
                <>
                    {
                        data.map( (i, index)=> {
                            if(index === data.length - 1) return (<div key={index}
                                     ref={lastBookElementRef} style={{ width: '100%' }}><Cardpost
                                    isOk = {index === data.length - 1}
                                    
                                    userId={i.user._id}
                                    images={i.files} 
                                    tags={i.tags} likes={i.likes} isHome={false} 
                                    location={i.location}
                                    avatar = {i.user.logo}
                                    description={i.description}
                                    comments={i.comments}
                                    username={i.user.username}
                                    date={i.date}
                                    postId={i._id}
                                    setSearchTags={setSearchTags}
                                /></div>)
                                else return (<div key={index}
                                     style={{ width: '100%' }}><Cardpost
                                    isOk = {index === data.length - 1}
                                    userId={i.user._id}
                                    images={i.files} 
                                    tags={i.tags} likes={i.likes} isHome={false} 
                                    location={i.location}
                                    avatar = {i.user.logo}
                                    description={i.description}
                                    comments={i.comments}
                                    username={i.user.username}
                                    date={i.date}
                                    postId={i._id}
                                    setSearchTags={setSearchTags}
                                /></div>)
                        }
                        
                            )
                    }
                            
                        
                    
                
                </>
            
           } 
           {mLoading && <LoadingOutlined style={{ fontSize: '2rem' }}/>}
           {!hasMore && !mLoading &&  <SyncOutlined style={{ fontSize: '2rem', fontStyle: 'italic', marginBottom: '1rem' }}/> }
               
        </div>
    );
}