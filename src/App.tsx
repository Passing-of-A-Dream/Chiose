import React, {useEffect} from 'react';
import './App.css';
import FoodChiose from './pages/FoodChiose/FoodChiose'
import 'antd/dist/antd.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
// import Index from './pages/FoodChiose/FoodChiose';
// import Map from './pages/map/map';

moment.locale('zh-cn');

function App() {
  // 检测用户是否切出页面
  useEffect(() => {
    window.addEventListener('visibilitychange', (e) => {
      if(document.visibilityState === 'hidden') {
        document.title = '你人捏？'
      } else {
        document.title = '今天吃啥呀'
      }
    })
  }, [])
  return (
    <div className="App">
      {/* <Index /> */}
      <FoodChiose />
      {/* <Map /> */}
    </div>
  );
}

export default App;