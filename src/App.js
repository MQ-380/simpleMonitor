import {useEffect, useState} from 'react';

import logo from './logo.svg';
import './App.css';
import model from './model.json';
import store from './stores.json';


function App() {
  let [ storesList, setStoresList ] = useState({});
  let [ avalible, setAvalible ] = useState({});
  let [ modelMap ] = useState(model.products.map((e) => (
    {partNumber: e.partNumber, description: e.description})
  ))
  let [ storeMap ] = useState(store.stores.map((e) => (
    {storeNumber: e.storeNumber, store:`${e.city}-${e.storeName}` }
  )));
  let [times, setTimes] = useState(0);
  let [storesAva, setStoresAva] = useState([]);
  let [newYes, setNewYes] = useState([]);

  useEffect(() => {
    Notification.requestPermission()
    .then((premission) => {
      new window.Notification('test');

      console.log(premission);
    })
  }, []);

  useEffect(() => {
    setInterval(() => {
        fetch('https://reserve-prime.apple.com/CN/zh_CN/reserve/G/availability.json')
        .then((res)=> res.json().then((data) =>{
          let stores = data && data.stores;
          setTimes(c => c+1);
          setStoresAva(stores);
        }));
    }, 2000)
  }, []);


  function getAllItems (storeNumber, store) {
    if(!storesAva)  return;
    let nowStoreA = storesAva[storeNumber];
    if(!nowStoreA) return;
    let yes = [];
    let a = modelMap.map(item => {
      if(nowStoreA[item.partNumber].availability.unlocked) {
        new Notification('test');
      }
      return(
        <div className='ava'>
          <div className='model_name' style={
           { color: nowStoreA[item.partNumber].availability.unlocked || nowStoreA[item.partNumber].availability.contract  ? 'green' : 'red'}
          }>{item.description.slice(18)}</div>
        </div>
      )
    });
    //setNewYes(yes);
    return a;
  }

  return (
    <div className="App">
      <div className='main'>
      {
        storeMap.map((e) => {
          return (
            <div className='store_a'>
              <div className='store_name'>
                {e.store}
              </div>
              <div className='avali'>
                {getAllItems(e.storeNumber, e.store)}
              </div>
            </div>
          );
        })
      }
      </div>
      <div className='times'>{times}</div>
    </div>
  );
}

export default App;
