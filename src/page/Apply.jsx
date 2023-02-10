import {
  Button,
  createTheme,
  Grid,
  ThemeProvider,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import BackBar from '../component/BackBar';

export default function Apply(props) {
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
  const [msg, setMsg] = useState('신청 확인'); // 상단에 표시할 메시지

  const [result, setResult] = useState([]); // 결과 받아올 state

  // 뒤로가기
  const goBack = () => {
    history.push('/myPage');
  };

  // 들어온 신청들 가져오기
  const getResult = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.post(
        `http://localhost:8080/apply-plan/received-list`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setResult(response.data);
    } else {
      history.push('/login');
    }
  };

  // 거절 및 수락
  const accept = async (id1, id2, e) => {
    // 0: 수락, 1: 거절
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios
        .post(
          `http://localhost:8080/apply-plan/accept-refuse?isAccept=${e}`,
          {
            applyPlanId: id1,
            planId: id2,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => getResult());
    } else {
      history.push('/login');
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ px: 3, mt: 15 }}>
        {result.length > 0 &&
          result.map((item) => {
            return (
              <Grid
                xs="12"
                container
                sx={{ borderColor: 'gray', border: 1, borderRadius: 3, p: 2 }}
                key="a"
              >
                <Grid xs="12">
                  <Typography fontWeight="bold">
                    신청인 : {item.nickname}
                  </Typography>
                </Grid>
                <Grid xs="12" sx={{ mb: 2 }}>
                  <Typography fontWeight="bold">
                    내용 : {item.content}
                  </Typography>
                </Grid>

                <Grid xs="6" sx={{ px: 1 }}>
                  <Button
                    sx={{ backgroundColor: 'grey' }}
                    fullWidth
                    onClick={() => accept(item.applyPlanId, item.planId, 1)}
                  >
                    <Typography>거절</Typography>
                  </Button>
                </Grid>
                <Grid xs="6" sx={{ px: 1 }}>
                  <Button
                    sx={{ backgroundColor: '#1E90FF' }}
                    fullWidth
                    onClick={() => accept(item.applyPlanId, item.planId, 0)}
                  >
                    <Typography>수락</Typography>
                  </Button>
                </Grid>
              </Grid>
            );
          })}
      </Grid>
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
