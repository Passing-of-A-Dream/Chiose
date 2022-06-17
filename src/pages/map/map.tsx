import { Spin } from 'antd'
import React, { useEffect } from 'react'
import { getMapRound } from '../api/map'
// import $axios from '../../api/axios'
import './map.scss'

type Props = {
  food?: string
  loading?: boolean
}
interface address {
  [key: string]: any
}

export default function Map(props: Props) {
  const [data, setData] = React.useState<address>([])
  const food = props.food || '美食'
  useEffect(() => {
    // if (food) {
    getAround(food)
    return () => {
      setData([])
    }
    // }
  }, [food])
  const getAround = (food: string) => {
    let localtion = JSON.parse(localStorage.getItem('city') as string).rectangle
    getMapRound({
        location: localtion.split(';')[0] || '31.230416,121.473701',
        keywords: food,
      }).then(res => {
      setData(res.data.pois)
    })
  }
  // 查询中
  const loadingState = props.loading || false
  return (
    <div className="map">
      <p className='map-title-tip'>附近最快可以吃到<span>{food ? food : '美食'}</span>的地方</p>
      <div className="scroll" style={{
        display: loadingState === false ? 'block' : 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {
          loadingState===true ? <Spin tip="正在查询" size='large' /> : data.map((item:any, index:any) => {
            return (
              <div className='shop' key={index}>
                <span>店名：{item.name}</span>
                <span>地址：{item.address ? item.address : '获取地址失败'}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}