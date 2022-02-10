
import axios from 'axios';
import { useState,useEffect } from 'react';
import {Link} from 'react-router-dom'
import config from '../../config';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import './modal.css'
import {Spin} from 'antd'

export default function SearchModal({ findUser }){

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        let cancel;
        
        const handleChange = async ()=>{
            const ENDPOINT = config+'/';
            setLoading(true);
            setError('')
            
            try {
                cancel && cancel();
                const CancelToken = axios.CancelToken;
                const res = await axios({
                    method: "POST",
                    url: ENDPOINT,
                    data:{
                        tapmaly: findUser
                    },
                    withCredentials: true,
                    cancelToken: new CancelToken(canceler => {
                        cancel = canceler;
                    })
                })
                setData(res.data)
                
            } catch (err) {
                if( err.response ) setError(err.response.data.message);
                else setError("Please try again! We have server error");
            }
            setLoading(false)
        }
        handleChange()

    },[findUser]);

    let point = config + '/';
    return (
        <div className="__search__container">
            { loading ? <div className="_search_loading" style={{ 
                display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <Spin size="default" /> </div> : 
                <div className="_search_list">
                    { data.length === 0 && <div> Nothing found </div> }
                    {error.length > 0 && <div> {error} </div>}
                    {
                        data.map( (i,index)=>{
                            return (
                                <div className="_search_item" key={index}>
                                    <div className="_search_logo"> 
                                        { i.logo.length>0 ? 
                                            <img src={point+i.logo} alt="Tr" className="_search_img"  /> :
                                            <AccountCircleRoundedIcon className="_search_img" />
                                        } 
                                    </div>
                                    <Link className="_search_body" to={`/user/${i.username}`} > {i.username} </Link>
                                </div>
                            );
                        } )
                    }
                </div>
        }
        </div>

    );

}