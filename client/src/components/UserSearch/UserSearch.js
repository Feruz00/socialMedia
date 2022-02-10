
import axios from 'axios'
import {Auth} from '../../context'
import {useSocket} from '../../socket'
import config from '../../config';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import {Button, Modal,Alert} from 'react-bootstrap'
import './Style.css'
import {Typography} from 'antd'
import {EditOutlined} from '@ant-design/icons'
import {useParams, Link} from 'react-router-dom'
// import useSearch from './useUserSearch';
import {useState, useEffect} from 'react'
import ModulE from './Modul_e'


export default function UserSearch(){
    
    const [toggle, setToggle] = useState(false)
    const {username} = useParams()
    const {user, setUser} = Auth()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)
    const [arr, setArr] = useState([])
    const [title, setTitle] = useState('')
    const [error, setError] = useState('');
    const [change, setChange] = useState(false)
    const socket = useSocket()
    
    useEffect( ()=>{
        document.title = `trillo | User ${username}`
    },[])

    useEffect( ()=>{
        setLoading(true)
        axios({
            method: "GET",
            url: config+`/api/v1/friends/${username}`,
            withCredentials: true
        }).then(res=>{
            setData(res.data)
        }).catch(err=>{
            if(err.response) setError(err.response.data.message);
            else setError( 'Something wrong went! Try again!' );
        })
        setLoading(false)

    }, [username, change] )

    const unfollow = async ()=>{
        try {
            const res = await axios.post(config+`/api/v1/friends/unfollow`, {_id: data._id}, {withCredentials: true})
            setData(res.data)
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }

    const follow = async ()=>{
        try {
            const res = await axios.post(config+`/api/v1/friends/follow`, {_id: data._id}, {withCredentials: true})
            setData(res.data)
            socket.emit('newnotification', {users: [data._id]})
            
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }
    
    async function handleFollow(){
        setToggle(true)
        
        data.isFollow ? await unfollow(): await follow()
        
        setToggle(false)
    }
    return (
        <div style={{ marginTop: '3rem' }} className="_profile">
            { error.length>0 && <Alert variant="danger"> {error} </Alert> }
            {
                !loading && data && <div className="_body">
                <div className="_picture">
                    {  data.logo.length > 0 ?
                        <img src={`${config}/${data.logo}`} alt="Logo" />:
                        <AccountCircleRoundedIcon style={{fontSize: '8rem'}} /> 
                    }
                </div>
                <div className="_user">
                    <div className="_first">
                        <h1> {data.username} </h1>
                        
                        {   data._id === user._id ?
                            <Link to="/settings"> <EditOutlined /> Edit Profile  </Link>
                            :  
                            <Button 
                                disabled={toggle} 
                                onClick={handleFollow} 
                                className=" _button " 
                                variant={ data.isFollow ? 'primary' : 'outline-primary' } 
                                > 
                                { data.isFollow ? `Unfollow${toggle?'...':''}`: `Follow${toggle?'...':''}` }  
                            </Button> 
                        }
                        {
                            data._id === user._id ?
                            <Typography.Link href='/newpost' className="_btn"> Write New Blog </Typography.Link>
                            :
                            <Typography.Link href={`/post/${data.username}`} className="_btn" >  Show Blogs </Typography.Link>
                        }
                    </div>
                    <div className="_second">
                        <Button variant="light" className="rounded-0 _fl" onClick={ ()=>{
                            setShow(true)
                            setArr( data.followers )
                            setTitle('Followers')
                        } } > {data.followers} followers </Button>
                        <Button variant="light" className="rounded-0 _fl" onClick={ ()=>{
                            setShow(true)
                            setArr( data.following )
                            setTitle('Followings')
                        } }> {data.following} following </Button>  
                    </div>
                    <div className="_third">
                        {data.firstName} {data.lastName}
                    </div>
                </div>
                
            </div>}
            
            { loading && <div> Loading... </div>}
               
            <Modal show={show} onHide={ ()=>{ setShow(false); setChange(prev=>!prev) } } >
                <ModulE setShow={setShow} userId={data ? data._id: null} title={title} setChange={setChange}/>    
            </Modal>         
        </div> 
    );
}