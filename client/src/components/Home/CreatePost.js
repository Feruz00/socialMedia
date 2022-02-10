import { useRef, useState} from 'react';
import {Card, Divider, Input, Space, Tag,Image, Typography, Button} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {Redirect} from 'react-router-dom'
import config from '../../config';
import {useSocket} from '../../socket'
import {Auth} from '../../context'
const {Title} = Typography
const {TextArea} = Input
const Createpost = () => {
    const [tags, setTags] = useState([])
    const [tag, setTag] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [light, setLight] = useState(false)
    const [files, setFiles] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [success, setSuccess] = useState(false);
    const socket = useSocket()
    const {user} = Auth()
    const { 
        getInputProps,
        getRootProps
    } = useDropzone({
        accept:'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(prev => Object.assign(prev, {
              preview: URL.createObjectURL(prev)
            })));
        }
    });

    const addTag = ()=>{
        const ok = tags.filter( t=>t===tag ).length > 0 ? true: false
        if(!ok){
            setTags(prev=>([...prev, tag]))
        }
        setTag('')
    }
    const handleSubmit = async ()=>{
        setLoading(true)
        const data = new FormData();
        files.forEach(element => {
            data.append('files', element)
        });
        data.append('location', location);
        data.append('description', description);
        tags.forEach(element=>{
            data.append('tags', element);
        })
        
        try {
            await axios({
                method: "POST",
                url: `${config}/api/v1/posts/`,
                data,
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            const userId = user._id;
            socket.emit('newpost', {userId})
        } catch (error) {
            setErrorMsg(error)
            console.error(error)
        }
        setTags([])
        setLocation('')
        setDescription('')
        setFiles(null)
        setSuccess(true)
        setLoading(false)
    }
    return (<div style={{ margin: '3.2rem' }} >
            <Card>
                <Space direction='horizontal'>
                    <Title style={{fontWeight: '400'}} level={4}>Do you want add new post?</Title>
                    
                    <Divider type='vertical' style={{visibility: 'hidden'}}/>
                    {
                        success && (
                            errorMsg ? 
                                <Title style={{fontWeight: '400', color: 'red'}} level={4}>Cannot posted:( Try again!</Title>
                                    :
                                <Redirect to='/' />
                        )
                    }
                    
                    
                </Space>
                <Divider />
                <Space direction='horizontal' >
                    <Title style={{fontWeight: '400', width: '10rem'}} level={5}> Add Location: </Title>
                    <Input style={{width: '20rem'}} value={location} onChange={e=>setLocation(e.target.value)}/>
                </Space>
                <Divider style={{visibility: 'hidden'}} />
                
                <Space direction='horizontal'>
                    <Title style={{fontWeight: '400', width: '10rem'}} level={5}> Upload pictures: </Title>
                    <Space direction='horizontal'>
                        <div className={`__upload_post ${light && '__drag' }`} 
                            {...getRootProps()}
                            // onClick={()=>inputRef.current.click()}
                            onDragOver={()=>setLight(true)}
                            onDragLeave={()=>setLight(false)}
                            >
                            <input {...getInputProps()} />
                            
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center' }}>
                            <PlusOutlined style={{fontSize: '2.5rem', color: '#dddbdb'}} />
                            
                            </div>
                            
                        </div>    
                        <Divider type='vertical' style={{visibility: 'hidden'}}/>
                        <div style={{ height: '12rem', width: '15rem', overflowY: 'auto', display: 'flex', flexDirection: 'row' }}>
                            {
                                files && files.map(file => <Image 
                                    key={file.preview} 
                                    src={file.preview} 
                                    alt={file.path}
                                    preview={false}
                                    style={{ height: '10rem', width: '10rem', objectFit: 'cover', marginRight: '5px' }} />)
                            }
                        </div>
                        
                    </Space>
                    
                </Space>
                <Divider style={{visibility: 'hidden'}} />
                <Space direction='horizontal' >
                    <Title style={{fontWeight: '400', width: '10rem'}} level={5}> Add Description: </Title>
                    <TextArea  showCount maxLength={100} style={{ height: "3rem", width: '20rem' }} onChange={e=>setDescription(e.target.value)} value={description} />
                </Space>
                
                <Divider style={{visibility: 'hidden'}} />
                <Space direction='horizontal' >
                    <Title style={{fontWeight: '400', width: '10rem'}} level={5}> Add Tags: </Title>
                    <Space direction='vertical'>
                        
                        <Space direction='horizontal'>
                            <Input value={tag} onChange={e=>setTag(e.target.value.toLocaleLowerCase())} maxLength={20} />
                            <Button type='primary' onClick={()=>addTag()} disabled={ tags.length === 10 || tag.length===0 }> Add tag</Button>
                        </Space>
                        
                        <Space direction='horizontal'>
                            {
                                tags.length === 0 ? <p>You don't add any tag</p>:
                                tags.map( t=> <Tag key={t}> {t} </Tag>  )
                            }
                        </Space>
                    </Space>
                </Space>
                <Divider style={{visibility: 'hidden'}} />
                
                <Space direction='horizontal' >
                    <Title style={{fontWeight: '400', width: '10rem'}} level={5}>  </Title>
                    <Button type='primary' 
                        disabled={loading || location.length === 0 || description.length === 0 || !files}
                    onClick={()=>handleSubmit()}> {loading &&  <LoadingOutlined  /> } Create New Post </Button>
                </Space>
            </Card>
        </div>
    );
}

export default Createpost;
