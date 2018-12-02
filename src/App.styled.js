import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
  justify-content: center;
`

export const ParentDiv = styled.div`
  position: relative;
  
  >*{
    opacity: 0;
  }

  &:hover{
    >*{
      opacity: 1;
    }
  }
`

export const Popup = styled.div`
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 4px 0px;
  background: white;
  
  position: absolute;
  transition: opacity 0.3s ease-in-out;
  
  z-index: 5;

  min-height: 100%;
  min-width: 200px;
  max-width: 80%;
  top: calc((-1*100%) - 20px);  

  padding: 25px;
  display: flex;
  justify-content: center;
  align-items: center;

  p{
    word-break: break-all;
    font-weight: bold;
  }
`

export const TextInput = styled.input`
    width: 60%;
    border: none;
    border-bottom: 1px solid #999;
    padding-left: 15px;
    padding-bottom: 10px;
    font-size: 28px;

    &:focus{
    outline: none;
    }
`
