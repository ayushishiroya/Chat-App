import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({});

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (Object.values(values)?.every(i => i)) {
            await axios.post(`${process.env.REACT_APP_CLIENT_URI}/api/user/sign-in`, values)
                .then(res => {
                    if (res.data.isSuccess) {
                        setValues({ username: '', password: '' })
                        localStorage.setItem("token", JSON.stringify(res.data.accesstoken))
                        navigate('/dashboard')
                    } else {
                        console.log(res.data.message)
                    }
                })
                .catch(err => console.log(err))

        }
    };

    return (
        <div className='App'>
            <Box sx={{ width: '25%', border: '1px solid #dbdbdb', padding: '40px', borderRadius: '10px' }}>
                <Typography
                    variant="h4"
                    sx={{ width: '100%', paddingBottom: '20px', textAlign: 'center' }}
                >
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="email">Username</FormLabel>
                        <TextField
                            type="text"
                            name="username"
                            placeholder="admin"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={values.username}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            name="password"
                            placeholder="••••••"
                            type="password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={values.password}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Sign in
                    </Button>
                    <Typography sx={{ textAlign: 'center', paddingTop: '10px' }}>
                        Don&apos;t have an account?{' '}
                        <Typography
                            component='span'
                            variant="body2"
                            sx={{ alignSelf: 'center', cursor: 'pointer', color: "#1976d2" }}
                            onClick={() => navigate('/sign-up')}
                        >
                            Sign up
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}

export default SignIn;