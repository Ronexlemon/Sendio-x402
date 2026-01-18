import { ethers } from "ethers";


const getSigner = (private_Key:string)=>{

    return new ethers.Wallet(private_Key,new ethers.JsonRpcProvider("https://evm-t3.cronos.org"))

}


export {getSigner}