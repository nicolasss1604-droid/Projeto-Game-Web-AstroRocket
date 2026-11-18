
let astronauta = document.getElementById("astronauta");
let moeda = document.getElementById("moeda");
let placar = document.getElementById("placar");
let tempoTexto = document.getElementById("tempo");
let telaInicio = document.getElementById("inicio");
let telaFim = document.getElementById("fim");
let mensagem = document.getElementById("mensagem");
let botao = document.getElementById("botao");

let nuvens = [document.getElementById("nuvem1"), document.getElementById("nuvem2")];


let canosCima = [document.getElementById("cima1"), document.getElementById("cima2")];
let canosBaixo = [document.getElementById("baixo1"), document.getElementById("baixo2")];


let larguraTela = window.innerWidth;
let alturaTela = window.innerHeight;

let jogando = false;      
let acabou = false;      

let y = alturaTela / 2;   
let x = 180;              
let gravidade = 0.4;      
let pulo = -7;           

let velocidadeCanos = 4;
let abertura = 220;       
let distanciaCanos = larguraTela / 2 + 100; 

let canoX = [larguraTela + 200, larguraTela + 200 + distanciaCanos];
let canoGap = [200, 300]; 

let moedaX = 0;
let moedaY = 0;
let moedaAtiva = false;
let moedas = 0;

let tempo = 60;
let relogio;              
let jogo;                  



document.addEventListener("keydown", function (evento) {
  if (evento.code == "Space" || evento.code == "ArrowUp") {
    evento.preventDefault();
    pular();
  }
});


document.addEventListener("mousedown", function () {
  pular();
});

botao.addEventListener("click", function () {
  location.reload();   
});

function pular() {
  if (acabou) return;
  if (jogando == false) {
    comecar();
  }
  velocidade = pulo;
}


function comecar() {
  jogando = true;
  telaInicio.classList.add("escondido");


  relogio = setInterval(function () {
    tempo = tempo - 1;
    tempoTexto.textContent = "TIME: " + tempo;
    if (tempo <= 0) {
      fimDeJogo("Acabou o tempo!");
    }
  }, 1000);


  jogo = setInterval(atualizar, 16);
}


function sortearAbertura() {
  return Math.floor(Math.random() * (alturaTela - abertura - 200)) + 100;
}

function bateu(x1, y1, l1, a1, x2, y2, l2, a2) {
  return x1 < x2 + l2 && x1 + l1 > x2 && y1 < y2 + a2 && y1 + a1 > y2;
}

function atualizar() {
  alturaTela = window.innerHeight;


  velocidade = velocidade + gravidade;
  y = y + velocidade;

  if (y < 28) {                       
    y = 28;
    velocidade = 0;
  }
  if (y + astronauta.offsetHeight > alturaTela - 28) {   // chão
    fimDeJogo("Você caiu!");
  }


  for (let i = 0; i < 2; i++) {
    canoX[i] = canoX[i] - velocidadeCanos;

    
    if (canoX[i] < -canosCima[i].offsetWidth) {
      let outro = 1 - i;
      canoX[i] = canoX[outro] + distanciaCanos;
      canoGap[i] = sortearAbertura();
    }

    let larguraCano = canosCima[i].offsetWidth;
    let alturaBaixo = alturaTela - canoGap[i] - abertura;

    
    canosCima[i].style.left = canoX[i] + "px";
    canosCima[i].style.height = canoGap[i] + "px";

   
    canosBaixo[i].style.left = canoX[i] + "px";
    canosBaixo[i].style.height = alturaBaixo + "px";

    
    let aw = astronauta.offsetWidth - 20;
    let ah = astronauta.offsetHeight - 20;

    if (bateu(x + 10, y + 10, aw, ah, canoX[i] + 5, 0, larguraCano - 10, canoGap[i])) {
      fimDeJogo("Bateu no cano de cima!");
    }
    if (bateu(x + 10, y + 10, aw, ah, canoX[i] + 5, canoGap[i] + abertura, larguraCano - 10, alturaBaixo)) {
      fimDeJogo("Bateu no cano de baixo!");
    }
  }


  if (moedaAtiva == false && Math.random() < 0.02) {
    moedaAtiva = true;
    moedaX = larguraTela;
    moedaY = Math.random() * (alturaTela - 300) + 100;
  }

  if (moedaAtiva) {
    moedaX = moedaX - velocidadeCanos;
    moeda.style.display = "block";
    moeda.style.left = moedaX + "px";
    moeda.style.top = moedaY + "px";

    if (bateu(x, y, astronauta.offsetWidth, astronauta.offsetHeight,
              moedaX, moedaY, moeda.offsetWidth, moeda.offsetHeight)) {
      moedas = moedas + 1;
      placar.textContent = "🪙 x " + moedas;
      moedaAtiva = false;
      moeda.style.display = "none";
    }

    if (moedaX < -50) {
      moedaAtiva = false;
      moeda.style.display = "none";
    }
  }


  for (let i = 0; i < 2; i++) {
    let posicao = nuvens[i].offsetLeft - 1;
    if (posicao <= -larguraTela) {
      posicao = larguraTela;
    }
    nuvens[i].style.left = posicao + "px";
  }

 
  astronauta.style.top = y + "px";
}


function fimDeJogo(motivo) {
  if (acabou) return;
  acabou = true;

  clearInterval(jogo);
  clearInterval(relogio);

  astronauta.src = "imagens/perdeu.png";
  mensagem.textContent = motivo + "  |  Moedas: " + moedas;
  telaFim.classList.remove("escondido");
}

astronauta.style.top = y + "px";
nuvens[0].style.left = "0px";
nuvens[1].style.left = larguraTela + "px";
canosCima[0].style.left = canoX[0] + "px";
canosCima[1].style.left = canoX[1] + "px";
canosBaixo[0].style.left = canoX[0] + "px";
canosBaixo[1].style.left = canoX[1] + "px";
