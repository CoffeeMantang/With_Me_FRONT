import { ThemeProvider } from '@emotion/react';
import {
  Box,
  Button,
  createTheme,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BackBar from '../component/BackBar';
import styles from '../css/CreateStore.module.css';

export default function EditDetail(props) {
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
  const planDetailId = useParams().planDetailId;
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('여행 수정');

  // 데이터 가져오기
  const getResult = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.get(
        `http://localhost:8080/plan/detail/view?planDetailId=${planDetailId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setDate(response.data.detailDate);
      setContent(response.data.content);
      setImg(response.data.detailImg);
    } else {
      history.goBack();
    }
  };

  // 뒤로가기
  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    getResult();
  }, []);

  const update = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const fd = new FormData();
      Object.values(file).forEach((file) => {
        fd.append(`file`, file);
      });
      fd.append('planDetailId', planDetailId);
      fd.append('content', content);

      const response = await axios
        .post(`http://localhost:8080/plan/detail/update`, fd, {
          headers: {
            'Content-Type': `multipart/form-data; `,
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => history.goBack());
    } else {
      history.push('/login');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid xs="12" container sx={{ mt: 15, mb: 10, px: 3 }}>
        <Grid xs="12">
          <Typography variant="h6" fontWeight="bold" color="secondary">
            {date}
          </Typography>
        </Grid>
        <Grid xs="12" sx={{ mb: 1 }}>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </Grid>
        <Grid xs="6">
          <Button
            variant="contained"
            component="label"
            sx={{ borderColor: '#1E90FF', border: 1 }}
            size="small"
          >
            <Typography>파일 첨부</Typography>
            <input
              type="file"
              hidden
              onChange={(e) => {
                setFile(e.target.files);
              }}
            />
          </Button>
        </Grid>
        <Grid xs="6" sx={{ display: 'flex', alignItems: 'center' }}>
          {file === null && img === '' && (
            <Typography>선택된 파일 없음</Typography>
          )}
          {file !== null && (
            <div className={styles.image_box}>
              <img
                src={URL.createObjectURL(file[0])}
                alt="가게이미지"
                loading="lazy"
                className={styles.image_thumbnail}
              />
            </div>
          )}
          {img !== '' && file === null && (
            <div className={styles.image_box}>
              <img
                src={img}
                alt="가게이미지"
                loading="lazy"
                className={styles.image_thumbnail}
              />
            </div>
          )}
        </Grid>
      </Grid>
      {content !== '' && (
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
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
