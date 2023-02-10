import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Container,
  createTheme,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Input,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TopBar from '../component/TopBar';
import { SIGUN } from '../Sigungu';
import SearchIcon from '@mui/icons-material/Search';
import BackBar from '../component/BackBar';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import styles from '../css/CreateStore.module.css';
import axios from 'axios';
import { calendarOrClockPickerClasses } from '@mui/x-date-pickers/internals/components/CalendarOrClockPicker/calendarOrClockPickerClasses';

export default function CreateTour3(props) {
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
  const [msg, setMsg] = useState('글쓰기(3/3)'); // 상단바에 띄울 메시지
  const [detailMsg, setDetailMsg] = useState([]); // 날짜별 설명 임시저장

  const goBack = () => {
    props.setStep(1);
  };

  // 파일이 변경될 때 file state에 파일 저장
  const handleNoticeFile = (event) => {
    props.setNoticeFile(event.target.files);
  };

  // 날짜별 detail render
  const renderDetail = (item) => {
    let result = [];
    for (let i = 0; i < item.length; i++) {
      let tempArr = Array.from(item); // 깊은복사
      result.push(
        <Grid xs="12" container key={i}>
          <Grid xs="12">
            <Typography variant="h6" fontWeight="bold" color="secondary">
              {item[i].date}
            </Typography>
          </Grid>
          <Grid xs="12" sx={{ mb: 1 }}>
            <TextField
              multiline
              rows={5}
              fullWidth
              onChange={(e) => {
                tempArr[i].notice = e.target.value;
                props.setDetail(tempArr);
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
                  tempArr[i].file = e.target.files;
                  props.setDetail(tempArr);
                }}
              />
            </Button>
          </Grid>
          <Grid xs="6" sx={{ display: 'flex', alignItems: 'center' }}>
            {item[i].file === null && <Typography>선택된 파일 없음</Typography>}
            {item[i].file !== null && (
              <div className={styles.image_box}>
                <img
                  src={URL.createObjectURL(item[i].file[0])}
                  alt="가게이미지"
                  loading="lazy"
                  className={styles.image_thumbnail}
                />
              </div>
            )}
          </Grid>
        </Grid>
      );
    }
    return result;
  };

  useEffect(() => {
    // 이전 단계에서 입력된 날짜를 기반으로 state setting
    props.initDetail();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ mt: 10, px: 3, mb: 10 }}>
        <Grid xs="12">
          <Typography variant="h6" fontWeight="bold" color="secondary">
            여행소개
          </Typography>
        </Grid>
        <Grid xs="12" sx={{ mb: 1 }}>
          <TextField
            multiline
            rows={5}
            fullWidth
            onChange={(e) => props.setNotice(e.target.value)}
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
            <input type="file" hidden onChange={handleNoticeFile} />
          </Button>
        </Grid>
        <Grid xs="6" sx={{ display: 'flex', alignItems: 'center' }}>
          {props.noticeFile === null && (
            <Typography>선택된 파일 없음</Typography>
          )}
          {props.noticeFile !== null && (
            <div className={styles.image_box}>
              <img
                src={URL.createObjectURL(props.noticeFile[0])}
                alt="가게이미지"
                loading="lazy"
                className={styles.image_thumbnail}
              />
            </div>
          )}
        </Grid>
        {/** 일별 설명 */}
        {renderDetail(props.detail)}
      </Grid>
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
          onClick={() => props.write()}
        >
          <Typography color="primary">작성완료</Typography>
        </Button>
      </Box>
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
