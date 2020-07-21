import React,{ useState, useEffect } from 'react';
import { ChainId, Token, WETH, Fetcher,Route,Percent,Trade,TokenAmount,TradeType } from '@uniswap/sdk';
import { useForm } from "react-hook-form";
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import { initOnboard} from './services';

let daiABI = [{"inputs":[{"internalType":"uint256","name":"chainId_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
let geodtABI = [{"inputs":[{"internalType":"address","name":"daiAddress","type":"address"},{"internalType":"address","name":"WETHAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ROUTER","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dai","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"uint256","name":"daiA","type":"uint256"},{"internalType":"uint256","name":"mEth","type":"uint256"},{"internalType":"uint256","name":"deadl","type":"uint256"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"name":"getEth","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"path","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

let domainData = {
  name : "GEODT",
  version : "1",
  chainId : 42,
  verifyingContract : "0x1d09e77f28be230b8500c00c3784b9ec3f698f93"
};

let daiDomainData = {
  name : "Dai Stablecoin",
  version : "1",
  chainId : 42,
  verifyingContract : "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
};

const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" }
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "daiAmount" , type: "uint"},
  { name: "minEth" , type : "uint"},
  { name: "deadline" , type : "uint"}
];

const permitType = [
  { name: "holder", type: "address" },
  { name: "spender", type: "address" },
  { name: "nonce", type: "uint256" },
  { name: "expiry", type: "uint256" },
  { name: "allowed", type: "bool" }
];

const daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
const geodtAddress = "0x1d09e77f28be230b8500c00c3784b9ec3f698f93";
const biconomyX = "2Nv0Ya2DL.9eb4fe6d-4a00-4776-b5e2-73ef4ca1cb87";
const daiBiconomyID = "91d3f863-ced4-4c28-a2b9-5d30a17a4807";
const geodtBiconomyID = "9f516f5c-9355-43e2-a6c1-9796a33e2354";

let provider;

function App() {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);
  const [wallet, setWallet] = useState({});
  const [onboard, setOnboard] = useState(null);
  const [permitted,setPermitted] = useState(null);
  const { register, handleSubmit, watch, errors,reset } = useForm();

  useEffect(() => {
    const onboard = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setBalance,
      wallet: function(wallet) {
        if (wallet.provider) {
          setWallet(wallet);

          window.localStorage.setItem('selectedWallet', wallet.name)
        } else {
          provider = null
          setWallet({})
        }
      }
    })
    setOnboard(onboard)
  }, []);

  async function getEth(values){
    const amountToSwapRaw = values.daiAmount;
    const amountToSwapWei = ethers.utils.parseEther(amountToSwapRaw).toString();
    const DAI = new Token(42,daiAddress,18);
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);
    const route = new Route([pair], DAI);
    const trade = new Trade(route, new TokenAmount(DAI, amountToSwapWei), TradeType.EXACT_INPUT);
    const slippageTolerance = new Percent('50', '10000'); // 50 bips, or 0.50%
    const amountOutMin = ethers.utils.parseEther(trade.minimumAmountOut(slippageTolerance).toExact()).toString();
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const ethersProvider = new ethers.providers.Web3Provider(
      wallet.provider
    );
    const geodtContract = new ethers.Contract(geodtAddress,geodtABI,ethersProvider);
    const nonce = await geodtContract.nonces(address);
    const dataToSign = {
      types: {
          EIP712Domain: domainType,
          MetaTransaction: metaTransactionType
        },
        domain: domainData,
        primaryType: "MetaTransaction",
        message: {
          nonce: nonce.toString(),
          from: address,
          daiAmount: amountToSwapWei,
          minEth: amountOutMin,
          deadline: deadline
        }
      };
      try{
        const result = await ethersProvider.send("eth_signTypedData_v4",[address,JSON.stringify(dataToSign)]);
        console.log("success",result);
        const signature = result.substring(2);
        const r = "0x" + signature.substring(0, 64);
        const s = "0x" + signature.substring(64, 128);
        const v = parseInt(signature.substring(128, 130), 16);
        console.log("v r s",v," ",r," ",s);
        const metaTxBody = {to:geodtAddress,apiId:geodtBiconomyID,params:[address,amountToSwapWei,amountOutMin,deadline,r,s,v],
        from:address};
        const biconomy = await fetch("https://api.biconomy.io/api/v2/meta-tx/native",
        {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': biconomyX
          },
          body:JSON.stringify(metaTxBody)
        });
        if(biconomy.ok){
          const responseJson = await biconomy.json();
          const txHash = responseJson.txHash;
          alert("Swap Successful, Transaction Hash : ",txHash);
        }
        else{
          const responseJson = await biconomy.json();
          console.log("error",responseJson);
        }
      }
      catch(error){
        console.log(error)
      }
  };

  async function login(){
    try{
      await onboard.walletSelect();
      await onboard.walletCheck();
    }
    catch(error){
      console.log("lmao bruh :",error)
    }
  };

  function onSubmit(values){
    console.log(values)
  };

  async function permit(){
    const ethersProvider = new ethers.providers.Web3Provider(
      wallet.provider
    );
    const daiContract = new ethers.Contract(daiAddress,daiABI,ethersProvider);
    const allowance = await daiContract.allowance(address,geodtAddress);
    console.log("allowance :",allowance);
    if (allowance!=0){
      setPermitted(true)
    }
    else{
      const nonce = await daiContract.nonces(address);
      const permitDataToSign = {
        types: {
            EIP712Domain: domainType,
            Permit: permitType
          },
          domain: daiDomainData,
          primaryType: "Permit",
          message: {
            holder :address,
            spender : geodtAddress,
            nonce: nonce.toString(),
            expiry: "1000000000000000000000000000",
            allowed: true
          }
        };
      try{
        const result = await ethersProvider.send("eth_signTypedData_v4",[address,JSON.stringify(permitDataToSign)]);
        console.log("success",result);
        const signature = result.substring(2);
        const r = "0x" + signature.substring(0, 64);
        const s = "0x" + signature.substring(64, 128);
        const v = parseInt(signature.substring(128, 130), 16);
        console.log("v r s",v," ",r," ",s);
        const metaTxBody = {to:daiAddress,apiId:daiBiconomyID,params:[address,geodtAddress,nonce.toString(),"1000000000000000000000000000",true,v,r,s],
      from:address};
        const biconomy = await fetch("https://api.biconomy.io/api/v2/meta-tx/native",
        {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': biconomyX
          },
          body:JSON.stringify(metaTxBody)
        });
        if(biconomy.ok){
          setPermitted(true);
        }
      }
      catch(error){
        console.log(error)
      }
    }
  }

  if(!wallet.provider){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Get ETH or DAI Trying!</h1>
          <a
            onClick={()=>login()}
            className="App-link-big"
          >
            Login
          </a>
        </header>
      </div>
    );
  }

  if(!permitted){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Get ETH or DAI Trying!</h1>
          <a
            className="App-link"
            onClick={()=>permit()}
          >
            Permit us to handle your DAI
          </a>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Get ETH or DAI Trying!</h1>
        <p>
          Enter how many DAI you wanna convert into ETH!
        </p>
        <form onSubmit={handleSubmit(getEth)}>
        <input type="number" placeholder="daiAmount" name="daiAmount" ref={register} />
        <input type="submit" />
        </form>
      </header>
    </div>
  );

}

export default App;
