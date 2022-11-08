import styled from "styled-components";
import { useState } from "react";


const Container = styled.input`
  display: inline-block;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  transition: all 150ms;
  padding: 1px;
`

const Check = ({checked, onChange}) => {

// TBD refactor to use useState
const [checked, setChecked] = useState(false);

// TBD refactor to use onChange
const notSetInactive = () => {
        setChecked(true);
    }

    return <Container type="checkbox" checked={checked} onChange={notSetInactive} />

}

export default Check