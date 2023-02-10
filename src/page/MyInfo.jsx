import {
  Box,
  Button,
  createTheme,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
import styles from '../css/CreateStore.module.css';
import axios from 'axios';
import BackBar from '../component/BackBar';

export default function MyInfo(props) {
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

  // 회원정보 임시저장 state
  const [email, setEmail] = useState(''); // 이메일
  const [pw, setPw] = useState(''); // 비밀번호
  const [checkPw, setCheckPw] = useState(false); // 비밀번호확인용
  const [name, setName] = useState(''); //이름
  const [tel, setTel] = useState('010'); // 전화번호
  const [nickname, setNickname] = useState(''); // 닉네임
  const [address1, setAddress1] = useState(''); // 큰주소
  const [address2, setAddress2] = useState(''); // 작은주소
  const [file, setFile] = useState(null); // 파일
  const [gender, setGender] = useState(0);
  const [img, setImg] = useState('');

  const [msg, setMsg] = useState('내 정보 수정');

  // 실시간 비밀번호 매칭 채크
  const checkingPW = (event) => {
    if (pw === event.target.value) {
      setCheckPw(true);
    } else {
      setCheckPw(false);
    }
  };

  const handleComplete = (data) => {
    setAddress1(data.address); // 사용자가 선택한 주소를 넣어줌
  };

  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  // 내정보 가져오기
  const getMyInfo = async () => {
    if (localStorage.getItem('ACCESS_TOKEN') !== undefined) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.get(`http://localhost:8080/member/myInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data);

      setEmail(response.data.email);
      setNickname(response.data.nickname);
      setTel(response.data.contact);
      setGender(response.data.gender);
      setAddress1(response.data.address1);
      setAddress2(response.data.address2);
      setImg(response.data.profileImg);
      setName(response.data.name);
    } else {
      history.push('/main');
    }
  };

  // 뒤로가기
  const goBack = () => {
    history.goBack();
  };

  // 수정
  // 회원가입
  const edit = async () => {
    if (props.isLogin === true) {
      const fd = new FormData();
      Object.values(file).forEach((file) => {
        fd.append('file', file);
      });
      fd.append('email', email);
      fd.append('password', pw);
      fd.append('name', name);
      fd.append('nickname', nickname);
      fd.append('contact', tel);
      fd.append('question', '');
      fd.append('answer', '');
      fd.append('address1', address1);
      fd.append('address2', address2);

      const accessToken = localStorage.getItem('ACCESS_TOKEN');

      const response = await axios.post(
        `http://localhost:8080/member/editInfo`,
        fd,
        {
          headers: {
            'Content-Type': `multipart/form-data; `,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      history.push('/login'); // 회원가입 완료시 로그인페이지로 이동
    }
  };

  useEffect(() => {
    getMyInfo();
  });

  return (
    <ThemeProvider theme={theme} sx={{ mb: 10 }}>
      <Grid container sx={{ px: 3, mb: 6, mt: 10 }}>
        <Grid xs="12" sx={{ mt: 5 }}>
          <Typography>이메일</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            disabled
            variant="outlined"
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
        </Grid>
        <Grid xs="12" sx={{ mt: 2 }}>
          <Typography>이름</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></TextField>
        </Grid>
        <Grid xs="12" sx={{ mt: 2 }}>
          <Typography>휴대폰번호</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          ></TextField>
        </Grid>
        <Grid xs="12" sx={{ mt: 2 }}>
          <Typography>닉네임</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            disabled
            variant="outlined"
            size="small"
            fullWidth
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          ></TextField>
        </Grid>
        <Grid xs="12" sx={{ mt: 2 }}>
          <Typography>썸네일</Typography>
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
              onChange={(e) => setFile(e.target.files)}
            />
          </Button>
        </Grid>
        <Grid xs="6" sx={{ display: 'flex', alignItems: 'center' }}>
          {file === null && img === undefined && (
            <Typography>선택된 파일 없음</Typography>
          )}
          {file !== null && (
            <div className={styles.image_box}>
              <img
                src={URL.createObjectURL(file[0])}
                alt="썸네일"
                loading="lazy"
                className={styles.image_thumbnail}
              />
            </div>
          )}
          {file === null && img !== undefined && (
            <div className={styles.image_box}>
              <img
                src={img}
                alt="썸네일"
                loading="lazy"
                className={styles.image_thumbnail}
              />
            </div>
          )}
        </Grid>
        <Grid xs="12" sx={{ mt: 2 }}>
          <Typography>썸네일</Typography>
        </Grid>

        <Grid xs="12" sx={{ mt: 2 }}>
          <Typography>주소</Typography>
        </Grid>
        <Grid xs="12" container>
          <Grid xs="8">
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={address1}
              disabled
            ></TextField>
          </Grid>
          <Grid xs="4" sx={{ pl: 1 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ border: 0, backgroundColor: '#1E90FF' }}
              onClick={handleClick}
            >
              <Typography color="primary">주소검색</Typography>
            </Button>
          </Grid>
        </Grid>
        {address1 !== '' && (
          <Grid xs="12" sx={{ mt: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            ></TextField>
          </Grid>
        )}
      </Grid>
      {/** 모두 입력되었으면 버튼 노출 */}
      {address1 !== '' && email !== '' && tel !== '' && name !== '' && (
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
            onClick={() => edit()}
          >
            <Typography color="primary">정보수정</Typography>
          </Button>
        </Box>
      )}
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
