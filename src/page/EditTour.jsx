import { ThemeProvider } from '@emotion/react';
import {
  Button,
  createTheme,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BackBar from '../component/BackBar';

export default function EditTour(props) {
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
  const planId = useParams().planId;
  const [notice, setNotice] = useState('');
  const [msg, setMsg] = useState('여행정보 수정');
  const [title, setTitle] = useState('');

  // 여행일정가져오기
  const getResult = async () => {
    if (props.isLogin === true) {
      const response = await axios.get(
        `http://localhost:8080/non-member/view?planId=${planId}`
      );
      setNotice(response.data.notice);
      setTitle(response.data.title);
    } else {
      history.push(`/plan/${planId}`);
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  // 수정내용 전송
  const update = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.post(
        `http://localhost:8080/plan/update`,
        {
          planId: planId,
          notice: notice,
          title: title,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      history.push(`/plan/${planId}`);
    } else {
      history.push('/login');
    }
  };

  // 뒤로가기
  const goBack = () => {
    history.push(`/plan/${planId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ px: 3, mt: 15, mb: 10 }}>
        <Grid xs="12">
          <Typography variant="h6" fontWeight="bold" color="secondary">
            제목
          </Typography>
        </Grid>
        <Grid xs="12" sx={{ mb: 1 }}>
          <TextField
            value={title}
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid xs="12">
          <Typography variant="h6" fontWeight="bold" color="secondary">
            여행소개
          </Typography>
        </Grid>
        <Grid xs="12" sx={{ mb: 1 }}>
          <TextField
            multiline
            rows={5}
            value={notice}
            fullWidth
            onChange={(e) => setNotice(e.target.value)}
          />
        </Grid>
      </Grid>

      {title !== '' && notice !== '' && (
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
            onClick={() => update()}
          >
            <Typography color="primary">다음으로</Typography>
          </Button>
        </Box>
      )}
      <BackBar func={goBack} msg={msg} />
    </ThemeProvider>
  );
}
