import React from 'react'
import Moralis from 'moralis/types';
import { useMoralis } from 'react-moralis';
import { Typography, Box } from '@mui/material';

const Profile = (props: IProfileProps) => {
   const {account} = useMoralis()
   console.log(props)
   console.log(`account: ${account}`)
    return (
        <>
            <Box>
                <Typography>{JSON.stringify(props.user)}</Typography>
            </Box>
        </>)
}

export interface IProfileProps {
  user: Moralis.User;
}

export default Profile
