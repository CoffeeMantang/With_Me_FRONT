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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const category = [
  '산',
  '바다',
  '호수',
  '계곡',
  '박물관',
  '전시관',
  '문화재',
  '맛집여행',
];

export default function CreateTour2(props) {
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
  const [msg, setMsg] = useState('글쓰기(2/4)'); // 상단바에 띄울 메시지
  const [isDate, setIsDate] = useState(false); // 날짜 검사용 state

  // 태그를 선택하면 발동될 함수
  const tagging = (event) => {
    // tag에 해당 내용이 있는지 체크하는 함수
    const isTagging = (element) => {
      if (element === event.target.value) {
        return true;
      }
    };
    // 체크된 경우
    if (event.target.checked === true) {
      // 해당 태그가 없으면 삽입
      if (props.category.find(isTagging) === undefined) {
        props.setCategory([...props.category, event.target.value]);
      }
    }
    // 체크해제된 경우 해당 요소를 제거
    if (event.target.checked === false) {
      let filtered = props.category.filter((e) => e !== event.target.value);
      props.setCategory(filtered);
    }
    console.log(props.category);
  };

  // 카테고리 출력
  const printCategory = () => {
    let result = [];
    for (let i = 0; i < category.length; i++) {
      result.push(
        <FormControlLabel
          label={category[i]}
          value={category[i]}
          control={<Checkbox size="small" />}
          onChange={(e) => tagging(e)}
        />
      );
    }
    return result;
  };

  useEffect(() => {
    props.setStep(1);
  }, []);

  const goBack = () => {
    props.setStep(0);
  };

  // 인원수 증가
  const plus = () => {
    if (props.people < 9) {
      props.setPeople(props.people + 1);
    }
  };

  // 인원수 감소
  const minus = () => {
    if (props.people > 1) {
      props.setPeople(props.people - 1);
    }
  };

  // 날짜체크
  const dateCheck = (e) => {
    //선택한 endDay가 startDay보다 같거나 이전이면 false
    console.log(
      `e.year = ${e.year()} , startDay.year = ${props.startDay.year()}`
    );
    if (e.year() < props.startDay.year()) {
      return false;
    }
    if (e.month() < props.startDay.month()) {
      return false;
    }
    if (e.day() < props.startDay.day()) {
      return false;
    }
    console.log('검사문제없음');
    return true;
  };

  // 올라간 날짜 체크
  const formDateCheck = (a, b) => {
    // a: endDay, b: startDay
    if (a.year() < b.year()) {
      return false;
    }
    if (a.month() < b.month()) {
      return false;
    }
    if (a.day() < b.day()) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    setIsDate(formDateCheck(props.endDay, props.startDay));
  }, [props.startDay, props.endDay]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ px: 3, mt: 10 }}>
        <Grid xs="12">
          <Typography variant="h6" fontWeight="bold" color="secondary">
            카테고리
          </Typography>
        </Grid>
        <Grid xs="12">{printCategory()}</Grid>
        <Grid xs="12" sx={{ mb: 1, mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="secondary">
            참가인원
          </Typography>
        </Grid>
        <Grid xs="12" container>
          <Grid
            xs="1"
            direction="row"
            justifyContent="center"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <RemoveCircleIcon color="secondary" onClick={() => minus()} />
          </Grid>
          <Grid xs="2">
            <TextField
              fullWidth
              disabled
              value={props.people}
              size="small"
            ></TextField>
          </Grid>
          <Grid
            xs="1"
            direction="row"
            justifyContent="center"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Button fullWidth>
              <AddCircleIcon color="secondary" onClick={() => plus()} />
            </Button>
          </Grid>
          <Grid xs="8"></Grid>
        </Grid>
        <Grid xs="12" sx={{ mb: 1, mt: 3 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="secondary"
            sx={{ mb: 1 }}
          >
            마감일
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="마감일"
              inputFormat="MM/DD/YYYY"
              value={props.deadline}
              onChange={(e) => {
                props.setDeadline(e);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid xs="12" sx={{ mb: 1, mt: 3 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="secondary"
            sx={{ mb: 1 }}
          >
            출발일
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="출발일"
              inputFormat="MM/DD/YYYY"
              value={props.startDay}
              onChange={(e) => {
                props.setStartDay(e);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid xs="12" sx={{ mb: 1, mt: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="secondary"
            sx={{ mb: 1 }}
          >
            종료일
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label="종료일"
              inputFormat="MM/DD/YYYY"
              value={props.endDay}
              onChange={(e) => {
                console.log(e);
                if (dateCheck(e)) {
                  props.setEndDay(e);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        {!isDate && <Typography>날짜가 맞지 않아요</Typography>}
      </Grid>
      {/** 모두 입력되면 다음으로 */}
      {props.people > 1 && formDateCheck(props.endDay, props.startDay) && (
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
            onClick={() => props.setStep(2)}
          >
            <Typography color="primary">다음으로</Typography>
          </Button>
        </Box>
      )}
      <BackBar msg={msg} func={goBack} />
    </ThemeProvider>
  );
}
