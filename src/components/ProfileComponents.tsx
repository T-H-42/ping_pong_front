import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Box, Typography } from '@mui/material';
import styles from '../styles/main/main.module.css';
import stylesP from '../styles/profile.module.css'

const ProfileAchievements = ({ achievements }) => {
    return (
      <Box sx={{ width: 300, height: 100, p: 2, border: '1px solid black' }}>
        <Typography variant="h6">업적</Typography>
        {achievements.map((achievement) => <Typography key={achievement}>{achievement}</Typography>)}
      </Box>
    )
};

const ProfileGameHistory = ({ username, history }) => {
  return (
    <Box
    sx={{
        width: '80%',
        height: '100%',
        // padding: '16px 24px',
        gap: '16px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    }}
>
      <Typography variant="h6">전적</Typography>

      <Table cellPadding={10} cellSpacing={10} className={stylesP.centeredTable}>
        <TableHead>
          <TableRow>
            <TableCell>결과</TableCell>
            <TableCell>winner</TableCell>
            <TableCell>플레이 날짜</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {history.map((data) => {
          const date = new Date(data.time);
          const gameDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          return (
            <TableRow key={ date.toISOString() }>
              <TableCell>
                { username === data.winuser ? (' WIN ') : (' LOOSE ') }
              </TableCell>
              <TableCell>
                {data.winuser}
              </TableCell>
              <TableCell>
                {gameDate}
              </TableCell>
            </TableRow>
          );
        })}
        </TableBody>
      </Table>
    </Box>
  )
};

const ProfileHeader = ({ imageUrl, userName, ladderLv }) => {
	return (
	<>
		<Box
		component="img"
		className={styles.sample}
		src={imageUrl ? `http://${process.env.REACT_APP_IP_ADDRESS}:4000/${imageUrl}` : "/images/profile.jpg"}
		></Box>

		<Typography variant="h3">{userName}</Typography>
    <Typography variant='body1'>등급 점수 : {ladderLv}</Typography>

	</>
	)
}

export {ProfileHeader, ProfileGameHistory, ProfileAchievements};