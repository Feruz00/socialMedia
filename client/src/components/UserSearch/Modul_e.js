
import axios from 'axios';
import {Modal, ListGroup, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import config from '../../config'
import {useState, useEffect} from 'react'
import {Auth} from '../../context'
import {useSocket} from '../../socket'

import './Modal.css'

import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';

export default function ModulE({setShow, userId, title,setChange}){
    
    const [current, setCurrent] = useState(null)
    const {user, setUser} = Auth()

    const [loading, setLoading] = useState(true)
    const [ans, setAns] = useState([]) 
    const socket = useSocket()
    
    useEffect(()=>{
        if(current === null) return;
        let url = config + '/api/v1/friends' + ( current.isFollow ? '/unfollow' : '/follow' );
        axios({
            method: "POST",
            url: url,
            data: {
                _id: current._id
            },
            withCredentials: true,
        }).then(res=>{
            if(!current.isFollow){
                socket.emit('newnotification', {users: [current._id]})

            }
            setAns( ans.map( i=>{
                if(i._id === current._id) return {...i, isFollow: !i.isFollow}
                else return i;
            } ) )
            
        }).catch(err=>{
            alert("Something wrong went! Try again")
        })
    },[current])
    
    
    useEffect( ()=>{
        if(!userId) return;
        const getData = () => {
            axios({
                method:'GET',
                url: config+`/api/v1/friends/${ title === 'Followings'? 'following':'follower' }/${userId}`,
                withCredentials: true
            }).then( res=>{
                const all = res.data.map( (i) => ({_id: i._id, username: i.username, logo: i.logo, isFollow: i.isFollow}) );
                setAns( all ); 
            } ).catch(err=>{  
                alert("Something wrong went!");
            })
            
        }
        getData()
        setLoading(false)

    },[userId])


    return (
        <>
            <Modal.Header closeButton>
                <h2 className="_title"> {title} </h2>
            </Modal.Header>
            <Modal.Body className="_modulbody ">
                
                <ListGroup className="_listgroup">
                    
                    {loading  ? <ListGroup.Item>Loading... </ListGroup.Item> :
                        ans.length === 0 ? <ListGroup.Item> Nothing yet </ListGroup.Item> :
                     ans.map( (i,index)=>{
                        return(
                            <ListGroup.Item key={index} className="_listitem" >
                                <div className="_list">
                                    <div className="_left">
                                        <div className="_logo"> 
                                            {
                                                i.logo.length > 0 ? <img src={config + '/' + i.logo} />:
                                                <AccountCircleRoundedIcon className="_search_img" /> 
                                            }
                                        </div>
                                        <Link to={'/user/'+i.username} className="_link" > 
                                        {i.username}  </Link>        
                                    </div>
                                    <Button onClick={()=>{
                                        setCurrent(i)
                                    }} className=" _right " variant={
                                        i._id === user._id ? 'light' :
                                        i.isFollow ? 'primary' : 'outline-primary' } 
                                        disabled = { i._id === user._id }
                                        > 
                                        { 
                                            i._id === user._id ? '--You--' :
                                            i.isFollow ? 'Unfollow': "Follow" }  

                                    </Button>
                                </div>
                            </ListGroup.Item>
                        )
                    } ) }
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{ setShow(false); setChange(prev=>!prev)} } className="_modulclose" > Close </Button>
            </Modal.Footer>
        </>
    )

}