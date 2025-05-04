const mario = document.querySelector('.mario');
const cano = document.querySelector('.cano');
const aviao = document.querySelector('.aviao');
const nuvem = document.querySelector('.nuvem');
const estrela = document.querySelector('.estrela');
const botaoPular = document.querySelector('#btnPular');

const boxGameOver = document.querySelector('.game-over');

let posicaoInicialCano = '-40px';
let velocidade = 4;
let timeOutValocidade;
let timeEstrela;
let intervalColisao;

const aparecerEstrela = () => {
    
    timeEstrela = setTimeout(() => {
        if(!estrela.classList.contains('estrela')){
            estrela.classList.add('estrela');
        }
        estrela.classList.add('movimentarEstrela');
    }, 10000);
}

const removerEstrela = () => {
    estrela.classList.remove('estrela');
}

const ativarSuperMario = () => {
    mario.classList.remove('mario');
    mario.classList.add('marioComAsas');
    removerEstrela();
    clearTimeout(timeEstrela);
}

const setVelicidadeInicial = () => {
    velocidade = 4;
}


const movimentarCano = () => {
    cano.classList.add('movimentarCano');
}

const movimentarAviao = () => {
    aviao.classList.add('movimentarAviao');
}

const pararAviao = () => {
    aviao.classList.remove('movimentarAviao');
}

const pular = () => {
    mario.classList.add("pular");
    setTimeout(() => { mario.classList.remove("pular") }, 650)
}

//Botao para a versao mobile
botaoPular.addEventListener('click', pular);

//aciona o evento de Pular ao apertar a barra de espaço
document.addEventListener('keydown', (event) => {
    if(event.code === "Space") {
        pular();
    }
});

const inicializarMario = () => {
    mario.classList.add('mario');
}

const inicializarVelocidadeDoCano = () => {
    cano.style.animationDuration = `${velocidade}s`;
}

const inicializarPosicaoViloes = (elemento = cano) => {
    elemento.style.right = posicaoInicialCano;
}


function monitorarVelocidadeDoCano() {

    timeOutValocidade = setInterval(() => {
        if(velocidade > 1) {
            velocidade -= 1;
        }else {
            velocidade = 1;
        }

        cano.style.animationDuration = `${velocidade}s`;

        aviao.classList.add('movimentarAviao');

    }, 6000);
}

const inicializarViloes = () => {
    setVelicidadeInicial();
    removerExplosao(cano);
    removerExplosao(aviao);
    inicializarPosicaoViloes(cano);
    inicializarPosicaoViloes(aviao);
    inicializarPosicaoViloes(estrela);
    inicializarVelocidadeDoCano();
    movimentarCano();
    monitorarVelocidadeDoCano();
}

const explodir = (elemento = cano) => {
    elemento.classList.add('explosao');    
}

const removerExplosao = (elemento = cano) => {
    elemento.classList.remove('explosao');    
}

const pararCano = () => {
    cano.classList.remove('movimentarCano');
}

const matarMario = () => {
    mario.classList.remove('mario');
    mario.classList.remove('marioComAsas');
    mario.classList.add('marioMorre');
}

const removerMarioMorto = () => {
    mario.classList.remove('marioMorre');
}

const abrirBoxGameOver = () => {
    boxGameOver.style.display = 'block';
}

const fecharBoxGameOver = () => {
    boxGameOver.style.display = 'none';
}

const gameOver = () => {
    pararCano();
    explodir();
    matarMario();
    abrirBoxGameOver();
    clearInterval(intervalColisao);
    clearInterval(timeOutValocidade);
}

const gameOverAviao = () => {
    pararAviao();
    explodir(aviao);
    pararCano();
    matarMario();
    abrirBoxGameOver();
    clearInterval(intervalColisao);
    clearInterval(timeOutValocidade);
}

function reiniciar() {
    inicializarMario();
    removerMarioMorto();
    inicializarViloes();
    fecharBoxGameOver();
    iniciarChecagemDeColisao();
    aparecerEstrela();
}

//checar colisão
function iniciarChecagemDeColisao() {
    intervalColisao = setInterval(() => {
        const canoPosition = cano.getBoundingClientRect();
        const marioPosition = mario.getBoundingClientRect();
        const aviaoPosition = aviao.getBoundingClientRect();
        const estrelaPosition = estrela.getBoundingClientRect();

        //checar colisao com a bomba
        if(Math.abs(canoPosition.right - marioPosition.right) < 20) {
            if(!mario.classList.contains('pular')) {
                gameOver();
            }
        }

        //checar colisao com aviao
        if(Math.abs(aviaoPosition.right - marioPosition.right) < 20 &&
           Math.abs(aviaoPosition.top - marioPosition.top) < 20) {
            if(mario.classList.contains('pular')) {
                gameOverAviao();
            }
        }

        //checar colisao com a estrela
        if(Math.abs(estrelaPosition.right - marioPosition.right) < 10) {
            if(!mario.classList.contains('pular')) {
                ativarSuperMario();
            }
        }

    }, 1);
}

iniciarChecagemDeColisao();
monitorarVelocidadeDoCano();
aparecerEstrela();
