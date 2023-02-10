import React, { useEffect, useState } from 'react';
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
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CreateTour1 from './CreateTour1';
import CreateTour2 from './CreateTour2';
import dayjs from 'dayjs';
import CreateTour3 from './CreateTour3';
import axios from 'axios';

export default function CreateTour(props) {
  const [title, setTitle] = useState(''); // 제목
  const [place, setPlace] = useState(null); // 여행장소
  const [keyword, setKeyword] = useState(''); // 지역 검색 키워드

  const [category, setCategory] = useState([]); // 카테고리
  const [people, setPeople] = useState(1); // 모집인원
  const [startDay, setStartDay] = useState(dayjs(new Date())); // 출발일
  const [endDay, setEndDay] = useState(dayjs(new Date())); // 도착일
  const [deadline, setDeadline] = useState(dayjs(new Date())); // 모집 마감일

  const [notice, setNotice] = useState(''); // 여행 전체 설명
  const [noticeFile, setNoticeFile] = useState(null);
  const [detail, setDetail] = useState([]); // 여행 날짜별 설명 {detail:"", date:"YYYY:MM:DD", file:null} json

  const [step, setStep] = useState(0); // 0: 1단계, 1: 2단계 ...

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

  // 출발일과 종료일이 지정되면 날짜별 설명 추가하기 위한 배열 초기화 하는 함수
  const initDetail = () => {
    console.log('initDetail 발동');
    let sDay = dayjs(startDay.format());
    console.log(sDay.format());
    let tempArr = [];
    while (true) {
      if (sDay.diff(endDay, 'd', true) > 0.0) {
        // 두 날짜의 차이가 0이 되면 break;
        console.log('두 날짜 차이 찾음');
        break;
      }
      let temp = {
        detail: '',
        date: '',
        file: null,
      };
      temp.date = sDay.format('YYYY-MM-DD');
      tempArr.push(temp);
      sDay = dayjs(sDay.add(1, 'day'));
    }
    setDetail(tempArr);
    console.log(tempArr);
  };

  useEffect(() => {
    console.log(step);
  }, [step]);

  useEffect(() => {
    // 로그인체크
    if (props.isLogin === false) {
      history.push('/login');
    }
  }, []);

  // 모은 데이터 서버에 전송
  const write = async () => {
    console.log('여행만들기 api');
    const accessToken = localStorage.getItem('ACCESS_TOKEN');

    const fd = new FormData(); // 데이터들을 모을 곳
    // Object.values(noticeFile).forEach((file) => {
    //   fd.append('files', noticeFile); // notice의 file
    // });

    const planDetailDTOList = [];
    for (let i = 0; i < detail.length; i++) {
      const tempFd = new FormData();
      const planDetailDTO = {
        detailDate: detail[i].date,
        content: detail[i].notice,
        file: detail[i].file,
      };
      fd.append(`planDetailDTOList[${i}].detailDate`, detail[i].date);
      fd.append(`planDetailDTOList[${i}].content`, detail[i].notice);
      if (detail[i] !== undefined && detail[i] !== null) {
        Object.values(detail[i].file).forEach((file) => {
          fd.append(`planDetailDTOList[${i}].file`, file);
        });
      }
    }
    fd.append('personnel', people);
    fd.append('place', place.name);
    fd.append(
      'deadline',
      `${deadline.format('YYYY-MM-DD HH:mm:ss').toString()}`
    );
    fd.append(
      'startDate',
      `${startDay.format('YYYY-MM-DD HH:mm:ss').toString()}`
    );
    fd.append('endDate', `${endDay.format('YYYY-MM-DD HH:mm:ss').toString()}`);
    fd.append('notice', notice);
    let result = '';
    if (category.length > 0) {
      for (let i = 0; i < category.length; i++) {
        result += category[i];
      }
    }

    fd.append('theme', result);
    fd.append('title', title);

    const response = await axios.post(`http://localhost:8080/plan/add`, fd, {
      headers: {
        'Content-Type': `multipart/form-data; `,
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch((error) => {
      window.alert("리뷰를 작성해주세요")
    });

    // 메인화면으로 이동
    history.push('/main');
  };

  return (
    <>
      {step === 0 && (
        <CreateTour1
          title={title}
          setTitle={setTitle}
          place={place}
          setPlace={setPlace}
          setStep={setStep}
        />
      )}
      {step === 1 && (
        <CreateTour2
          setStep={setStep}
          category={category}
          setCategory={setCategory}
          people={people}
          setPeople={setPeople}
          startDay={startDay}
          setStartDay={setStartDay}
          endDay={endDay}
          setEndDay={setEndDay}
          deadline={deadline}
          setDeadline={setDeadline}
        />
      )}
      {step === 2 && (
        <CreateTour3
          setStep={setStep}
          notice={notice}
          detail={detail}
          setNotice={setNotice}
          setDetail={setDetail}
          initDetail={initDetail}
          noticeFile={noticeFile}
          setNoticeFile={setNoticeFile}
          write={write}
        />
      )}
    </>
  );
}
