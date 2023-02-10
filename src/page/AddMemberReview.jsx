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
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BackBar from '../component/BackBar';
import styles from '../css/CreateStore.module.css';
import StarIcon from '@mui/icons-material/Star';

export default function AddMemberReview(props) {
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
  const [msg, setMsg] = useState('멤버 리뷰 작성'); // 상단에 표시할 메시지

  const [title, setTitle] = useState([]); // 제목
  const [content, setContent] = useState([]); // 내용
  const [score, setScore] = useState([]); // 별점
  const [result, setResult] = useState([]); // 멤버리스트
  // 뒤로가기
  const goBack = () => {
    history.push('/tourLog');
  };

  // 멤버리스트 불러오기
  const getResult = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.post(
        `http://localhost:8080/plan-members/list-review`,
        { planId: planId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setResult(response.data);
      if (response.data !== undefined && response.data !== null) {
        let tempArr1 = [];
        let tempArr2 = [];
        for (let i = 0; i < response.data.length; i++) {
          tempArr1.push(5);
          tempArr2.push('');
        }
        setScore(tempArr1);
        setTitle(tempArr2);
        setContent(tempArr2);
      }
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  // 리뷰작성
  const create = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');

      const req = [];
      for (let i = 0; i < result.length; i++) {
        let temp = {
          planId: planId,
          rating: score[i],
          content: content[i],
          reviewed: result[i].memberId,
        };
        req.push(temp);
      }
      console.log(req);
      const response = await axios.post(
        `http://localhost:8080/review/member/add`,
        req,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      history.push('/tourLog');
    }
  };

  // 렌더링
  const renderMember = () => {
    let asdf = [];
    for (let i = 0; i < result.length; i++) {
      asdf.push(
        <Grid xs="12" container sx={{ mb: 4 }}>
          <Grid xs="12" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="weight">
              {result[i].nickname}
            </Typography>
          </Grid>
          <Grid xs="12" sx={{ mb: 2 }}>
            <StarIcon
              sx={{ color: `${score[i] > 0 && '#FFFF00'}` }}
              onClick={() => {
                let tempArr = Array.from(score);
                tempArr[i] = 1;
                setScore(tempArr);
              }}
            />
            <StarIcon
              sx={{ color: `${score[i] > 1 ? '#FFFF00' : '#BBBB'}` }}
              onClick={() => {
                let tempArr = Array.from(score);
                tempArr[i] = 2;
                setScore(tempArr);
              }}
            />
            <StarIcon
              sx={{ color: `${score[i] > 2 ? '#FFFF00' : '#BBBB'}` }}
              onClick={() => {
                let tempArr = Array.from(score);
                tempArr[i] = 3;
                setScore(tempArr);
              }}
            />
            <StarIcon
              sx={{ color: `${score[i] > 3 ? '#FFFF00' : '#BBBB'}` }}
              onClick={() => {
                let tempArr = Array.from(score);
                tempArr[i] = 4;
                setScore(tempArr);
              }}
            />
            <StarIcon
              sx={{ color: `${score[i] > 4 ? '#FFFF00' : '#BBBB'}` }}
              onClick={() => {
                let tempArr = Array.from(score);
                tempArr[i] = 5;
                setScore(tempArr);
              }}
            />
          </Grid>
          <Grid xs="12" sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="제목"
              rows={7}
              multiline
              value={content[i]}
              onChange={(e) => {
                let tempArr = Array.from(content);
                tempArr[i] = e.target.value;
                setContent(tempArr);
              }}
              size="small"
            />
          </Grid>
        </Grid>
      );
    }
    return asdf;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ px: 3, mt: 15 }}>
        {renderMember()}
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
