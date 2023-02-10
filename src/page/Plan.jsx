import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import { useInView } from 'react-intersection-observer';
export default function Plan(props) {
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

  const planId = useParams().planId; // 주소에서 planId 가져옴

  const [result, setResult] = useState(null); // 결과를 담을 state

  const [msg, setMsg] = useState(''); // 신청 메시지를 담을 state

  const [page, setPage] = useState(0); // 댓글 페이지
  const [ref, inView] = useInView(); // 무한스크롤 관리
  const [loading, setLoading] = useState(true); // 로딩관리

  const [comment, setComment] = useState([]); // 댓글
  const [recomment, setRecomment] = useState([]); // 답글

  const [commentMsg, setCommentMsg] = useState(''); // 작성할 댓글
  const [recommentMsg, setRecommentMsg] = useState('');

  const [toggle, setToggle] = useState([]); // 답글 작성용 토글
  const [isMy, setIsMy] = useState(0); // 0: 내글아님 1: 내글임

  // planId로 글 내용 가져오기
  const getResult = async () => {
    const response = await axios.get(
      `http://localhost:8080/non-member/view?planId=${planId}`
    );
    setResult(response.data);
  };

  // planId로 댓글 가져오기
  const getComment = async (inputPage) => {
    await setLoading(true);
    const response = await axios.post(
      `http://localhost:8080/non-member/list-comment?planId=${planId}&page=${inputPage}`
    );
    if (inputPage === 0) {
      await setComment(response.data);
    } else {
      await setComment([...setComment, ...response.data]);
    }
    let tempArr = [];
    for (let i = 0; i < comment.length; i++) {
      tempArr.push(null);
    }
    await setRecomment(tempArr);
    await setToggle(tempArr);
    if (response.data.length < 10) {
      // 넘어온 결과물의 갯수가 10보다 작으면 더이상 로드 안하도록
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  // 해당 위치의 답글 가져오기
  const getRecomment = async (id, index) => {
    const response = await axios.post(
      `http://localhost:8080/non-member/list-recomment?&page=0`,
      { planId: planId, groupNum: id, planCommentId: id }
    );
    let tempArr = Array.from(recomment);
    tempArr[index] = response.data;
    setRecomment(tempArr);
    console.log(`recomment의 길이는 ${tempArr[index].length}`);
  };

  useEffect(() => {
    getResult();
    getComment(0);
    checkMy();
  }, []);

  // 내가 쓴 글인지 확인하기
  const checkMy = async () => {
    if (
      localStorage.getItem('ACCESS_TOKEN') !== null &&
      localStorage.getItem('ACCESS_TOKEN') !== undefined
    ) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.get(
        `http://localhost:8080/plan/isMyPlan?planId=${planId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setIsMy(response.data);
    }
  };

  // 해당 위치의 답글 닫기
  const initRecomment = async (id, index) => {
    let tempArr = Array.from(recomment);
    tempArr[index] = null;
    setRecomment(tempArr);
  };

  // 답글달기 눌렀을때
  const trueToggle = (index) => {
    let tempArr = Array.from(toggle);
    tempArr[index] = true;
    setToggle(tempArr);
  };
  // 답글달기 취소
  const falseToggle = (index) => {
    let tempArr = Array.from(toggle);
    tempArr[index] = false;
    setToggle(tempArr);
  };

  // 댓글 작성하기
  const addComment = async () => {
    // id: planId
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      // 보낼 객체
      const req = {
        planId: planId,
        content: commentMsg,
      };
      const response = await axios.post(
        `http://localhost:8080/plan/comment/add-comment?planId=${planId}`,
        req,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      getComment(0);
    } else {
      history.push('/login');
    }
  };

  // 대댓글 작성하기
  const addRecomment = async (id, index) => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const req = {
        planId: planId,
        groupNum: id,
        content: recommentMsg,
        planCommentId: id,
      };
      const response = await axios.post(
        `http://localhost:8080/plan/comment/add-recomment`,
        req,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      getRecomment(id, index);
    } else {
      history.push('/login');
    }
  };

  // 여행참가신청
  const applyPlan = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');

      const req = {
        planId: planId,
        content: msg,
      };
      console.log(req);
      const response = await axios
        .post(`http://localhost:8080/apply-plan/apply`, req, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => alert('신청완료'))
        .catch((error) => noPlan());
      getResult(); // 페이지 내용 다시 불러오기
    } else {
      history.push('/login');
    }
  };

  // 여행참가신청 취소
  const noPlan = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');

      const req = {
        planId: planId,
        content: msg,
      };
      console.log(req);
      const response = await axios
        .post(`http://localhost:8080/apply-plan/cancel`, req, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => alert('신청을 취소했어요'))
        .catch((err) => {
          alert('먼저 리뷰를 작성해 주세요');
        });
      getResult(); // 페이지 내용 다시 불러오기
    } else {
      history.push('/login');
    }
  };

  // 무한스크롤
  useEffect(() => {
    console.log('inView의 useEffect예요');
    // 페이지를 하나 더한 후 api 호출
    if (loading === false && inView === true) {
      // inView가 true로 변한 경우에만
      // 로딩중이 아닐 떄만
      const newPage = parseInt(page) + 1;
      getComment(newPage);
      setPage(newPage);
    }
  }, [inView]);

  // 글 삭제
  const delPlan = async () => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios
        .post(
          `http://localhost:8080/plan/delete`,
          {
            planId: planId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => history.goBack())
        .catch((error) => window.alert('내 댓글이 아닙니다'));
    } else {
      history.push('/login');
    }
  };

  // 댓글삭제
  const delComment = async (id) => {
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios
        .post(
          `http://localhost:8080/plan/comment/delete`,
          {
            planCommentId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => getComment(0));
    } else {
      history.push('/login');
    }
  };

  // comment 출력
  const renderComment = () => {
    let result = [];
    for (let i = 0; i < comment.length; i++) {
      result.push(
        <Grid xs="12" container sx={{ mt: 3 }}>
          <Grid
            xs="12"
            container
            sx={{ borderRadius: 3, color: 'grey', border: 1, p: 2 }}
          >
            <Grid xs="12">
              <Typography sx={{ color: 'black' }}>
                <b>{comment[i].nickname}</b>{' '}
                {comment[i].commentDate.split('T')[0]}
              </Typography>
              <Typography
                sx={{ color: 'grey' }}
                onClick={() => delComment(comment[i].planCommentId)}
              >
                <u>삭제</u>
              </Typography>
            </Grid>
            <Grid xs="12" sx={{ color: 'black' }}>
              <Typography>{comment[i].content}</Typography>
            </Grid>
            <Grid xs="3">
              {recomment[i] === null && (
                <Typography
                  sx={{ color: 'grey' }}
                  onClick={() => getRecomment(comment[i].planCommentId, i)}
                >
                  <u>답글열기</u>
                </Typography>
              )}
              {recomment[i] !== null && (
                <Typography
                  sx={{ color: 'grey' }}
                  onClick={() => {
                    console.log(recomment[i]);
                    initRecomment(comment[i].planCommentId, i);
                  }}
                >
                  <u>답글닫기</u>
                </Typography>
              )}
            </Grid>
            <Grid xs="9" justifyContent="left">
              {toggle[i] === true ? (
                <Typography onClick={() => falseToggle(i)}>
                  <u>답글취소</u>
                </Typography>
              ) : (
                <Typography onClick={() => trueToggle(i)}>
                  <u>답글달기</u>
                </Typography>
              )}
            </Grid>
            {toggle[i] === true && (
              <Grid xs="12">
                <Grid xs="12" sx={{ mt: 3 }}>
                  <TextField
                    rows={3}
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={recommentMsg}
                    onChange={(e) => setRecommentMsg(e.target.value)}
                  />
                </Grid>
                <Grid xs="9"></Grid>
                <Grid xs="3" sx={{ mt: 1 }}>
                  <Button
                    size="small"
                    fullWidth
                    sx={{ backgroundColor: '#1E90FF' }}
                    onClick={() => addRecomment(comment[i].planCommentId, i)}
                  >
                    <Typography>댓글작성</Typography>
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
          {recomment[i] !== null &&
            recomment[i] !== undefined &&
            recomment[i].length > 0 &&
            recomment[i].map((item) => {
              return (
                <Grid xs="12" container sx={{ mt: 1 }}>
                  <Grid xs="2"></Grid>
                  <Grid xs="10" container>
                    <Grid
                      xs="12"
                      sx={{
                        borderRadius: 3,
                        color: '#1E90FF',
                        border: 1,
                        px: 2,
                        py: 2,
                      }}
                    >
                      <Typography fontWeight="bold" sx={{ color: 'black' }}>
                        {item.nickname}
                      </Typography>
                      <Typography
                        sx={{ color: 'grey' }}
                        onClick={() => delComment(item.planCommentId)}
                      >
                        <u>삭제</u>
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>
                        {item.commentDate.split('T')[0]}
                      </Typography>
                      <Typography sx={{ color: 'black' }}>
                        {item.content}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      );
    }
    return result;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ px: 3, mt: 13, mb: 10 }}>
        {result !== null && (
          <Grid xs="12" container>
            <Grid xs="12" sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {result.title}
              </Typography>
            </Grid>
            <Grid xs="12" sx={{ mb: 3 }}>
              <Typography fontWeight="bold" sx={{ color: 'grey' }}>
                작성일 : {result.postDate}
              </Typography>
              <Typography
                fontWeight="bold"
                sx={{ color: 'grey' }}
                onClick={() => history.push(`/member/${result.memberId}`)}
              >
                작성자 : {result.nickname}
              </Typography>
              {isMy !== 0 && (
                <Typography sx={{ color: 'grey' }} onClick={() => delPlan()}>
                  <u>삭제</u>
                </Typography>
              )}
            </Grid>
            <Grid xs="9" sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="secondary">
                여행설명
              </Typography>
            </Grid>
            <Grid
              xs="3"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {isMy !== 0 && (
                <Typography
                  sx={{ color: 'grey' }}
                  onClick={() => history.push(`/editPlan/${planId}`)}
                >
                  <u>수정</u>
                </Typography>
              )}
            </Grid>
            <Grid
              xs="12"
              sx={{
                borderRadius: 1,
                color: 'grey',
                border: 1,
                px: 2,
                py: 2,
              }}
            >
              <Typography>{result.notice}</Typography>
            </Grid>
            {result.planDetailDTOList.length !== undefined &&
              result.planDetailDTOList.length !== null &&
              result.planDetailDTOList.length > 0 &&
              result.planDetailDTOList.map((item) => {
                return (
                  <Grid
                    xs="12"
                    container
                    sx={{ mt: 3 }}
                    key={item.planDetailId}
                  >
                    <Grid xs="9">
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="secondary"
                      >
                        {item.detailDate}
                      </Typography>
                    </Grid>
                    <Grid
                      xs="3"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {isMy !== 0 && (
                        <Typography
                          sx={{ color: 'grey' }}
                          onClick={() =>
                            history.push(`/editPlanDetail/${item.planDetailId}`)
                          }
                        >
                          <u>수정</u>
                        </Typography>
                      )}
                    </Grid>
                    <Grid xs="12">
                      <img src={item.detailImg} style={{ width: '100%' }} />
                    </Grid>
                    <Grid
                      xs="12"
                      sx={{
                        borderRadius: 1,
                        color: 'grey',
                        border: 1,
                        px: 2,
                        py: 2,
                      }}
                    >
                      <Typography>{item.content}</Typography>
                    </Grid>
                  </Grid>
                );
              })}
            <Grid xs="9" sx={{ mt: 3 }}>
              <TextField
                variant="outlined"
                size="small"
                value={msg}
                fullWidth
                onChange={(e) => setMsg(e.target.value)}
              />
            </Grid>
            <Grid
              xs="3"
              direction="row"
              justifyContent="center"
              sx={{ display: 'flex', alignItems: 'center', mt: 3, pl: 1 }}
            >
              <Button
                size="small"
                fullWidth
                sx={{ backgroundColor: '#1E90FF' }}
                onClick={() => applyPlan()}
              >
                <Typography variant="h5" fontWeight="bold">
                  {result.participant} / {result.personnel}
                </Typography>
              </Button>
            </Grid>
            <Grid xs="12" sx={{ mt: 3, mb: 4 }}>
              <Divider />
            </Grid>
          </Grid>
        )}
        {renderComment()}
        <Grid xs="12" sx={{ mt: 3 }}>
          <TextField
            rows={3}
            fullWidth
            size="small"
            variant="outlined"
            value={commentMsg}
            onChange={(e) => setCommentMsg(e.target.value)}
          />
        </Grid>
        <Grid xs="9"></Grid>
        <Grid xs="3" sx={{ mt: 1 }}>
          <Button
            size="small"
            fullWidth
            sx={{ backgroundColor: '#1E90FF' }}
            onClick={() => addComment()}
          >
            <Typography>댓글작성</Typography>
          </Button>
        </Grid>
      </Grid>

      {result && !loading && !inView && <div ref={ref}>더보기</div>}
      <TopBar isLogin={props.isLogin} setLogin={props.setLogin} />
    </ThemeProvider>
  );
}
