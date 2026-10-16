import { createAudio } from '../audio.js';
import { useCallback, useEffect, useRef, useState } from 'react';

const directions = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0], w:[0,-1], s:[0,1], a:[-1,0], d:[1,0], 2:[0,-1], 8:[0,1], 4:[-1,0], 6:[1,0] };
const initial = () => ({ snake:[[8,10],[7,10],[6,10],[5,10]], food:[14,7], dir:[1,0], next:null, score:0, status:'ready' });
function foodFor(snake) {
  const free=[];
  for(let y=0;y<20;y++) for(let x=0;x<20;x++) if(!snake.some(p=>p[0]===x&&p[1]===y)) free.push([x,y]);
  return free.length ? free[Math.floor(Math.random()*free.length)] : null;
}
function readSetting(key, fallback) {
  try { const value=JSON.parse(localStorage.getItem(key)); return typeof value==='boolean'?value:fallback; } catch { return fallback; }
}
export default function Home(){
  const audio=useRef(null);
  const [music,setMusic]=useState(()=>readSetting('snake-music',true));
  const [effects,setEffects]=useState(()=>readSetting('snake-effects',true));
  const [dark,setDark]=useState(()=>readSetting('snake-dark',false));
  const effectsEnabled=useRef(effects);
  useEffect(()=>{effectsEnabled.current=effects;},[effects]);
  useEffect(()=>{audio.current=createAudio();return()=>{audio.current.dispose();};},[]);
  const state=useRef(initial());
  const canvas=useRef(null);
  const [view,setView]=useState(initial);
  const [speed,setSpeed]=useState(140);
  const [best,setBest]=useState(()=>{try{return Number(localStorage.getItem('snake-best'))||0;}catch{return 0;}});
  const publish=useCallback(()=>setView({...state.current}),[]);
  const action=useCallback(()=>{
    audio.current?.unlock();
    const g=state.current;
    setBest(previous=>Math.max(previous,g.score));
    if(['ready','over','won'].includes(g.status)) state.current={...initial(),status:'playing'};
    else g.status=g.status==='playing'?'paused':'playing';
    publish();
  },[publish]);
  function steer(dir){const g=state.current;if(g.status==='playing'&&!g.next&&!(dir[0]===-g.dir[0]&&dir[1]===-g.dir[1]))g.next=dir;}
  useEffect(()=>{
    function key(e){
      if(['SELECT','INPUT'].includes(e.target.tagName))return;
      const dir=directions[e.key]||directions[e.key.toLowerCase()];
      if(dir){e.preventDefault();steer(dir);}
      if([' ','Enter'].includes(e.key)&&e.target.tagName==='BUTTON')return;
      if([' ','Enter','p','P'].includes(e.key)){e.preventDefault();if(!e.repeat)action();}
    }
    function pause(){if(state.current.status==='playing'){state.current.status='paused';publish();}}
    window.addEventListener('keydown',key);window.addEventListener('blur',pause);document.addEventListener('visibilitychange',pause);
    return()=>{window.removeEventListener('keydown',key);window.removeEventListener('blur',pause);document.removeEventListener('visibilitychange',pause);};
  },[action,publish]);
  useEffect(()=>{
    if(view.status!=='playing')return;
    const timer=setInterval(()=>{
      audio.current?.unlock();
    const g=state.current;g.dir=g.next||g.dir;g.next=null;
      const head=[g.snake[0][0]+g.dir[0],g.snake[0][1]+g.dir[1]];
      const eat=g.food&&head[0]===g.food[0]&&head[1]===g.food[1];
      const body=eat?g.snake:g.snake.slice(0,-1);
      if(head.some(n=>n<0||n>=20)||body.some(p=>p[0]===head[0]&&p[1]===head[1])){g.status='over';if(effectsEnabled.current)audio.current?.effect('over');}
      else{g.snake=[head,...g.snake];if(eat){g.score+=10;g.food=foodFor(g.snake);if(!g.food)g.status='won';if(effectsEnabled.current)audio.current?.effect(g.food?'eat':'won');}else g.snake.pop();}
      publish();
    },speed);
    return()=>clearInterval(timer);
  },[view.status,speed,publish]);
  useEffect(()=>{
    const ctx=canvas.current.getContext('2d');ctx.clearRect(0,0,400,400);ctx.fillStyle='#293523';
    view.snake.forEach(([x,y])=>ctx.fillRect(x*20+2,y*20+2,16,16));
    if(view.food){const [x,y]=view.food;ctx.fillRect(x*20+5,y*20+5,10,10);ctx.fillRect(x*20+9,y*20+1,4,4);}
    if(view.score>best){try{localStorage.setItem('snake-best',String(view.score));}catch{/* Storage may be unavailable. */}}
  },[view,best]);
  useEffect(()=>{audio.current?.music(music && view.status==='playing');return()=>audio.current?.music(false);},[music,view.status]);
  useEffect(()=>{
    document.documentElement.dataset.theme=dark?'dark':'light';
    try{localStorage.setItem('snake-dark',JSON.stringify(dark));localStorage.setItem('snake-music',JSON.stringify(music));localStorage.setItem('snake-effects',JSON.stringify(effects));}catch{/* Optional persistence. */}
  },[dark,music,effects]);
  const record=Math.max(best,view.score);
  function restart(){setBest(record);state.current=initial();publish();}
  return <main className="arcade">
    <header><a href="/" className="logo">sneaking<sup>®</sup></a><div className="preferences"><button aria-pressed={music} onClick={()=>{audio.current?.unlock();setMusic(!music);}}>♫ Música {music?'ligada':'desligada'}</button><button aria-pressed={effects} onClick={()=>{audio.current?.unlock();setEffects(!effects);}}>♪ Efeitos {effects?'ligados':'desligados'}</button><button aria-pressed={dark} onClick={()=>setDark(!dark)}>{dark?'☀ Tema claro':'☾ Tema escuro'}</button></div></header>
    <div className="layout">
      <section className="intro stats"><p className="eyebrow">PLACAR</p><div className="record"><small>PONTUAÇÃO</small><strong>{String(view.score).padStart(3,'0')}<span>PTS</span></strong></div><div className="record"><small>SEU RECORDE</small><strong>{String(record).padStart(3,'0')}<span>PTS</span></strong></div><p className="controls-help">↑ ↓ ← → / WASD<br/>2 · 4 · 6 · 8 para mover<br/>Espaço para pausar</p></section>
      <section className="phone-area" aria-label="Jogo da cobrinha"><div className="phone"><div className="speaker">● ● ● ● ●</div><div className="brand">S N A K E R</div><div className="screen"><div className="screen-top"><span>SNAKE CLASSIC</span><span>▮▮▮ ▰</span></div><div className="scores"><span>PTS {String(view.score).padStart(3,'0')}</span><span>HI {String(record).padStart(3,'0')}</span></div><div className="board"><canvas ref={canvas} width="400" height="400" aria-label={`Tabuleiro. Pontuação ${view.score}`}/>{view.status!=='playing'&&<div className="overlay"><span className="snake-symbol">▟■■▙</span><h2>{{ready:'Pronto para jogar?',paused:'Jogo pausado',over:'Fim de jogo',won:'Você venceu!'}[view.status]}</h2><button onClick={action}>{view.status==='paused'?'CONTINUAR':view.status==='ready'?'JOGAR':'JOGAR DE NOVO'} ►</button><p>{view.status==='over'?`${view.score} pontos · tente outra vez`:'Setas / WASD / 2 · 4 · 6 · 8'}</p></div>}</div><div className="screen-bottom"><span>● {view.status==='playing'?'JOGANDO':'SNAKE CLASSIC'}</span><span>20 × 20</span></div></div><div className="actions"><button onClick={action}>{view.status==='playing'?'PAUSAR':'JOGAR'}</button><span>●</span><button onClick={restart}>REINICIAR</button></div><div className="keypad">{[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(n=><button key={n} onClick={()=>directions[n]?steer(directions[n]):n===5?action():undefined} aria-label={({2:'Mover para cima',4:'Mover para esquerda',6:'Mover para direita',8:'Mover para baixo',5:'Jogar ou pausar'})[n]||`Tecla ${n}`}><b>{n}</b><span>{({1:'••',2:'▲',3:'def',4:'◀',5:'Ⅱ',6:'▶',7:'pqrs',8:'▼',9:'wxyz','*':'+',0:'⌴','#':'↗'})[n]}</span></button>)}</div></div></section>
      <aside><p className="eyebrow">VELOCIDADE</p><h2>Dificuldade</h2><div className="levels">{[[190,'01','De boa','Uma pausa no seu dia.'],[140,'02','Clássico','Do jeito que você lembra.'],[85,'03','Sem dó','Reflexos em dia?']].map(([value,n,title,description])=><button key={n} disabled={['playing','paused'].includes(view.status)} className={speed===value?'selected':''} onClick={()=>setSpeed(value)}><span>{n}</span><div><strong>{title}</strong><small>{description}</small></div><i>{speed===value?'●':'○'}</i></button>)}</div><p className="hint">Escolha a velocidade antes de começar.</p></aside>
    </div>
  </main>;
}




