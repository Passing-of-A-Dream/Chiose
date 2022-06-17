import $axios from "../../api/axios";
const map = 'https://restapi.amap.com/'
const mapkey = ''

// 封装get方法
function get(url: string, params: any) {
  return $axios.get(map + url, {
    params: {
      key: mapkey,
      ...params
    }
  })
}
// 封装post方法
// function post(url: string, data: any) {
//   return $axios.post(map + url, data)
// }

export function getMap(params?: any) {
  return get('v3/ip', params)
}

export function getMapWeather(params?: any) {
  return get('v3/weather/weatherInfo', params)
}

export const getMapRound = (params?: any) => {
  return get('v5/place/around', params)
}