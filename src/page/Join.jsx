import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
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
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
import styles from '../css/CreateStore.module.css';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import axios from 'axios';

export default function Join(props) {
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
  const [birth, setBirth] = useState(dayjs(new Date())); // 생일
  const [gender, setGender] = useState(0);
  const [img, setImg] = useState('');

  // 실시간 비밀번호 매칭 채크
  const checkingPW = (event) => {
    if (pw === event.target.value) {
      setCheckPw(true);
    } else {
      setCheckPw(false);
    }
  };

  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    setAddress1(data.address); // 사용자가 선택한 주소를 넣어줌
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  useEffect(() => {
    if (props.isLogin === true) {
      history.push('/main'); // 이미 로그인 되어있으면 main으로 날림
    }
  });

  // 회원가입
  const signup = async () => {
    if (props.isLogin === false) {
      const fd = new FormData();
      Object.values(file).forEach((file) => {
        fd.append('file', file);
      });
      fd.append('email', email);
      fd.append('password', pw);
      fd.append('name', name);
      fd.append('nickname', nickname);
      fd.append('contact', tel);
      fd.append('gender', gender);
      fd.append('birthday', `${birth.format('YYYY-MM-DD').toString()}`);
      console.log(`bday: ${birth.format('YYYY-MM-DD')}`);
      fd.append('question', '');
      fd.append('answer', '');
      fd.append('address1', address1);
      fd.append('address2', address2);

      const response = await axios.post(
        `http://localhost:8080/non-member/signup`,
        fd,
        {
          headers: {
            'Content-Type': `multipart/form-data; `,
          },
        }
      );

      history.push('/login'); // 회원가입 완료시 로그인페이지로 이동
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ px: 3, mb: 6 }}>
        <Grid
          xs="12"
          direction="row"
          justifyContent="center"
          sx={{ display: 'flex', alignItems: 'center', mt: 5 }}
        >
          <Typography variant="h5" fontWeight="bold">
            회원가입
          </Typography>
        </Grid>
        <Grid xs="12" sx={{ mt: 5 }}>
          <Typography>이메일</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
        </Grid>
        <Grid xs="12" sx={{ mt: 2 }}>
          <Typography>비밀번호</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          ></TextField>
        </Grid>
        <Grid xs="12" sx={{ mt: 2 }}>
          <Typography>비밀번호 확인</Typography>
        </Grid>
        <Grid xs="12">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            type="password"
            onChange={(e) => checkingPW(e)}
          ></TextField>
          {checkPw === false && <Typography>비밀번호가 달라요</Typography>}
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
          <Typography>생일</Typography>
        </Grid>
        <Grid xs="12">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="출발일"
              inputFormat="MM/DD/YYYY"
              value={birth}
              onChange={(e) => {
                console.log(e.format("YYYY-MM-DD'T'HH:mm:ss"));
                setBirth(e);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
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
          {file === null && img === '' && (
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
          {file === null && img !== '' && (
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
          <Typography>성별</Typography>
        </Grid>
        <Grid xs="12">
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="0"
              control={<Radio />}
              label="남"
              onChange={(e) => {
                if (e.target.checked === true) {
                  setGender(e.target.value);
                }
              }}
            />
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="여"
              onChange={(e) => {
                if (e.target.checked === true) {
                  setGender(e.target.value);
                }
              }}
            />
          </RadioGroup>
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
      {address1 !== '' &&
        email !== '' &&
        pw !== '' &&
        nickname !== '' &&
        tel !== '' &&
        name !== '' && (
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
              onClick={() => signup()}
            >
              <Typography color="primary">회원가입</Typography>
            </Button>
          </Box>
        )}
    </ThemeProvider>
  );
}
