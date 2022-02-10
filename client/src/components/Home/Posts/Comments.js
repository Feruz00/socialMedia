import React from 'react';
import { Avatar, Comment, Typography, Tag } from 'antd'
import {Auth} from '../../../context'
import config from '../../../config'
import calculateTime from '../../../calculateTime'
import { UserOutlined } from '@ant-design/icons';

const {Link, Title} = Typography
const url = 'http://localhost:3000';


const Comments = ({comments, isHome,ansUsers, setAnsUsers}) => {
    
    const {user} = Auth()
    const replyUsers = (username, id)=>{
        if(id === user._id) return;
        const ok = ansUsers.length > 0 && ansUsers.filter(a => a.id === id).length > 0
        !ok && setAnsUsers(prev=> ([{username, id},...prev]))
    }
    return (
        <>
          {comments.length > 0 && <Title level={5} style={{fontWeight: '400'}}>Comments:</Title>}  
          {
              comments.map( (i, index)=>
                  (isHome || (!isHome && index < 2)) &&
                  <Comment
                    
                    key={index}
                    actions={ i.user._id !== user._id && [<span key="comment-nested-reply-to" onClick={()=>replyUsers(i.user.username, i.user._id)} >Reply to</span>]}
                    author={<><Link href={`/user/${i.user.username}`}>{i.user.username}</Link> {'       '} {calculateTime(i.date)} </>}
                    avatar={ i.user.logo.length > 0 ? <Avatar alt={i.user.username} src={`${config}/${i.user.logo}`}  />: <Avatar style={{ display: 'flex', justifyContent: 'center' }} icon={<UserOutlined />} />}
                    content={
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            
                            {
                                i.ansUser.length> 0 && i.ansUser.map( t=><Tag  key={t.username} color="#108ee9"><Link href={`/user/${t.username}`} style={{color: 'white'}}>@{t.username}</Link></Tag> )
                            }
                            {i.text}
                        </div>
                    }
                  >

                  </Comment>
                )
          }  
        </>
    );
}

export default Comments;
