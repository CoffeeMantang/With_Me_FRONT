import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Container,
  createTheme,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Input,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TopBar from '../component/TopBar';
import { SIGUN } from '../Sigungu';
import SearchIcon from '@mui/icons-material/Search';
import BackBar from '../component/BackBar';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import styles from '../css/CreateStore.module.css';
import axios from 'axios';
import { calendarOrClockPickerClasses } from '@mui/x-date-pickers/internals/components/CalendarOrClockPicker/calendarOrClockPickerClasses';
import { useInView } from 'react-intersection-observer';

export default function MyPage(props) {
  const history = useHistory();
  const theme = createTheme({
    typography: {
      fontFamily: 'NanumSquareNeo-Variable',
    },
    palette: {
      primary: {
        main: '#FFFFFF',
      },
      secondary: {
        main: '#1E90FF',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
                        @font-face {
                          font-family: 'NanumSquareNeo-Variable';
                          font-style: normal;
                          font-display: swap;
                          font-weight: normal;
                          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumSquareNeo-Variable.woff2') format('woff2');
                          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
                        }
                      `,
      },
    },
  });
  const [msg, setMsg] = useState('마이페이지'); // 상단에 표시할 메시지

  // 뒤로가기
  const goBack = () => {
    history.push('/main');
  };

  useEffect(() => {
    if (props.isLogin === false) {
      history.push('/login');
    }
  }, []);

  const [memberId, setMemberId] = useState(0);

  // 내정보 가져오기
  const getMyInfo = async () => {
    if (localStorage.getItem('ACCESS_TOKEN') !== undefined) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.get(`http://localhost:8080/member/myInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data);
      setMemberId(response.data.memberId);
    } else {
      history.push('/login');
    }
  };

  useEffect(() => {
    getMyInfo();
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ mt: 15, px: 3 }}>
        <Grid xs="12" sx={{ mb: 10 }}>
          <Typography fontWeight="bold" variant="h5" sx={{ color: '#000000' }}>
            무엇이
          </Typography>

          <Typography fontWeight="bold" variant="h5" sx={{ color: '#000000' }}>
            필요하신가요?
          </Typography>
        </Grid>
        <Grid
          xs="6"
          direction="row"
          justifyContent="center"
          sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
        >
          <Box
            direction="row"
            justifyContent="center"
            sx={{
              borderRadius: 90,
              width: '40vw',
              height: '40vw',
              backgroundImage: 'url("../imgs/main1.jpg")',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => history.push(`/member/${memberId}`)}
          >
            <Typography variant="h5" fontWeight="bold" color="primary">
              내 평가
            </Typography>
          </Box>
        </Grid>
        <Grid
          xs="6"
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
          direction="row"
          justifyContent="center"
        >
          <Box
            direction="row"
            justifyContent="center"
            sx={{
              borderRadius: 90,
              width: '40vw',
              height: '40vw',
              backgroundImage: 'url("../imgs/main2.jpg")',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => history.push('/tourLog')}
          >
            <Typography variant="h5" fontWeight="bold" color="primary">
              여행 기록
            </Typography>
          </Box>
        </Grid>
        <Grid
          sx={{ display: 'flex', alignItems: 'center' }}
          xs="6"
          direction="row"
          justifyContent="center"
        >
          <Box
            direction="row"
            justifyContent="center"
            sx={{
              borderRadius: 90,
              width: '40vw',
              height: '40vw',
              backgroundImage: 'url("../imgs/main3.jpg")',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => history.push('/apply')}
          >
            <Typography variant="h5" fontWeight="bold" color="primary">
              신청 수락
            </Typography>
          </Box>
        </Grid>
        <Grid
          sx={{ display: 'flex', alignItems: 'center' }}
          xs="6"
          direction="row"
          justifyContent="center"
        >
          <Box
            direction="row"
            justifyContent="center"
            sx={{
              borderRadius: 90,
              width: '40vw',
              height: '40vw',
              backgroundImage: 'url("../imgs/main4.jpg")',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              onClick={() => history.push('/myInfo')}
            >
              내정보
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
