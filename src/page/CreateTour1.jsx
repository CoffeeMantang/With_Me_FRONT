import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import BackBar from '../component/BackBar';
const { kakao } = window;

export default function CreateTour1(props) {
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
  const [msg, setMsg] = useState('글쓰기(1/4)'); // 상단바에 표시될 메시지
  const [map, setMap] = useState(null); // 지도
  const [result, setResult] = useState([]); // 지역 검색결과 담을곳
  const [keyword, setKeyword] = useState(''); // 검색 키워드

  // 지도생성
  useEffect(() => {
    const container = document.getElementById('map');
    const options = { center: new kakao.maps.LatLng(33.450701, 126.570667) };
    const kakaoMap = new kakao.maps.Map(container, options);
    setMap(kakaoMap);
  }, []);

  // 지도 해당 좌표로 이동시키기
  function panTo(x, y) {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(y, x);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
  }

  // 지역을 검색하는 function
  const search = (kw) => {
    let tempArr = []; // 결과물을 임시 저장할 배열
    for (let i = 0; i < SIGUN.length; i++) {
      if (SIGUN[i].name.includes(kw)) {
        tempArr.push(SIGUN[i]);
      }
    }
    setResult(tempArr);
  };

  // 이전페이지로 이동시키기
  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    props.setStep(0);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ mt: 10, px: 3 }}>
        <Grid xs="12">
          <Typography>제목</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            value={props.title}
            onChange={(e) => props.setTitle(e.target.value)}
          />
        </Grid>
        <Grid xs="12">
          <Typography>장소</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              search(e.target.value);
            }}
          />
        </Grid>
        <Grid
          xs="12"
          direction="row"
          justifyContent="center"
          sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 1 }}
        >
          {/** 지도 넣을 곳 */}
          <Box
            sx={{
              width: '80vw',
              height: '80vw',
            }}
          >
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
          </Box>
        </Grid>
        {props.place !== null && (
          <Typography sx={{ mb: 2 }}>
            선택된 지역: {props.place.name}
          </Typography>
        )}
        {result.length > 0 &&
          result.map((item) => {
            return (
              <Grid xs="12" container>
                <Grid xs="10">
                  <Typography variant="h5">{item.name}</Typography>
                </Grid>
                <Grid
                  xs="2"
                  direction="row"
                  justifyContent="center"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <ArrowCircleRightOutlinedIcon
                    onClick={() => {
                      panTo(item.addressX, item.addressY);
                      props.setPlace(item);
                    }}
                  />
                </Grid>
                <Grid xs="12" sx={{ mt: 1, mb: 2 }}>
                  <Divider />
                </Grid>
              </Grid>
            );
          })}
      </Grid>
      {/** 모두 입력되면 다음으로 가는 버튼 노출 */}
      {props.title !== '' && props.place !== null && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '15vw',
          }}
          color="secondary"
        >
          <Button
            fullWidth
            sx={{ backgroundColor: '#1E90FF', height: '100%' }}
            onClick={() => props.setStep(1)}
          >
            <Typography color="primary">다음으로</Typography>
          </Button>
        </Box>
      )}
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
