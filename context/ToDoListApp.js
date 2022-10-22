import React, { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

// INTERNAL Import
import { toDoListAddress, toDoListABI } from './constants'

const fetchContract = (signerOrProvider) => new ethers.Contract(toDoListAddress, toDoListABI, signerOrProvider);

export const ToDoListContext = React.createContext();
export const ToDoListProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [error, setError] = useState('');
    const [allToDoList, setAllToDoList] = useState([]);
    const [myList, setMyList] = useState([]);

    const [allAddress, setAllAddress] = useState([]);

    //----CONNECTING MetaMask
    const checkIfWallerIsConnect = async () => {
        if (!window.ethereum) return setError("Please install metamask");

        const account = await window.ethereum.request({ method: "eth_accounts" });

        if (account.length) {
            setCurrentAccount(account[0]);
            console.log(account[0]);
        } else {
            setError("Please Install MetaMask & connect, reload");
        }
    }

    //----CONNECT WALLET
    const connectWallet = async () => {
        if (!window.ethereum) return setError("Please install metamask");

        const account = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(account[0])
    }

    //----INTRACTING WITH SMART CONTRACT
    const toDoList = async (message) => {
        try {
            //Connecting with smart contract
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = await fetchContract(signer);

            const createList = await contract.createList(message);
            createList.wait();

            console.log(createList);
        } catch (error) {
            setError("Something wrong creating list")
        }
    }

    const getToDoList = async () => {
        try {
            //CONNECTING SMART CONTRACT
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = await fetchContract(signer);

            //GET DATA
            const getAllAddress = await contract.getAddress();
            setAllAddress(getAllAddress);
            console.log('getAllAddress', getAllAddress);

            getAllAddress.map(async (el) => {
                const getSingleData = await contract.getCreatorData(el);
                allToDoList.push(getSingleData);
                console.log('getSingleData', getSingleData);
            });

            const allMessage = await contract.getMessage();
            console.log('allMessage', allMessage);
            setMyList(allMessage);
        } catch (error) {
            setError("Something wrong while getting the data");
        }
    };

    //Change State of ToDo list to false to true
    const change = async (address) => {
        try {
            //Connecting with smart contract
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = await fetchContract(signer);

            const state = await contract.toggle(address);
            state.wait();
            console.log(state);
        } catch (error) {
            setError("Something wrong changing status")
        }
    }

    return (
        <ToDoListContext.Provider
            value={{
                checkIfWallerIsConnect,
                connectWallet,
                getToDoList,
                toDoList,
                change,
                currentAccount,
                error,
                allToDoList,
                myList,
                allAddress
            }}
        >
            {children}
        </ToDoListContext.Provider>
    )
}

