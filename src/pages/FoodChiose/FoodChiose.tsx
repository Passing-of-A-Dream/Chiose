import React, { useEffect, useState } from 'react'
import './FoodChiose.scss'
import moment from 'moment';
import { Button, Input, message, Modal, Popconfirm, Switch } from 'antd';
import $axios from '../../api/axios';

const foodList1 = "馄饨 烩面 热干面 刀削面 油泼面 炸酱面 炒面 重庆小面 米线 酸辣粉 土豆粉 螺狮粉 凉皮儿 麻辣烫 肉夹馍 羊肉泡馍 炒饭 盖浇饭 烤肉饭 黄焖鸡米饭 麻辣香锅 火锅 酸菜鱼 烤串 披萨 烤鸭 汉堡 炸鸡 寿司 煎饼果子 南瓜粥 小龙虾 牛排 砂锅 大排档 馒头 西餐 自助餐 小笼包 水果 西北风 烧烤 泡面 水饺 日本料理 涮羊肉 肯德基 面包 臊子面 小笼包 麦当劳 沙县小吃 烤鱼 海鲜 铁板烧 韩国料理 甜点 鸭血粉丝汤"

type Props = {
}
type city = {
  [key: string]: string
}
export default function Index(props: Props) {
  const [date, setDate] = useState(moment().format('LTS'));
  const [food, setFood] = useState('开始选择食物吧!');
  const [foodList, setFoodList] = useState(['面包', '蛋糕', '西瓜', '苹果', '螺丝粉', '火锅']);
  const [buttonState, setButtonState] = useState(false);
  let [count, setCount] = useState(0);
  const [city, setCity] = useState<city>({});
  const [weather, setWeather] = useState<city>({});
  const RandomFood = async () => {
    if (!switchState) {
      message.error('还想自己选？你在想屁吃，自己把开关打开嗷!');
      return false
    }
    if (count >= 3) {
      setFood('这么挑？饿着吧你!');
      return false;
    }
    // setFoodState(true);
    setButtonState(true);
    const timer = setInterval(() => {
      setFood(foodList[Math.floor(Math.random() * foodList.length)])
    }, 100);
    setTimeout(() => {
      setButtonState(false);
      clearInterval(timer);
    }, 3000);
  }
  useEffect(() => {
    let timeId = setInterval(() => {
      setDate(moment().format('a h:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(timeId)
    }
  }, [])
  useEffect(() => {
    foodList1.split(' ').forEach(item => {
      if (foodList.indexOf(item) === -1) {
        foodList.push(item)
      }
    })
  }, [city, foodList]);
  useEffect(() => {
    getCity();
    let cityTime = localStorage.getItem('cityTime')
    // console.log(cityTime);
    let cityTime2 = moment().subtract(1, 'days').format('YYYY-MM-DD');
    // console.log(cityTime2);
    if (cityTime === cityTime2) {
      localStorage.removeItem('cityTime');
      localStorage.removeItem('city');
      localStorage.removeItem('weather');
      localStorage.removeItem('weatherTime');
      getCity();
    }
    // console.log(JSON.parse(localStorage.getItem('weather') as string));
  }, [])
  // 封装城市
  const getCity = async () => {
    if (localStorage.getItem('city') === null) {
      await $axios.get('https://restapi.amap.com/v3/ip', {
        params: {
          key: ''
        }
      }).then(res => {
        setCity(res.data)
        localStorage.setItem('city', JSON.stringify(res.data))
        localStorage.setItem('cityTime', moment().format('YYYY-MM-DD'))
        getWeather(res.data.adcode)
      })
    } else {
      setCity(JSON.parse(localStorage.getItem('city') as string))
      getWeather(JSON.parse(localStorage.getItem('city') as string).adcode)
    }
  }
  // 封装天气请求
  const getWeather = async (cityCode: string) => {
    if (localStorage.getItem('weather') === null) {
      await $axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
        params: {
          key: '',
          city: cityCode,
          extensions: 'base'
        }
      }).then(res => {
        setWeather(res.data.lives[0])
        localStorage.setItem('weather', JSON.stringify(res.data.lives[0]))
        localStorage.setItem('weatherTime', moment().format('YYYY-MM-DD'))
      })
    } else {
      setWeather(JSON.parse(localStorage.getItem('weather') as string))
    }
  }
  // 选择开关
  const [switchState, setSwitchState] = useState(true);
  const switchChange = (checked: boolean) => {
    setFood('开始选择食物吧!')
    setSwitchState(checked);
    setCount(0)
  }
  // 弹窗
  const [visible, setVisible] = useState(false);
  const handleCancel = () => {
    setVisible(false);
  }
  const { TextArea } = Input;
  const [text, setText] = useState('');
  const showModal = (): void => {
    setText('')
    setText(String(foodList).replace(/[,]/g, ' '));
  }
  const save = () => {
    // if (/.*[/u4e00-/u9fa5]+.*$/.test(text)) {
    //   message.error('没有中文？是我大中国的美食满足不了你吗？')
    // }
    if (text.length === 0) {
      message.error('一个吃的都没？你搁这儿修仙呢？')
      return false
    }
    setVisible(false);
    setFoodList(text.split(' '));
  }

  return (
    <>
      <div className="index">
        <img className='logo' src={require('../../static/image/logo.png')} alt="" />
        <div className='select'>
          <span className='time'>{date}</span>
          <div className="container">
            <span className='city'>{city.city}</span>
            <span className='weather'>{
              !weather ? '' : `${weather.weather} ${weather.temperature}°`
            }</span>
          </div>
          <div className='food'>{food}</div>
          <div className='select-children'>
            <Switch className='switch' checked={switchState}
              onChange={switchChange}
              checkedChildren="系统选择" unCheckedChildren="自己选择" />
            <Button type="primary" loading={buttonState} onClick={
              () => {
                RandomFood();
                setCount(count + 1);
              }
            }>开始选择</Button>
          </div>

          <div className='option'>
            <Popconfirm
              title="我去，这都拿不下你？"
              okText="重置"
              cancelText="取消"
              // placement='left'
              onConfirm={() => {
                setFood('开始选择食物吧!');
                setCount(0);
              }}>
              <Button ghost>重置</Button>
            </Popconfirm>
            <Button ghost onClick={
              () => {
                showModal()
                setVisible(true);
              }
            }>自定义食物</Button>
          </div>
        </div>
        <Modal
          title='输入你喜欢的食物'
          visible={visible}
          onCancel={handleCancel}
          onOk={save}
          cancelText='就这些吧'
          okText='差不多了嗷'>
          <span className='modal-tip'>--食物需用空格分开--</span>
          <TextArea
            showCount
            autoSize={{ minRows: 6, maxRows: 20 }}
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}></TextArea>
        </Modal>
      </div>
    </>
  )
}