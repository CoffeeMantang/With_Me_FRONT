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
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

export default function BackBar(props) {
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
      {/** 상단바 영역 */}
      <Box
        position="fixed"
        sx={{ flexGrow: 1, top: 0, left: 0, right: 0, m: 0, p: 0 }}
      >
        <AppBar position="static" color="primary" elevation={0} sx={{ mx: 0 }}>
          <Toolbar sx={{ mx: 0 }}>
            <Grid container sx={{ pr: 0, mx: 0, mt: 2 }}>
              <Grid
                xs="3"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <ArrowBackIosNewOutlinedIcon
                  size="small"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="secondary"
                  sx={{ p: 0, m: 0 }}
                  onClick={() => props.func()}
                />
              </Grid>
              <Grid
                xs="6"
                direction="row"
                justifyContent="center"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  textAlign="center"
                  fontWeight="bold"
                >
                  {props.msg}
                </Typography>
              </Grid>
              <Grid xs="3"></Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
