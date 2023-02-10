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

const pages = ['추천여행지', '검색', '게시판', '마이페이지', '로그아웃']; // tab bar

export default function TopBar(props) {
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
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    console.log(event.currentTarget.value);
  };

  const logout = () => {
    setAnchorElNav(null);
    props.setLogin(false);
    localStorage.removeItem('ACCESS_TOKEN');
    history.push('/main');
  };

  return (
    <ThemeProvider theme={theme}>
      {/** 상단바 영역 */}
      <Box
        position="fixed"
        sx={{ flexGrow: 1, top: 0, left: 0, right: 0, m: 0, p: 0 }}
      >
        <AppBar
          position="static"
          color="primary"
          elevation={0}
          sx={{ mx: 0, px: 0 }}
        >
          <Toolbar sx={{ mx: 0, px: 0 }}>
            <Grid container sx={{ pr: 0, mx: 0, pl: 3, mt: 2 }}>
              <Grid
                xs="4"
                direction="row"
                justifyContent="center"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  textAlign="center"
                  color="secondary"
                >
                  <b>W</b>ith<b>M</b>e
                </Typography>
              </Grid>
              <Grid xs="4"></Grid>
              <Grid
                xs="4"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <MenuIcon
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(event) => handleOpenNavMenu(event)}
                  color="secondary"
                  sx={{ p: 0, m: 0 }}
                />
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  <MenuItem
                    key={'메인페이지'}
                    onClick={() => history.push('/main')}
                  >
                    <Typography textAlign="center">메인페이지</Typography>
                  </MenuItem>
                  {props.isLogin === true ? (
                    <MenuItem key={'로그아웃'} onClick={() => logout()}>
                      <Typography textAlign="center">로그아웃</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={'로그인'}
                      onClick={() => history.push('/login')}
                    >
                      <Typography textAlign="center">로그인</Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
