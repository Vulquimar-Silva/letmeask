import copyImg from '../assets/images/copy.svg';
import { createStandaloneToast } from "@chakra-ui/react"

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string;
} 

export function RoomCode(props: RoomCodeProps) {
  const toast = createStandaloneToast()
  
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
  }


  function toasting(){
  toast({
    title: "ID Copiado com sucesso.",
    position: "top",
    status: "success",
    duration: 4000,
    isClosable: true,
  })
  }


  return (
    <button
      className="room-code"
      onClick={() => { toasting(); copyRoomCodeToClipboard();}}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}