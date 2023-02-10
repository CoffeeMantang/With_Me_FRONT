import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TopBar from '../component/TopBar';

export default function Main(props) {
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

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ mt: 15, px: 3 }}>
        <Grid xs="12" sx={{ mb: 10 }}>
          <Typography fontWeight="bold" variant="h5" sx={{ color: '#000000' }}>
            여행자님
          </Typography>

          <Typography fontWeight="bold" variant="h5" sx={{ color: '#000000' }}>
            어디로 떠나시나요?
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
            onClick={() => history.push('/reSearch')}
          >
            <Typography variant="h5" fontWeight="bold" color="primary">
              추천여행지
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
            onClick={() => history.push('/createTour')}
          >
            <Typography variant="h5" fontWeight="bold" color="primary">
              여행만들기
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
            onClick={() => history.push('/search')}
          >
            <Typography variant="h5" fontWeight="bold" color="primary">
              검색
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
            {props.isLogin === true && (
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                onClick={() => history.push('/myPage')}
              >
                마이페이지
              </Typography>
            )}
            {props.isLogin === false && (
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                onClick={() => history.push('/login')}
              >
                로그인
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      {/** 상단바 영역 */}
      <TopBar isLogin={props.isLogin} setLogin={props.setLogin} />
    </ThemeProvider>
  );
}
