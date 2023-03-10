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

  const planId = useParams().planId; // ???????????? planId ?????????

  const [result, setResult] = useState(null); // ????????? ?????? state

  const [msg, setMsg] = useState(''); // ?????? ???????????? ?????? state

  const [page, setPage] = useState(0); // ?????? ?????????
  const [ref, inView] = useInView(); // ??????????????? ??????
  const [loading, setLoading] = useState(true); // ????????????

  const [comment, setComment] = useState([]); // ??????
  const [recomment, setRecomment] = useState([]); // ??????

  const [commentMsg, setCommentMsg] = useState(''); // ????????? ??????
  const [recommentMsg, setRecommentMsg] = useState('');

  const [toggle, setToggle] = useState([]); // ?????? ????????? ??????
  const [isMy, setIsMy] = useState(0); // 0: ???????????? 1: ?????????

  // planId??? ??? ?????? ????????????
  const getResult = async () => {
    const response = await axios.get(
      `http://localhost:8080/non-member/view?planId=${planId}`
    );
    setResult(response.data);
  };

  // planId??? ?????? ????????????
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
      // ????????? ???????????? ????????? 10?????? ????????? ????????? ?????? ????????????
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  // ?????? ????????? ?????? ????????????
  const getRecomment = async (id, index) => {
    const response = await axios.post(
      `http://localhost:8080/non-member/list-recomment?&page=0`,
      { planId: planId, groupNum: id, planCommentId: id }
    );
    let tempArr = Array.from(recomment);
    tempArr[index] = response.data;
    setRecomment(tempArr);
    console.log(`recomment??? ????????? ${tempArr[index].length}`);
  };

  useEffect(() => {
    getResult();
    getComment(0);
    checkMy();
  }, []);

  // ?????? ??? ????????? ????????????
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

  // ?????? ????????? ?????? ??????
  const initRecomment = async (id, index) => {
    let tempArr = Array.from(recomment);
    tempArr[index] = null;
    setRecomment(tempArr);
  };

  // ???????????? ????????????
  const trueToggle = (index) => {
    let tempArr = Array.from(toggle);
    tempArr[index] = true;
    setToggle(tempArr);
  };
  // ???????????? ??????
  const falseToggle = (index) => {
    let tempArr = Array.from(toggle);
    tempArr[index] = false;
    setToggle(tempArr);
  };

  // ?????? ????????????
  const addComment = async () => {
    // id: planId
    if (props.isLogin === true) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      // ?????? ??????
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

  // ????????? ????????????
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

  // ??????????????????
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
        .then((res) => alert('????????????'))
        .catch((error) => noPlan());
      getResult(); // ????????? ?????? ?????? ????????????
    } else {
      history.push('/login');
    }
  };

  // ?????????????????? ??????
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
        .then((res) => alert('????????? ???????????????'))
        .catch((err) => {
          alert('?????? ????????? ????????? ?????????');
        });
      getResult(); // ????????? ?????? ?????? ????????????
    } else {
      history.push('/login');
    }
  };

  // ???????????????
  useEffect(() => {
    console.log('inView??? useEffect??????');
    // ???????????? ?????? ?????? ??? api ??????
    if (loading === false && inView === true) {
      // inView??? true??? ?????? ????????????
      // ???????????? ?????? ??????
      const newPage = parseInt(page) + 1;
      getComment(newPage);
      setPage(newPage);
    }
  }, [inView]);

  // ??? ??????
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
        .catch((error) => window.alert('??? ????????? ????????????'));
    } else {
      history.push('/login');
    }
  };

  // ????????????
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

  // comment ??????
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
                <u>??????</u>
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
                  <u>????????????</u>
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
                  <u>????????????</u>
                </Typography>
              )}
            </Grid>
            <Grid xs="9" justifyContent="left">
              {toggle[i] === true ? (
                <Typography onClick={() => falseToggle(i)}>
                  <u>????????????</u>
                </Typography>
              ) : (
                <Typography onClick={() => trueToggle(i)}>
                  <u>????????????</u>
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
                    <Typography>????????????</Typography>
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
                        <u>??????</u>
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
                ????????? : {result.postDate}
              </Typography>
              <Typography
                fontWeight="bold"
                sx={{ color: 'grey' }}
                onClick={() => history.push(`/member/${result.memberId}`)}
              >
                ????????? : {result.nickname}
              </Typography>
              {isMy !== 0 && (
                <Typography sx={{ color: 'grey' }} onClick={() => delPlan()}>
                  <u>??????</u>
                </Typography>
              )}
            </Grid>
            <Grid xs="9" sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="secondary">
                ????????????
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
                  <u>??????</u>
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
                          <u>??????</u>
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
            <Typography>????????????</Typography>
          </Button>
        </Grid>
      </Grid>

      {result && !loading && !inView && <div ref={ref}>?????????</div>}
      <TopBar isLogin={props.isLogin} setLogin={props.setLogin} />
    </ThemeProvider>
  );
}
