import React, { useEffect } from 'react'

let checkbox = {
  height: '20px',
  width: '20px'
}
export default function Select() {
  const items: string[] = ['name', 'age', 'sex']
  let [change, setChange] = React.useState<string[]>([])
  let [state, setState] = React.useState(false)
  useEffect(()=>{
    if (change.length === items.length) {
      setState(true)
    } else {
      setState(false)
    }
  }, [change.length, items.length])
  return (
    <div>
      <div>
        {
          items.map((_, i) => {
            return <div style={{
              fontSize: '40px'
            }} key={i}>
              <input type="checkbox" style={checkbox} checked={
                change.includes(items[i])
              } onChange={
                (e) => {
                  if (e.target.checked) {
                    setChange([...change, _])
                  }
                  else {
                    setChange(change.filter(item => item !== _))
                  }
                }
              } />
              <span>{_}</span>
            </div>
          })
        }
        <input type="checkbox" style={checkbox} checked={state} onChange={
          ()=>{
            setState(!state)
            if (state) {
              setChange([]);
            } else {
              setChange(items);
            }
          }
        } /><span style={{fontSize: '40px'}}>全选</span>
        <span>已选择{change.length}</span>
      </div>
    </div>
  )
}
