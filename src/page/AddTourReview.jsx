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
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BackBar from '../component/BackBar';
import styles from '../css/CreateStore.module.css';
import StarIcon from '@mui/icons-material/Star';

export default function AddTourReview(props) {
  const planId = useParams().planId; // 주소에서 planId 가져옴

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
  const [msg, setMsg] = useState('여행 리뷰 작성'); // 상단에 표시할 메시지

  const [title, setTitle] = useState(''); // 제목
  const [content, setContent] = useState(''); // 내용
  const [files, setFiles] = useState(null); // 파일
  const [score, setScore] = useState(5); // 별점
  // 뒤로가기
  const goBack = () => {
    history.push('/tourLog');
  };

  // 리뷰작성
  const create = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');

      const fd = new FormData();
      Object.values(files).forEach((file) => {
        fd.append('files', file); // notice의 file
      });
      fd.append('title', title);
      fd.append('content', content);
      fd.append('rating', score);
      fd.append('planId', planId);

      const response = await axios.post(
        `http://localhost:8080/review/plan/add`,
        fd,
        {
          headers: {
            'Content-Type': `multipart/form-data; `,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      history.push('/tourLog');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ px: 3, mt: 15 }}>
        <Grid xs="12" sx={{ mb: 2 }}>
          <StarIcon
            sx={{ color: `${score > 0 && '#FFFF00'}` }}
            onClick={() => setScore(1)}
          />
          <StarIcon
            sx={{ color: `${score > 1 ? '#FFFF00' : '#BBBB'}` }}
            onClick={() => setScore(2)}
          />
          <StarIcon
            sx={{ color: `${score > 2 ? '#FFFF00' : '#BBBB'}` }}
            onClick={() => setScore(3)}
          />
          <StarIcon
            sx={{ color: `${score > 3 ? '#FFFF00' : '#BBBB'}` }}
            onClick={() => setScore(4)}
          />
          <StarIcon
            sx={{ color: `${score > 4 ? '#FFFF00' : '#BBBB'}` }}
            onClick={() => setScore(5)}
          />
        </Grid>
        <Grid xs="12" sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid xs="12" sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="제목"
            rows={7}
            multiline
            value={content}
            onChange={(e) => setContent(e.target.value)}
            size="small"
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
                setFiles(e.target.files);
              }}
            />
          </Button>
        </Grid>
        <Grid xs="6" sx={{ display: 'flex', alignItems: 'center' }}>
          {files === null && <Typography>선택된 파일 없음</Typography>}
          {files !== null && (
            <div className={styles.image_box}>
              <img
                src={URL.createObjectURL(files[0])}
                alt="가게이미지"
                loading="lazy"
                className={styles.image_thumbnail}
              />
            </div>
          )}
        </Grid>
      </Grid>
      {title !== '' && content !== '' && (
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
            onClick={() => create()}
          >
            <Typography color="primary">작성</Typography>
          </Button>
        </Box>
      )}
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
