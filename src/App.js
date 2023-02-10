import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Main from './page/Main';
import Search from './page/Search';
import Login from './page/Login';
import Join from './page/Join';
import CreateTour from './page/CreateTour';
import SearchResult from './page/SearchResult';
import Plan from './page/Plan';
import MyPage from './page/MyPage';
import TourLog from './page/TourLog';
import AddTourReview from './page/AddTourReview';
import AddMemberReview from './page/AddMemberReview';
import Apply from './page/Apply';
import Member from './page/Member';
import ReSearch from './page/ReSearch';
import ReSearchResult from './page/ReSearchResult';
import EditTour from './page/EditTour';
import EditDetail from './page/EditDetail';
import MyInfo from './page/MyInfo';

function App() {
  const [isLogin, setLogin] = useState(false); // 로그인 여부 체크용 state
  const [address, setAddress] = useState("로그인"); // 대표주소를 담을 state
  const [top, setTop] = useState(true); // 상단바
  const [bottom, setBottom] = useState(true); // 하단바
  const [bottomPage, setBottomPage] = useState(0);
  const history = useHistory();

  // access token 주고 토큰 갱신하기
  const updateToken = async () => {
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    const response = await axios
      .get(`http://localhost:8080/member/updateToken`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        localStorage.setItem('ACCESS_TOKEN', res.data.token); // 갱신된 토큰 저장
        setLogin(true);
        // 메인으로이동
        history.push('/main');
      })
      .catch((error) => {
        if (error.status === 403) {
          setLogin(false);
        }
      });
  };

  useEffect(() => {
    if (localStorage.getItem("ACCESS_TOKEN") !== null && localStorage.getItem("ACCESS_TOKEN") !== undefined) {
      updateToken();
    }
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/main" render={() => <Main isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/search" render={() => <Search isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/login" render={() => <Login isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/join" render={() => <Join isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/myPage" render={() => <MyPage isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/tourLog" render={() => <TourLog isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/apply" render={() => <Apply isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/member/:memberId" render={() => <Member isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/addTourReview/:planId" render={() => <AddTourReview isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/reSearch" render={() => <ReSearch isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/reSearchResult/:place/:category" render={() => <ReSearchResult isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/addMemberReview/:planId" render={() => <AddMemberReview isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/createTour" render={() => <CreateTour isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/editPlan/:planId" render={() => <EditTour isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/editPlanDetail/:planDetailId" render={() => <EditDetail isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/searchResult/:place" render={() => <SearchResult isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/plan/:planId" render={() => <Plan isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/editNotice/:planId" render={() => <EditTour isLogin={isLogin} setLogin={setLogin} />} />
        <Route path="/myInfo" render={() => <MyInfo isLogin={isLogin} setLogin={setLogin} />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
