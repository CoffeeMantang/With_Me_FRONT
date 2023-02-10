import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
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
const { kakao } = window;

export default function ReSearch(props) {
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
  const [result, setResult] = useState([]); // 검색한 결과물을 저장할 state
  const [keyword, setKeyword] = useState(''); // 검색어를 저장할 state
  const [map, setMap] = useState(null);
  const [select, setSelect] = useState(null); // 선택한 객체를 넣을 state
  const [category, setCategory] = useState(''); // 선택한 카테고리를 넣을 state
  const [step, setStep] = useState(0); // 단계를 저장할 state

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

  // 라디오 내용 넣기
  const inputRadio = (e) => {
    if (e.target.checked === true) {
      setCategory(e.target.value);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {step === 0 && (
        <Grid container sx={{ mt: 12, px: 2 }}>
          <Grid xs="10">
            <Box sx={{ borderRadius: 90, border: 0 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  [`& fieldset`]: {
                    borderRadius: 30,
                    border: 1,
                    borderColor: '#1E90FF',
                  },
                }}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid
            xs="2"
            direction="row"
            justifyContent="right"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <SearchIcon fontSize="large" onClick={() => search(keyword)} />
          </Grid>
          <Grid
            direction="row"
            justifyContent="center"
            xs="12"
            sx={{ mb: 3, display: 'flex', alignItems: 'center', mt: 3 }}
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
                        setSelect(item);
                        panTo(item.addressX, item.addressY);
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
      )}

      {step === 1 && (
        <Grid container xs="12" sx={{ mt: 10, px: 3 }}>
          <RadioGroup onChange={inputRadio}>
            <Grid xs="12" container>
              <Grid xs="1">
                <FormControlLabel value="산" control={<Radio />} />
              </Grid>
              <Grid xs="11">
                <Typography variant="h5" fontWeight="bold">
                  산
                </Typography>
              </Grid>
              <Grid xs="12" sx={{ my: 1 }}>
                <Divider />
              </Grid>
              <Grid xs="1">
                <FormControlLabel value="바다" control={<Radio />} />
              </Grid>
              <Grid xs="11">
                <Typography variant="h5" fontWeight="bold">
                  바다
                </Typography>
              </Grid>
              <Grid xs="12" sx={{ my: 1 }}>
                <Divider />
              </Grid>
              <Grid xs="1">
                <FormControlLabel value="호수" control={<Radio />} />
              </Grid>
              <Grid xs="11">
                <Typography variant="h5" fontWeight="bold">
                  호수
                </Typography>
              </Grid>
              <Grid xs="12" sx={{ my: 1 }}>
                <Divider />
              </Grid>
              <Grid xs="1">
                <FormControlLabel value="계곡" control={<Radio />} />
              </Grid>
              <Grid xs="11">
                <Typography variant="h5" fontWeight="bold">
                  계곡
                </Typography>
              </Grid>
              <Grid xs="12" sx={{ my: 1 }}>
                <Divider />
              </Grid>
              <Grid xs="1">
                <FormControlLabel value="박물관" control={<Radio />} />
              </Grid>
              <Grid xs="11">
                <Typography variant="h5" fontWeight="bold">
                  박물관
                </Typography>
              </Grid>
              <Grid xs="12" sx={{ my: 1 }}>
                <Divider />
              </Grid>
              <Grid xs="1">
                <FormControlLabel value="전시관" control={<Radio />} />
              </Grid>
              <Grid xs="11">
                <Typography variant="h5" fontWeight="bold">
                  전시관
                </Typography>
              </Grid>
              <Grid xs="12" sx={{ my: 1 }}>
                <Divider />
              </Grid>
              <Grid xs="1">
                <FormControlLabel value="문화재" control={<Radio />} />
              </Grid>
              <Grid xs="11">
                <Typography variant="h5" fontWeight="bold">
                  문화재
                </Typography>
              </Grid>
              <Grid xs="12" sx={{ my: 1 }}>
                <Divider />
              </Grid>
              <Grid xs="1">
                <FormControlLabel value="맛집여행" control={<Radio />} />
              </Grid>
              <Grid xs="11">
                <Typography variant="h5" fontWeight="bold">
                  맛집여행
                </Typography>
              </Grid>
            </Grid>
          </RadioGroup>
        </Grid>
      )}

      {select !== null && step === 0 && (
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
            onClick={() => setStep(1)}
          >
            <Typography color="primary">다음으로</Typography>
          </Button>
        </Box>
      )}
      {select !== null && step === 1 && category !== '' && (
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
            onClick={() =>
              history.push(`/reSearchResult/${select.name}/${category}`)
            }
          >
            <Typography color="primary">검색</Typography>
          </Button>
        </Box>
      )}
      <TopBar isLogin={props.isLogin} setLogin={props.setLogin} />
    </ThemeProvider>
  );
}
