import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({});

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (Object.values(values)?.every(i => i)) {
            await axios.post(`${process.env.REACT_APP_CLIENT_URI}/api/user/sign-up`, values)
                .then(res => {
                    if (res.data.isSuccess) {
                        setValues({ name: "", email: "", phone: "", username: '', password: '' })
                        navigate('/sign-in')
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
                    Sign Up
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
                        <FormLabel htmlFor="email">Name</FormLabel>
                        <TextField
                            type="text"
                            name="name"
                            placeholder="John"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={values.name}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            type="text"
                            name="email"
                            placeholder="jogn@gmail.com"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={values.email}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Phone</FormLabel>
                        <TextField
                            type="number"
                            name="phone"
                            placeholder="9102584036"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={values.phone}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    </Box>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Sign up
                    </Button>
                    <Typography sx={{ textAlign: 'center', paddingTop: '10px' }}>
                        Already have an account?{' '}
                        <Typography
                            component='span'
                            variant="body2"
                            sx={{ alignSelf: 'center', cursor: 'pointer', color: "#1976d2" }}
                            onClick={() => navigate('/sign-in')}
                        >
                            Sign in
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}

export default SignUp;