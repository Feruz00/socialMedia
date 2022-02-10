
import axios from 'axios';
import { useEffect, useState } from 'react';
import {useParams , Redirect } from 'react-router-dom';
import config from '../../config';

const Confirm = ()=>{
    
    const {id, token} = useParams();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [text, setText]= useState('Successfully confirmed! You can logged in /login this route')
    useEffect(()=>{
        const ENDPOINT = config+'/api/v1/users/verify';

        const getData = async ()=>{
            
        try {
           await axios({
                method: "PATCH",
                url: ENDPOINT,
                params:{
                    id: id,
                    token: token
                },
                withCredentials: true
            });
            setLoading(false);
            setSuccess(true);    
        } catch (error) {
            setSuccess(false);
            if( error.response ) setText(error.response.data.message)
            else setText('We have server error please try again!')
        }
        setLoading(false)
        }
        getData()

            
    },[id,token]);

    if( !loading && success ){
        setTimeout( ()=>{
            <Redirect to = '/login' />;
        }, 700 );
    }
    
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            { loading ? <h2> Loading... </h2>: <h3 style={{
                    fontSize:'1rem'
                }}> {text}  </h3> }
            
        </div>
    )
}
export default Confirm;