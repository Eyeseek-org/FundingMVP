/*
import styled from 'styled-components'



const Container = styled.div`
  
   
    `

    const CopyButton = styled.button`
    background: #2F2F2F;
    border: 1px solid #2F2F2F;
    border-radius: 5px;
    padding: 5px;
    font-size: 0.8em;
    font-family: 'Neucha';
    color: white;
    `




   const Add = ({adress}) => {


     //Adress to be copied (from props)
    adress = "0xa0a39c5823A51184043655711C8157ef4826447a"

   // Adress to be displayed
    let adressFirs6CharLast4Char = adress.slice(0,6) + "..." + adress.slice(-4)


    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(adress)
        /* Alert the copied text */
   /*      alert ("Copied the text: " + adress);
    }



        return <Container>
            <CopyButton onClick={copyToClipboard}>  {adressFirs6CharLast4Char}</CopyButton>
        </Container>
    }

    export default Add*/