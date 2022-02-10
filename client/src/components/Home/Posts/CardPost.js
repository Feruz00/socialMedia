import React, {useState, useRef} from 'react';
import {Popover,Typography, Space, Divider, Card, List, Avatar, Carousel, Image, Tag, Input, Button, message} from 'antd'
import {DeleteOutlined} from '@ant-design/icons'
import calculateTime from '../../../calculateTime';
import {CalendarOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import Comments from './Comments';
import axios from 'axios'
import config from '../../../config'
// import {CalendarOutlined} from '@matersial-ui/icons'
import {useSocket} from '../../../socket'
import {Auth} from '../../../context';
const { Text, Link, Title } = Typography;

const url = 'http://localhost:3000'
const contentStyle ={
    width: "100vh",
    height: '60%'
}
const contentStyle2 = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};
const success = () => {
    message.error({
      content: 'Something wrong went! Try again',
      style: {
        marginTop: '20vh',
      },
      duration: .5
    });
};

const Cardpost = ({ref,setSearchTags, images, isOk, tags, avatar, comments, isHome,date, likes, location, description, postId, username, userId}) => {
    const btnref = useRef()
    const {user} = Auth()
    const socket = useSocket()
    const [myLikes, setMyLikes] = useState(likes)
    const [ansUsers, setAnsUsers] = useState([]);
    const [comment, setComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [myComments, setMyComments] = useState(comments)
    const isLike = myLikes.length > 0 ? myLikes.filter(like => like.user._id === user._id).length > 0 : false
    const addOrRemoveLike = async ()=>{
        try {
            await axios({
                method: "PUT",
                url: `${config}/api/v1/posts/${isLike? 'unliked': 'liked'}/${postId}`,
                withCredentials: true,
            })
            if(!isLike){
                const users = [userId]
                socket.emit('newnotification', {users})
            }
            isLike ? setMyLikes(prev=>prev.filter( p=>  p.user._id !== user._id)) : setMyLikes(prev=>([{user}, ...prev]))

        } catch (error) {
            console.error(error)
            btnref.current.click()
        }
    }
    const commentSubmit = async ()=>{
        
        setCommentLoading(true)
        
        try {
            await axios({
                method: "POST",
                url: `${config}/api/v1/posts/post/${postId}`,
                data:{
                    text: comment,
                    ansUsers
                },
                withCredentials: true,
            })
            const ansUser = ansUsers.length === 0 ? [] : ansUsers
            setMyComments(prev=>[{user, text: comment,date: Date.now(), ansUser}, ...prev])
            setCommentLoading(false)  
            const users = [...ansUsers.map(i=>i.id), userId]
            socket.emit('newnotification', {users})      
        } catch (error) {
            console.error(error)
            setCommentLoading(false)
        }
        setComment('')
        setAnsUsers([])
    }
    // console.log(myComments)
    return (
        <React.Fragment >
        
        
        <Card  className={`__card ${isOk && 'observer___feruz' }`} >
            <Button ref={btnref} style={{display: 'none'}} onClick={success}/>
            <div  style={{ margin: '0', padding: '0' , display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div className='__post_header'>
                <Avatar src={<Image src={`${config}/${avatar}`} style={{ width: 32 }} />} className='__post_avatar' />
                <Space direction="vertical" className='__post_'>
                    <div> <Link href={`/user/${username}`}>{username} </Link>, posted 
                        <span style={{color: '#176fc2' }}> {calculateTime(date)} {' '}
                        <CalendarOutlined style={{ fontSize: '1rem', transform: 'translateY(-.2rem)' }} /> </span> </div>
                    <Text> {location} </Text>
                </Space>
            </div>
            <div>
            {
                user._id === userId && <DeleteOutlined color='red' style={{ color: 'orangered', fontSize: '1rem' }} />
            
            }
            
            </div>
            </div>
            <Carousel autoplay>
            {
                images.map( (i,index)=>(
                    <div key={index} className='__caousel'>
                        <Image src={`${config}/${i}`} style={{ 
                            height: '25rem', 
                            width: '100%', 
                            objectFit:'cover', 
                            objectPosition: 'center',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}  />
                    </div>
                ) )
            }
        
            </Carousel>
            
            <Space direction='horizontal' style={{marginTop: '.5rem'}}>
                {
                    isLike ? 
                    <HeartFilled style={{ fontSize: '1.3rem' , color: 'red', cursor: 'pointer'}} onClick={()=>addOrRemoveLike()} /> :
                    <HeartOutlined style={{ fontSize: '1.3rem', cursor: 'pointer' }} onClick={()=>addOrRemoveLike()} />
            
                }
                {
                    myLikes.length === 0 ?  <Text>This post doesnt have any likes</Text>:
                    userId === user._id ?
                    <Popover 
                        title={<Title level={5} style={{textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems:'center'}}> Likes </Title>} 
                        trigger="click"
                        content={
                            <List 
                                itemLayout='horizontal'
                                dataSource={myLikes}
                                style={{
                                    maxHeight: '12rem',
                                    width: '15rem',
                                    overflowY: 'auto'
                                }}
                                renderItem={item=>
                                    <List.Item>
                                        <List.Item.Meta 
                                            avatar={<Avatar src={`${config}/${item.user.logo}`} />}
                                            title={
                                                <Link href={`/user/${item.user.username}`}>{item.user.username}</Link>
                                            }

                                        />
                                    </List.Item>
                                }
                            >

                            </List>
                        }
                    > 
                    <Button style={{border: 'none'}}>{myLikes.length} {' '} {myLikes.length > 1 ? 'likes' : 'like'} 
                    </Button>  </Popover>:
                    <Text>{myLikes.length} {' '} {myLikes.length > 1 ? 'likes' : 'like'}</Text>
                }
            </Space>

            <div className='__post_ashak'>
                <Text> {description} </Text>
                
                <div className='__post_tags' style={{marginTop: '1rem'}}>
                    { tags.map( (i, index)=><Tag key={index} style={{ cursor: 'pointer' }} >{i}</Tag> ) }
                </div>
            </div>
            <Divider />

            <Comments comments={myComments} isHome={isHome} ansUsers={ansUsers} setAnsUsers={setAnsUsers} />
            
            <Space direction='vertical' style={{marginTop: '1rem'}}>
                <Title level={5} style={{fontWeight: '400', color: 'skyblue'}}>Add Comment</Title>
                    { ansUsers.length>0 && <div style={{ display: 'flex', flexDirection: 'row' }}>        
                        Answered this users:
                        {
                            ansUsers.map( t=><Tag 
                                key={t.id} 
                                
                                closable style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                onClose={e=>{
                                    e.preventDefault()
                                    setAnsUsers(prev=>prev.filter(p=>p.id !== t.id))
                                }}
                                color="#108ee9"> <Link href={`/user/${t.username}`}  style={{color: 'white'}}>@{t.username}</Link> </Tag> )
                        }
                    </div>}
                <Space direction='horizontal'>
                    <Input placeholder="Write a comment" value={comment} onChange={e=>setComment(e.target.value)} style={{width: '19rem', maxWidth: '30rem'}} />
                    <Button type="primary" onClick={()=>commentSubmit()} disabled={comment.length === 0 || commentLoading} loading={commentLoading} >Add Comment</Button>
                </Space>
                
            </Space>
            <Divider />
            {
                !isHome && comments.length > 1 &&  <Link href={`http://localhost:3000/posts/${postId}`} style={{fontSize: '12px', marginLeft: '2rem'}}>View More other comments</Link> 
            }
            {
                !isHome && !( comments.length > 1) && <Link href={`http://localhost:3000/posts/${postId}`} style={{fontSize: '12px', marginLeft: '2rem'}}> Go to this post </Link>
            }


        </Card>
        <Divider style={{ visibility: 'hidden' }}  />
                
        </React.Fragment>
    );
}

export default Cardpost;
