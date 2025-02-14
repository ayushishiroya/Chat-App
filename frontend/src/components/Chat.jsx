import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios

const Chat = ({ username, room }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [typing, setTyping] = useState('');

    // Fetch messages from the API using axios
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:9001/api/messages?room=${room}`);
            setMessageList(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        const messageData = {
            room,
            author: username,
            message: currentMessage,
            time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
        };

        // Send the message via the API using axios
        try {
            await axios.post('http://localhost:9001/api/send_message', messageData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Update message list after sending
            setMessageList((prevMessages) => [...prevMessages, messageData]);
            setCurrentMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleTyping = (e) => {
        setCurrentMessage(e.target.value);
        if (e.target.value !== "") {
            // Optionally, notify the server about typing
            // socket.emit('typing', { room, username });
            setTyping(`${username} is typing...`);
        } else {
            // socket.emit('typing', { room, username: '' });
            setTyping('');
        }
    };

    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                {
                    messageList?.map(item => (
                        <div className='message-container' id={item.author === username ? 'you' : 'other'} key={item.time}>
                            <div className='message-parent'>
                                <p className='user'>{item.author}</p>
                                <div className="message-content">
                                    <p className='message'>{item.message}</p>
                                    <p className='time'>{item.time}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <p className='typing'>{typing}</p>
            </div>
            <form className="chat-footer" onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder='Type a message'
                    value={currentMessage}
                    onChange={handleTyping}
                />
                <button type='submit'>Send</button>
            </form>
        </div>
    );
};

export default Chat;
