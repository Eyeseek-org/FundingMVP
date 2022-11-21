import { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components';
import {useContractEvent, useContractWrite, usePrepareContractWrite} from 'wagmi'
import {ethers} from 'ethers'
import { TabRow, TooltipBox, IconBox } from "../start_project/SetRewards/StyleWrapper";
import donation from "../../abi/donation.json"
import InputContainer from "../../components/form/InputContainer";
import Tab from "../../components/form/Tab";
import Tooltip from "../../components/Tooltip";
import { InfoIcon } from "../../components/icons/Common";
import { Row, BetweenRow } from "../../components/format/Row";
import { useRouter } from 'next/router';
import {MainMilestoneContainer, MilestoneContainer,MainContainer,RewardContainer } from '../../components/form/InputWrappers'
import ErrText from "../../components/typography/ErrText";
import NftDisplay from "../../components/functional/NftDisplay";
import { moralisApiConfig } from '../../data/moralisApiConfig';
import Subtitle from '../../components/typography/Subtitle';
import RewardNftSubmit from './RewardNftSubmit';
import RewardTokenSubmit from './RewardTokenSubmit';
import { GetProjectFundingAddress } from '../../helpers/GetContractAddress';
import { SumRow, SumTitle } from '../start_project/Create/StyleWrapper';
import SuccessDisButton from '../../components/buttons/SuccessDisButton';
import Amount from '../../components/functional/Amount';
import { G, R } from '../../components/typography/ColoredTexts';
import ButtonAlt from '../../components/buttons/ButtonAlt';
import Socials from '../../components/buttons/Socials';

const Summary = styled.div`
    margin-top: 1%;
    padding-top: 1%;
    border-top: 1px solid #E5E5E5;
    display: flex;
    flex-direction: column;
    width: 50%;
    @media (max-width: 768px) {
        width: 100%;
    }
`

const RewardCreate = ({objectId, bookmarks, home, pid}) => {
    const pType = "Standard" // Until stream is implemented
    const [dType, setdType] = useState('Microfund')
    const [tokenType, setTokenType] = useState('Classic')
    const router = useRouter()
    const [tokenTooltip, setTokenTooltip] = useState(false)
    const [microTooltip, setMicroTooltip] = useState(false)
    const [nftTooltip, setNftTooltip] = useState(false)
    const [donationTooltip, setDonationTooltip] = useState(false)
    const [success, setSuccess] = useState(false)

    const [rewardTitle, setRewardTitle] = useState('')
    const [rewardDesc, setRewardDesc] = useState('')
    const [pledge, setPledge] = useState(0)
    const [cap, setCap] = useState(0)
    const [tokenName, setTokenName] = useState('')
    const [tokenAddress, setTokenAddress] = useState('')
    const [tokenAmount, setTokenAmount] = useState('')
    const [nftId, setNftId] = useState(0)
    const [rewardId, setRewardId] = useState(0)
    const [validAddress, setValidAddress] = useState(false)
 
    const [apiError, setApiError] = useState(false)

    const [add, setAdd] = useState(process.env.NEXT_PUBLIC_AD_DONATOR);

    useEffect (() => {
        setAdd(GetProjectFundingAddress(home))
    },[])

    useContractEvent({
        address: add,
        abi: donation.abi,
        eventName: 'RewardCreated',
        listener: (event) => listened(event),
        once: false
      })

    const listened = async(event) => {
        const parse = parseInt(event)
        await setRewardId(parse + 1)
        await handleSaveReward(objectId)
      }

    
      // Total, Reward AMount
    const { config } = usePrepareContractWrite({
        address: add,
        abi: donation.abi,
        chainId: home,
        functionName: 'createReward',
        args: [pid, cap, 1, "0x0000000000000000000000000000000000000000", 0],
      });

    
    const { write } = useContractWrite(config);
    

    const handleCreateReward = async (rType) => {
        console.log(success)
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_DAPP}/classes/Reward`, {
            "title": rewardTitle,
            "description": rewardDesc,
            "eligibleActual": Number(cap),
            "cap": Number(cap),
            "active": true,
            "type": dType,
            "project": objectId,
            "tokenName": tokenName,
            "tokenAddress": tokenAddress,
            "tokenAmount": Number(tokenAmount),
            "requiredPledge": Number(pledge),
            "nftId": Number(nftId),
            "rType": rType,
            "rewardId": rewardId
          }, moralisApiConfig)
        
          await setApiError(false)
          setSuccess(true)
          console.log(success)
        } catch (error) {
            setApiError(true)
        }
      }
    
    const handleSaveReward = async () => {
        if (tokenType === 'ERC20') {
            await handleCreateReward(1)
            await handleRewardNotifications('ERC20')
        } else if (tokenType === 'ERC1155') {
            await handleCreateReward(2)
            await handleRewardNotifications('ERC1155')
        } else if (tokenType === 'Classic') {
            await handleCreateReward(0)
            await handleRewardNotifications('Classic')
        }
    }

    const handleChangeTokenType = async(c) => {
        await setTokenType(c);
        //Clear specific form rows
        if (c === 'Classic'){
            setTokenName('')
            setTokenAddress('')
            setTokenAmount(0)
            setNftId(0)
        } else if (c === 'ERC1155'){
        } else if (c === 'ERC20'){
            setNftId(0)
        }
    }

    const handleRewardNotifications = async (token) => {
        if (bookmarks) {
          bookmarks.forEach(async (bookmark) => {
            await axios.post(`${process.env.NEXT_PUBLIC_DAPP}/classes/Notification`, {
              'title': `${token} Reward added`,
              'description': `Project added ${token} reward incentivization.`,
              'type': 'rewardAdded',
              'project': `${objectId}`,
              'user': bookmark
            }, moralisApiConfig)
          })
        }
      }


    const handleAddressChange = async (e) => {
        const add = ethers.utils.isAddress(e.target.value) 
        if (add) {
            await setTokenAddress(e.target.value)
            setValidAddress(true)
        } else {
            setValidAddress(false)
        }
        
    }

    return <MainContainer>
        <RewardContainer>
         <Subtitle text='Create new Reward' />
            <MainMilestoneContainer>
                <BetweenRow>
                    <Subtitle text={<>
                        {tokenType === 'Classic' && <>Classic crowdfunding reward</>}
                        {tokenType === 'ERC20' && <>Fungible token reward</>}
                        {tokenType === 'ERC1155' && <>ERC1155 NFT reward</>}
                    </>}/>
                    <TabRow><Tab active={tokenType} o1={'Classic'} o2={'ERC20'} o3={'ERC1155'} 
                        change1={() => { handleChangeTokenType('Classic') }} 
                        change2={() => {handleChangeTokenType('ERC20')}}  
                        change3={() => {handleChangeTokenType('ERC1155')}} />
                    </TabRow>
                </BetweenRow>
                <MilestoneContainer>
                    <TabRow> {pType === 'Standard' && <Tab active={dType} o1={'Microfund'} o2={'Donate'} change1={() => { setdType('Microfund') }} change2={() => { setdType('Donate') }} />}
                        <TooltipBox>
                            {microTooltip && <Tooltip text={'Microfund creators will get rewards for setting specific maximum cap, even though total amount does not have to be completely transferred to your project at the end. Higher number of microfunds positively impacts following donations.'} />}
                            {donationTooltip && <Tooltip text={'Fixed pledge given by direct donation. Standard Kickstarter-like backing experience with no extra magic around. With reward for direct donation backer knows for certain, how much value will be spend at the end for this reward.'} />}
                            {nftTooltip && <Tooltip text={'TBD Nft tooltip'}/>}
                            {tokenTooltip &&  <Tooltip text={'Tooltip TBD'} />}
                        </TooltipBox>
                    </TabRow>
                    <InputContainer
                        label={'Title'}
                        placeholder={'Godspeed'}
                        description={'Create a unique title for your reward'}
                        onChange={(e) => setRewardTitle(e.target.value)}
                        type={'text'}
                    />
                    <InputContainer
                        label={'Description'}
                        placeholder={'Backer receives autographed copy of the book'}
                        description={'Describe briefly what backer receives for this reward'}
                        onChange={(e) => setRewardDesc(e.target.value)}
                        type={'textArea'}
                    />
                    {dType === 'Microfund' && <InputContainer
                        label={'Pledge'}
                        placeholder={'1000'}
                        onChange={(e) => setPledge(e.target.value)}
                        description={
                            <Row>Required amount of backer's microfund
                                <IconBox onMouseEnter={() => setMicroTooltip(true)} onMouseLeave={() => setMicroTooltip(false)}>
                                    <InfoIcon width={15} />
                                </IconBox>
                            </Row>}
                        type={'number'}
                    />}
                    {dType === 'Donate' && <InputContainer
                        label={'Pledge'}
                        placeholder={'1000'}
                        onChange={(e) => setPledge(e.target.value)}
                        description={
                            <Row>Required amount of donation
                                <IconBox onMouseEnter={() => setDonationTooltip(true)} onMouseLeave={() => setDonationTooltip(false)}>
                                    <InfoIcon width={15} />
                                </IconBox>
                            </Row>}
                        type={'number'}
                    />}
                   {tokenType !== 'Classic' &&   <InputContainer
                        label={'Token name'}
                        placeholder={'EYE'}
                        description={'Symbol/Name of the reward token you will offer to backers'}
                        onChange={(e) => setTokenName(e.target.value)}
                        type={'text'}
                    />}
                   {tokenType !== 'Classic'  && <InputContainer
                        label={'Token address'}
                        placeholder={process.env.NEXT_PUBLIC_AD_TOKEN}
                        onChange={(e) => handleAddressChange(e)}
                        description={<Row>Contract address of the locked token - 
                            {!validAddress && tokenType !== 'Classic' ? <R>Token address is not valid</R> : <G>Token address is valid</G>}
                        </Row>}
                        type={'text'}
                    />}
                    <InputContainer
                        label={'Capacity'}
                        placeholder={'10'}
                        description={'Number of claimable rewards'}
                        onChange={(e) => setCap(e.target.value)}
                        type={'number'}
                    />
                    {tokenType === 'ERC20' && <InputContainer
                        label={'Amount/Backer'}
                        placeholder={'1000000'}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        description={<>        
                        <IconBox onMouseEnter={() => setTokenTooltip(true)} onMouseLeave={() => setTokenTooltip(false)}>
                        Amount of tokens eligible for reward for each backer <InfoIcon width={15} />
                        </IconBox></>}
                        type={'number'}
                    />}
                    {tokenType === 'ERC1155' && <InputContainer
                        label={'Token ID'}
                        placeholder={'1561891981'}
                        onChange={(e) => setNftId(e.target.value)}
                        description={<>ERC1155 token id defining the asset</>}
                        type={'number'}
                    />}
                    <Summary>
                        {dType === 'Donate' && <SumRow><SumTitle>You will receive if fully claimed =  <b>$<Amount value={Number(cap)*Number(pledge)}/></b></SumTitle></SumRow>}
                        {dType === 'Microfund' && <SumRow><SumTitle>Microfund impact on final collected amount is never same</SumTitle></SumRow>}
                        {tokenType === 'ERC20' && <SumRow><SumTitle>Number of ERC20 you have to lock = <b>$<Amount value={Number(cap)*Number(tokenAmount)}/></b></SumTitle></SumRow>}
                    </Summary>
                {cap > 0 ?  <> 
                    {tokenType === 'ERC1155' && <RewardNftSubmit home={home} pid={pid} cap={cap} tokenAddress={tokenAddress} nftId={nftId} add={add} pledge={pledge}/>}
                    {tokenType === 'ERC20' && <RewardTokenSubmit home={home} pid={pid} cap={cap} tokenAddress={tokenAddress} add={add} pledge={pledge} tokenAmount={tokenAmount}/>}
                    {apiError && <ErrText text='Not all fields filled correctly'/>}

                    {tokenType === 'Classic' &&
                        <>
                            {!success && !apiError && <ButtonAlt onClick={()=>{write?.()}} text='Create reward'/> } 
                            {success && !apiError &&    <>     
                                    <G>Great job!! Now expose yourself and share it {`:)`}</G>
                                    <Socials title={'I have added some juice rewards for participation in this crowdfunding project, check it out!!!'}/>
                                    <SuccessDisButton onClick={()=>{setSuccess(false)}} width={'100%'} text="Success: Reward was created (click for new reward)"/>
                                </>}
                            {apiError && <ButtonAlt onClick={()=>{write?.()}} text='Error: Check your fields and retry'/>}
                        </>}
                    </> : <ErrText text="All fields are mandatory"/>}
                </MilestoneContainer>
            </MainMilestoneContainer>
        </RewardContainer>
    </MainContainer>
}

export default RewardCreate
