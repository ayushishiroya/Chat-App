import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Tab, Tabs, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { io } from "socket.io-client";
import { Menu, MenuItem } from '@mui/material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const Dashboard = () => {
    const [userList, setUserList] = useState([])
    const [roomDetails, setRoomDetails] = useState({})
    const [messageList, setMessageList] = useState([])
    const [message, setMessage] = useState("")
    const [roomName, setRoomName] = useState("")
    const [joinRoomId, setJoinRoomId] = useState(null)
    const [userDetails, setUserDetails] = useState({})
    const [loginUserDetails, setLoginUserDetails] = useState({})
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));
    const [openCreateRoomModel, setOpenCreateRoomModel] = useState(false);
    const [openJoinRoomModel, setOpenJoinRoomModel] = useState(false);
    const [value, setValue] = useState(0);
    const [groupMessageList, setGroupMessageList] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [typing, setTyping] = useState('');
    const [file, setFile] = useState(null);

    const socket = useMemo(() => {
        const bearerToken = JSON.parse(localStorage.getItem('token'));
        return io("http://localhost:5000", {
            auth: {
                token: bearerToken ?? token,
            }
        });
    }, []);

    useEffect(() => {
        if (localStorage.getItem('token') && localStorage.getItem('token') !== null) {
            const token = JSON.parse(localStorage.getItem('token'))
            const decodedToken = JSON.parse(atob(token.split('.')[1]))
            setLoginUserDetails(decodedToken?.user)
            getAllUsers(decodedToken.user._id)

            socket.emit('register_user', decodedToken.user._id);
        }
        // if (Notification.permission !== "granted") {
        //     Notification.requestPermission();
        // }
    }, [])

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected', socket.id)
        })

        // Personal
        socket.on('update_active_users', (users) => {
            setActiveUsers(users);
        });

        socket.on('typing', (message) => {
            setTyping(message);
        });

        socket.on('stop_typing', (message) => {
            setTyping(message);
        });

        socket.on('receive', (data) => {
            setMessageList((prev) => [...prev, data])
        })

        // socket.on("new_message_notification", ({ sender, message }) => {
        //     if (Notification.permission === "granted") {
        //         new Notification("New Message", {
        //             body: `${sender}: ${message}`,
        //             // icon: "/chat-icon.png"
        //         });
        //     }
        // });

        // Group
        socket.on('receive_group_message', (data) => {
            if (!data) {
                console.error('Error: No data received.');
            } else {
                setGroupMessageList((prev) => [...prev, data]);
            }
        });

        return () => {
            socket.off('update_active_users');
            socket.off('receive_group_message');
            socket.off('receive');
        };
    }, [socket])


    useEffect(() => {
        if (value === 1) {
            setUserDetails({})
        } else {
            setRoomDetails({})
        }
    }, [value])

    const handleChangeTabs = (event, newValue) => {
        setValue(newValue);
    };

    // Group
    const handleCreateRoomModel = () => {
        setOpenCreateRoomModel(!openCreateRoomModel);
    };

    const handleJoinRoomModel = () => {
        setOpenJoinRoomModel(!openJoinRoomModel);
    };

    const handleCreateRoom = async () => {
        if (roomName) {
            await axios.post("http://localhost:5000/api/room/create", { name: roomName })
                .then(res => {
                    if (res.data.isSuccess) {
                        setRoomName('');
                        setOpenCreateRoomModel(false);
                        socket.emit('join_room', res.data.roomId)
                        getRoomById(res.data.roomId);
                        getAllGroupMessages(res.data.roomId);
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const handleJoinRoom = async () => {
        getRoomById(joinRoomId);
        getAllGroupMessages(joinRoomId);
        socket.emit('join_room', joinRoomId)
    }

    const getRoomById = async (id) => {
        await axios.get(`http://localhost:5000/api/room?id=${id}`)
            .then(res => {
                if (res.data.isSuccess) {
                    setRoomDetails(res.data.record);
                } else {
                    console.log(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    const getAllGroupMessages = async (id) => {
        await axios.get(`http://localhost:5000/api/message/get/by-room?room=${id}`)
            .then(res => {
                if (res.data.isSuccess) {
                    setGroupMessageList(res.data.records);
                } else {
                    console.log(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    // Personal
    const getAllUsers = async (id) => {
        await axios.get(`http://localhost:5000/api/user/get/all?id=${id}`)
            .then(res => {
                if (res.data.isSuccess) {
                    setUserList(res.data.records);
                } else {
                    console.log(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    const getUserDetails = async (id) => {
        await axios.get(`http://localhost:5000/api/user?id=${id}`)
            .then(res => {
                if (res.data.isSuccess) {
                    setUserDetails(res.data.record);
                    getUserMessages(loginUserDetails._id, res.data.record._id)
                } else {
                    console.log(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    const getUserMessages = async (sender, receiver) => {
        await axios.get(`http://localhost:5000/api/message?sender=${sender}&receiver=${receiver}`)
            .then(res => {
                if (res.data.isSuccess) {
                    setMessageList(res.data.records);
                } else {
                    console.log(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    const handleSubmitMessage = async (e) => {
        e.preventDefault();

        if (message) {
            await axios.post("http://localhost:5000/api/message/create", { text: message, sender: loginUserDetails._id, file, ...(value === 1 ? { room: roomDetails._id } : { receiver: userDetails._id }) })
                .then(res => {
                    if (res.data.isSuccess) {
                        if (value === 1) {
                            socket.emit("send_group_message", { ...res.data.record, user: loginUserDetails.name })
                            getAllGroupMessages(roomDetails._id)
                        } else {
                            socket.emit("send_message", { ...res.data.record, senderName: loginUserDetails.name })
                            socket.emit('stop_typing', userDetails?._id)
                            getUserMessages(loginUserDetails._id, userDetails._id)
                        }
                        setMessage("");
                        setFile("")
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const handleTyping = (value) => {

        if (value !== '') {
            socket.emit('typing', userDetails?._id)
        } else {
            socket.emit('stop_typing', userDetails?._id)
        }
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container sx={{ height: '100vh' }}>
                    <Grid size={2} sx={{ borderRight: '1px solid #dbdbdb' }}>

                        <Box>
                            <Tabs
                                value={value}
                                onChange={handleChangeTabs}
                                aria-label="wrapped label tabs example"
                            >
                                <Tab label="Personal" {...a11yProps(0)} />
                                <Tab label="Group" {...a11yProps(1)} />
                            </Tabs>
                        </Box>

                        <TabPanel value={value} index={0}>
                            <Typography component='ul' sx={{ listStyle: 'none', padding: 0 }}>
                                {userList?.map((item) => {
                                    const isActive = activeUsers.includes(item._id);

                                    return (
                                        <Box
                                            onClick={() => getUserDetails(item._id)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 3,
                                                padding: '10px',
                                                cursor: 'pointer',
                                                boxShadow: '0 5px 10px #e9e9e9',
                                                bgcolor: `${item._id === userDetails._id ? "#f0f0f0" : "#ffffff"}`,
                                                position: 'relative'
                                            }}
                                        >
                                            <Avatar sx={{ bgcolor: '#dbdbdb' }}>{item.name?.slice(0, 1).toUpperCase()}</Avatar>
                                            {isActive && (
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        bgcolor: '#00cb00',
                                                        borderRadius: '50%',
                                                        position: 'absolute',
                                                        top: 13,
                                                        left: 40
                                                    }}
                                                />
                                            )}
                                            <Typography component='li'>{item.name}</Typography>
                                        </Box>
                                    );
                                })}
                            </Typography>

                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <Box sx={{ width: '100%' }}>
                                <Button sx={{ margin: '20px' }} size='medium' variant="contained" onClick={handleCreateRoomModel}>
                                    Create Room
                                </Button>
                                <Divider>or</Divider>
                                <Button sx={{ margin: '20px' }} size='medium' variant="contained" onClick={handleJoinRoomModel}>
                                    Join Room
                                </Button>
                            </Box>
                        </TabPanel>

                    </Grid>
                    {
                        Object?.values(userDetails)?.length > 0
                            ? (<Grid size={10} sx={{ position: 'relative' }}>
                                <Box
                                    sx={{ position: 'absolute', top: 0, right: 0, left: 0, padding: "19px", borderBottom: '1px solid #dbdbdb' }}
                                >
                                    <Typography component='h4'>{userDetails.name}</Typography>
                                </Box>


                                <Box sx={{ height: 'calc(100vh - 118px)', padding: '82px 20px 20px 20px', position: 'relative' }}>
                                    {
                                        messageList?.map((item) => {
                                            return (
                                                <>
                                                    <Box sx={{ display: "flex", marginTop: '10px', justifyContent: `${item.sender.toString() === loginUserDetails._id ? "end" : "start"}` }}>
                                                        <Box sx={{ width: "fit-content", p: "10px", bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                                            {
                                                                (item.sender.toString() !== loginUserDetails._id && roomDetails._id) && <Typography sx={{ color: "#1976d2", fontSize: '0.8rem' }}>{userDetails.name}</Typography>
                                                            }

                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                                                <Typography>{item.text}</Typography>
                                                                <Typography component='small' sx={{ paddingLeft: "20px", fontSize: "0.7rem", color: '#9b9b9b' }}>{`${new Date(item.createdAt).getHours()}:${new Date(item.createdAt).getMinutes()}`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </>
                                            )
                                        })
                                    }
                                    <Typography component='small' sx={{ position: 'absolute', bottom: 60, fontSize: '12px', color: 'grey' }}>{typing}</Typography>
                                </Box>


                                <Box
                                    component="form"
                                    onSubmit={handleSubmitMessage}
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
                                        onChange={(e) => {
                                            setMessage(e.target.value)
                                            handleTyping(e.target.value)
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                    >
                                        Send
                                    </Button>
                                </Box>
                            </Grid>)
                            : roomDetails._id
                                ? (<Grid size={10} sx={{ position: 'relative' }}>
                                    <Box
                                        sx={{ position: 'absolute', top: 0, right: 0, left: 0, padding: "19px", borderBottom: '1px solid #dbdbdb' }}
                                    >
                                        {roomDetails?.name}
                                    </Box>

                                    <Box sx={{ height: 'calc(100vh - 118px)', padding: '82px 20px 20px 20px' }}>
                                        {
                                            groupMessageList?.map((item) => {
                                                return (
                                                    <Box sx={{ marginBottom: "15px", display: "flex", justifyContent: `${item.sender.toString() === loginUserDetails._id ? "end" : "start"}` }}>
                                                        <Box sx={{ width: "fit-content", p: "10px", bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                                                            {
                                                                (item.sender.toString() !== loginUserDetails._id && roomDetails._id) && <Typography sx={{ color: "#1976d2", fontSize: '0.8rem' }}>{item.user}</Typography>
                                                            }
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                                                <Typography>{item.text}</Typography>
                                                                <Typography component='small' sx={{ paddingLeft: "20px", fontSize: "0.7rem", color: '#9b9b9b' }}>{`${new Date(item.createdAt).getHours()}:${new Date(item.createdAt).getMinutes()}`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>

                                    <Box
                                        component="form"
                                        onSubmit={handleSubmitMessage}
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
                                </Grid>)
                                : (<Grid size={10} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography component='h3' variant='h6' sx={{ textAlign: "center" }}>Welcome <br /> Select a chat to start messaging</Typography>
                                </Grid>)
                    }
                </Grid>

                <Dialog
                    open={openCreateRoomModel}
                    onClose={handleCreateRoomModel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Create Room
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            type="text"
                            name="roomName"
                            placeholder="Enter room name"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCreateRoomModel}>Cancel</Button>
                        <Button onClick={handleCreateRoom} autoFocus>Create</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openJoinRoomModel}
                    onClose={handleJoinRoomModel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Join Room
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            type="text"
                            name="roomName"
                            placeholder="Enter room name"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleJoinRoomModel}>Cancel</Button>
                        <Button onClick={() => {
                            handleJoinRoom()
                            handleJoinRoomModel()
                        }} autoFocus>Join</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    )
}

export default Dashboard