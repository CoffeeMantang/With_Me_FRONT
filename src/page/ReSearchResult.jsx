import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  Divider,
  Grid,
  IconButton,
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
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { KAKAO_MAP } from '../kakaoScript';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export default function ReSearchResult(props) {
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

  const place = useParams().place; // 주소에서 검색지역 가져옴
  const category = useParams().category; // 주소에서 카테고리 가져옴

  const [result, setResult] = useState([]); // 검색결과를 담을 state
  const [page, setPage] = useState(0); // 페이지
  const [ref, inView] = useInView(); // 무한스크롤 관리
  const [loading, setLoading] = useState(true); // 로딩관리
  const [value, setValue] = useState(0); // value

  // 키워드로 검색하기
  const getResult = async (inputPage) => {
    console.log('키워드와 카테고리로 검색하기 시작, 들어온페이지: ' + inputPage);
    await setLoading(true); // 로딩 상태를 true
    const response = await axios.get(
      `http://localhost:8080/non-member/search?keyword=${place}&page=${inputPage}&category=${category}`
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
  };

  useEffect(() => {
    getResult(0);
  }, []);

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

  

  return (
    <ThemeProvider theme={theme}>
      <Grid sx={{ mt: 15, mb: 10, px: 3 }}>
        <Grid xs="12" sx={{ mb: 7 }}>
          <Typography variant="h4" fontWeight="bold">
            어서오십시오
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {place}
          </Typography>
        </Grid>

        {result.length > 0 &&
          result.map((item) => {
            return (
              <Grid xs="12" container>
                <Grid xs="10" container>
                  <Grid xs="12">
                    <Typography variant="h5" fontWeight="bold">
                      {item.title}
                    </Typography>
                  </Grid>
                  <Grid xs="12">
                    <Typography>
                      출발일: {item.startDate.split(' ')[0]} 작성자:{' '}
                      {item.nickname}
                    </Typography>
                  </Grid>
                  <Grid xs="12">
                    <Typography>
                      참가인원: {item.participant}/{item.personnel}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  xs="2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  direction="row"
                  justifyContent="center"
                >
                  <ArrowCircleRightIcon
                    fontSize="large"
                    color="secondary"
                    onClick={(e) => history.push(`/plan/${item.planId}`)}
                  />
                </Grid>
                <Grid xs="12" sx={{ mt: 2, mb: 3 }}>
                  <Divider />
                </Grid>
              </Grid>
            );
          })}
      </Grid>
      {result && !loading && !inView && <div ref={ref}>더보기</div>}
      <TopBar isLogin={props.isLogin} setLogin={props.setLogin} />
    </ThemeProvider>
  );
}
