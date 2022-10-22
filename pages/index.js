import React, { useState, useEffect, useContext } from "react"
import { MdVerified } from 'react-icons/md'
import { RiSendPlaneFill, RiCloseFill } from 'react-icons/ri'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

//INTRNAL IMPORT
import { ToDoListContext } from '../context/ToDoListApp'
import Style from '../styles/index.module.css'
import Data from '../components/Data'

const Home = () => {
  const [message, setMessage] = useState('')

  const { checkIfWallerIsConnect,
    connectWallet,
    getToDoList,
    toDoList,
    change,
    currentAccount,
    error,
    allToDoList,
    myList,
    allAddress } = useContext(ToDoListContext)

  useEffect(() => {
    checkIfWallerIsConnect();
    getToDoList();
    console.log('allToDoList', allToDoList);
    console.log('myList', myList);
  }, [])

  const onChangeHandler = event => {
    setMessage(event.target.value);
  };;

  return (
    <div className={Style.home}>
      <div className={Style.navBar}>
        <AiOutlineLoading3Quarters />
        <div className={Style.connect}>
          {!currentAccount ? (
            <button onClick={() => { connectWallet() }}>Connect Wallet</button>
          ) : (
            <button>{currentAccount.slice(0, 20)}...</button>
          )
          }
        </div>
      </div>

      <div className={Style.home_box}>
        <div className={Style.home_completed}>
          <h2>ToDo History List</h2>
          <div>
            {myList.map((el, i) => (
              <div className={Style.home_completed_list}>
                <MdVerified className={Style.iconColor} />
                <p>{el.slice(0, 30)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={Style.home_create}>
          <div className={Style.home_create_box}>
            <h2>Create BlockChain ToDoList</h2>
            <div className={Style.home_create_input}>
              <input
                type="text"
                placeholder="Ether yout todo"
                onChange={onChangeHandler}
                value={message}
              />

              {
                currentAccount ? (
                  <RiSendPlaneFill className={Style.iconBlack} onClick={() => toDoList(message)} />
                ) : (
                  <RiSendPlaneFill className={Style.iconBlack} onClick={() => connectWallet()} />
                )
              }
            </div>
            <Data
              allToDoList={allToDoList}
              allAddress={allAddress}
              myList={myList}
              change={change}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 