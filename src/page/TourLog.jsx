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

export default function TourLog(props) {
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
  const [msg, setMsg] = useState('여행 기록'); // 상단에 표시할 메시지

  const [result, setResult] = useState([]); // 여행기록 담을 state

  const [page, setPage] = useState(0); // 페이징
  const [ref, inView] = useInView(); // 무한스크롤 관리
  const [loading, setLoading] = useState(true); // 로딩관리

  // 무한스크롤
  useEffect(() => {
    console.log('inView의 useEffect예요');
    // 페이지를 하나 더한 후 api 호출
    if (loading === false && inView === true) {
      // inView가 true로 변한 경우에만
      // 로딩중이 아닐 떄만
      const newPage = parseInt(page) + 1;

      getResult(newPage);
      setPage(newPage);
    }
  }, [inView]);

  useEffect(() => {
    getResult(0);
  }, []);

  // 여행기록 불러오기
  const getResult = async (inputPage) => {
    if (props.isLogin === true) {
      setLoading(true);
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.post(
        `http://localhost:8080/plan/list?page=${inputPage}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (inputPage === 0) {
        setResult(response.data);
      } else {
        setResult([...result, ...response.data]);
      }
      if (response.data.length < 10) {
        // 넘어온 결과물의 갯수가 10보다 작으면 더이상 로드 안하도록
        setLoading(true);
      } else {
        setLoading(false);
      }
    } else {
      history.push('/login');
    }
  };

  //뒤로각3ㅣ
  const goBack = () => {
    history.push('/myPage');
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ px: 3, mt: 15 }}>
        {result.length > 0 ? (
          result.map((item) => {
            return (
              <Grid
                xs="12"
                container
                sx={{
                  border: 1,
                  borderColor: 'gray',
                  borderRadius: 3,
                  p: 2,
                  mb: 3,
                }}
              >
                <Grid xs="12">
                  <Typography
                    fontSize="h5"
                    fontWeight="bold"
                    onClick={() => history.push(`/plan/${item.planId}`)}
                  >
                    {item.title}
                  </Typography>
                </Grid>
                <Grid xs="12">
                  <Typography sx={{ color: 'grey' }}>
                    {item.startDate.split(' ')[0]} ~{' '}
                    {item.endDate.split(' ')[0]}
                  </Typography>
                </Grid>
                <Grid xs="12">
                  <Typography fontWeight="bold">
                    작성자 : {item.nickname}
                  </Typography>
                </Grid>
                <Grid xs="12" sx={{ mb: 1 }}>
                  <Typography>참가인원 : {item.personnel}</Typography>
                </Grid>

                {item.reviewPlanState === 1 && (
                  <Grid xs="6" sx={{ px: 1 }}>
                    <Button
                      fullWidth
                      size="small"
                      sx={{ backgroundColor: '#1E90FF' }}
                      onClick={() =>
                        history.push(`/addTourReview/${item.planId}`)
                      }
                    >
                      <Typography fontWeight="bold">여행리뷰작성</Typography>
                    </Button>
                  </Grid>
                )}
                {item.reviewMemberState === 1 && (
                  <Grid xs="6" sx={{ px: 1 }}>
                    <Button
                      fullWidth
                      size="small"
                      sx={{ backgroundColor: '#1E90FF' }}
                      onClick={() =>
                        history.push(`/addMemberReview/${item.planId}`)
                      }
                    >
                      <Typography fontWeight="bold">회원리뷰</Typography>
                    </Button>
                  </Grid>
                )}
              </Grid>
            );
          })
        ) : (
          <Grid xs="12">
            <Typography variant="h4" fontWeight="bold" align="center">
              {' '}
              여행기록이 없어요!{' '}
            </Typography>
          </Grid>
        )}
      </Grid>
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
