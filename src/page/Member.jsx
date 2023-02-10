import { ThemeProvider } from '@emotion/react';
import {
  Box,
  Button,
  createTheme,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useHistory, useParams } from 'react-router-dom';
import BackBar from '../component/BackBar';
import styles from '../css/asdf.module.css';
import style2 from '../css/CreateStore.module.css';

export default function Member() {
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
  const memberId = useParams().memberId; // 주소에서 memberId 가져옴
  const [msg, setMsg] = useState('유저 정보'); // 상단에 표시할 메시지
  const [profile, setProfile] = useState(null);
  const [toggle, setToggle] = useState(0); // 0: 유저평가 , 1 : 여행리뷰

  const [result, setResult] = useState([]); // 검색결과를 담을 state
  const [page, setPage] = useState(0); // 페이지
  const [ref, inView] = useInView(); // 무한스크롤 관리
  const [loading, setLoading] = useState(true); // 로딩관리

  

  // 멤버 프로필 가져오기
  const getProfile = async () => {
    console.log(`memberId: ${memberId}`);
    const response = await axios.post(
      `http://localhost:8080/non-member/profile`,
      { memberId: memberId }
    );
    setProfile(response.data);
  };

  useEffect(() => {
    getProfile();
    if (toggle === 0) {
      getMemberReview(0);
    } else {
      getPlanReview(0);
    }
  }, []);

  useEffect(() => {
    console.log('토글 번경 감지 ' + toggle);
    setPage(0);
    setLoading(true);
    if (toggle === 0) {
      getMemberReview(0);
    } else {
      getPlanReview(0);
    }
  }, [toggle]);

  // 무한스크롤
  useEffect(() => {
    console.log('inView의 useEffect예요');
    // 페이지를 하나 더한 후 api 호출
    if (loading === false && inView === true) {
      // inView가 true로 변한 경우에만
      // 로딩중이 아닐 떄만
      const newPage = parseInt(page) + 1;
      if (toggle === 0) {
        getMemberReview(newPage);
      } else {
        getPlanReview(newPage);
      }
      setPage(newPage);
    }
  }, [inView]);

  // 유저평가 가져오기
  const getMemberReview = async (inputPage) => {
    console.log('유저평가 가져오기 작동');
    await setLoading(true);
    const response = await axios.get(
      `http://localhost:8080/non-member/reviewMemberList?page=${inputPage}&memberId=${memberId}`
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

  // 여행평가 가져오기
  const getPlanReview = async (inputPage) => {
    console.log('유저평가 가져오기 작동');
    await setLoading(true);
    const response = await axios.get(
      `http://localhost:8080/non-member/reviewPlanList?page=${inputPage}&memberId=${memberId}`
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

  const goBack = () => {
    history.goBack();
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ mt: 10, px: 3 }}>
        {profile !== null && (
          <Grid container xs="12" sx={{ mb: 5 }}>
            <Grid xs="4">
              <Box
                className={style2.image_box}
                direction="row"
                justifyContent="center"
                sx={{
                  borderRadius: 90,
                  width: '20vw',
                  height: '20vw',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  src={profile.profileImg}
                  alt="썸네일"
                  loading="lazy"
                  className={style2.image_thumbnail}
                />
              </Box>
            </Grid>
            <Grid xs="8" sx={{ mb: 5 }}>
              <Typography variant="h2" fontWeight="bold" color="secondary">
                {profile.nickname}
              </Typography>
            </Grid>
            {toggle === 0 && (
              <Grid
                xs="12"
                container
                sx={{
                  borderColor: '#1E90FF',
                  border: 1,
                  borderRadius: 1,
                  color: '#1E90FF',
                }}
              >
                <Grid xs="6">
                  <Button
                    fullWidth
                    sx={{
                      backgroundColor: '#1E90FF',
                    }}
                    onClick={() => setToggle(0)}
                  >
                    <Typography sx={{ color: '#FFFFFF' }}>유저평가</Typography>
                  </Button>
                </Grid>
                <Grid xs="6">
                  <Button
                    fullWidth
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: '#1E90FF',
                    }}
                    onClick={() => setToggle(1)}
                  >
                    <Typography sx={{ color: '#1E90FF' }}>여행리뷰</Typography>
                  </Button>
                </Grid>
              </Grid>
            )}
            {toggle === 1 && (
              <Grid
                xs="12"
                container
                sx={{
                  borderColor: '#1E90FF',
                  border: 1,
                  borderRadius: 1,
                  color: '#1E90FF',
                }}
              >
                <Grid xs="6">
                  <Button
                    fullWidth
                    sx={{
                      backgroundColor: '#FFFFFF',
                    }}
                    onClick={() => setToggle(0)}
                  >
                    <Typography sx={{ color: '#1E90FF' }}>유저평가</Typography>
                  </Button>
                </Grid>
                <Grid xs="6">
                  <Button
                    fullWidth
                    sx={{
                      backgroundColor: '#1E90FF',
                    }}
                    onClick={() => setToggle(1)}
                  >
                    <Typography sx={{ color: '#FFFFFF' }}>여행리뷰</Typography>
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
        {result.length > 0 &&
          result.map((item) => {
            return (
              <Grid xs="12" container>
                <Grid xs="12">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    onClick={() => console.log(item)}
                  >
                    {item.content}
                  </Typography>
                </Grid>
                {item.reviewPlanImgDTOList !== undefined &&
                  item.reviewPlanImgDTOList !== null && (
                    <Grid xs="12">
                      <div className={styles.image_box}>
                        <img
                          src={item.reviewPlanImgDTOList[0].path}
                          alt="가게이미지"
                          loading="lazy"
                          className={styles.image_thumbnail}
                        />
                      </div>
                    </Grid>
                  )}
                <Grid xs="12">
                  <Typography>별점: {item.rating}</Typography>
                </Grid>
                <Grid xs="12">
                  <Typography>{item.content}</Typography>
                </Grid>
                <Grid xs="12" sx={{ mt: 2, mb: 3 }}>
                  <Divider />
                </Grid>
              </Grid>
            );
          })}
      </Grid>
      {result && !loading && !inView && <div ref={ref}>더보기</div>}
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
