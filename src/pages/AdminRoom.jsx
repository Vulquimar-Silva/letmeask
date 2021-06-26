import { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RoomIcon from '@material-ui/icons/MeetingRoom';
import ExitIcon from '@material-ui/icons/ExitToApp';


import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';


import Chart from "react-google-charts";
import { firebase } from "../services/firebase";

import '../styles/room.scss';


export function AdminRoom() {
  
  const { user } = useAuth();
  const history = useHistory()
  const params = useParams();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

async function logout() {

    try {
      await firebase.auth().signOut();
      history.push('/rooms/new');

    } catch (error) {
      console.log(error);
    }

}
  
  
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })

      const questionsSorted = parsedQuestions.sort((a, b) => a.likeCount + b.likeCount);
      const allLikes = questionsSorted.map((teste) => {
        return teste.likeCount
      })

      
      let totalLikes = allLikes;

      let total = totalLikes.reduce(function(total, numero){
      return total + numero;
      }, 0);
      console.log(total);

      document.getElementById("total").innerHTML = total;
    
    })
    
})

  
  const backRoom = () => {
      history.push(`/rooms/${roomId}`);
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <button className="btn" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <MenuIcon fontSize="small"/>
            </button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleEndRoom}>Encerrar Sala<RoomIcon /></MenuItem>
              <MenuItem onClick={backRoom}>Voltar Sala<RoomIcon /></MenuItem>
              <MenuItem onClick={() => logout()}>Logout <ExitIcon /></MenuItem>
            </Menu>
          </div>
        </div>
      </header>
      
      <div style={{marginTop: '30px'}}>
        <Chart
        width={400}
        height={300}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={[
          ['LIVE', 'Perguntas', 'Likes'],
          ['Hoje', 85031, 58000],
        ]}
        options={{
          title: 'Gráfico do dia',
          chartArea: { width: '50%' },
          hAxis: {
            title: 'LIVE',
            minValue: 0,
          },
          vAxis: {
            title: 'QUANTIDADE',
          },
        }}
        legendToggle
      />
      </div>
      <div style={{marginTop: '-340px', marginLeft: '30px'}}>
      <main>
        <div className="room-title">
          <h1>Sala {title} </h1>
          <span>{questions.length} pergunta(s)</span><span><span style={{marginLeft:"-20px", marginRight: "-14px"}} id="total">0</span> Like(s)</span>
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
                
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
        </main>
        </div>
    </div>
  );
}
