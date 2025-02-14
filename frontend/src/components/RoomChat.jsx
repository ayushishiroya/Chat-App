import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

const RoomChat = ({ socket, loginUserDetails, roomId, allRooms }) => {
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     socket.on('receive_room_message', (data) => {
    //         setGroupMessageList((prev) => [...prev, data]);
    //     });

    //     return () => {
    //         socket.off('receive_room_message');
    //     };
    // }, [socket]);



    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container sx={{ height: '100vh' }}>
                <Grid size={2} sx={{ borderRight: '1px solid #dbdbdb' }}>

                    <Typography component='ul' sx={{ listStyle: 'none', padding: 0 }}>
                        {
                            allRooms?.map((item) => {
                                return (
                                    <Box
                                        // onClick={() => getUserDetails(item._id)}
                                        sx={{ display: 'flex', alignItems: 'center', gap: 3, padding: '10px', cursor: 'pointer', boxShadow: '0 5px 10px #e9e9e9' }}
                                    >
                                        <Typography component='li'>{item.name}</Typography>
                                    </Box>
                                )
                            })
                        }
                    </Typography>
                </Grid>
                <Grid size={10} sx={{ position: 'relative' }}>
                    <Box
                        sx={{ position: 'absolute', top: 0, right: 0, left: 0, padding: "19px", borderBottom: '1px solid #dbdbdb' }}
                    >
                        <Typography component='h4'>{"userDetails.name"}</Typography>
                    </Box>

                    <Box sx={{ height: 'calc(100vh - 118px)', padding: '82px 20px 20px 20px' }}>
                        {/* {
                            groupMessageList?.map((item) => {
                                return <Typography>{item.text}</Typography>
                            })
                        } */}
                    </Box>

                    <Box
                        component="form"
                        // onSubmit={handleSubmitMessage}
                        noValidate
                        sx={{
                            width: "100%",
                            display: 'flex',
                            position: 'absolute',
                            right: 0,
                            left: 0,
                            bottom: 0
                        }}
                    >
                        <TextField
                            type="text"
                            name="message"
                            placeholder="Type here"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Send
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RoomChat;
