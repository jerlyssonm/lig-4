const $aside = document.querySelector("aside");

const $main = document.querySelector("main");

const jogadorAtual = document.querySelector("aside div")

let posicoesVermelho = [];
let posicoesPreto = [];
let pontosVermelho = 0
let pontosPreto = 0

function criarTabuleiro() {

    let idCount = 0
    //

    for (let i = 0; i < 7; i++) {

        let coluna = document.createElement('div')

        coluna.classList.add('coluna')
        coluna.addEventListener("click", () => {
            identificarLivre(coluna);
        });

        $main.appendChild(coluna)

        for (let y = 0; y < 6; y++) {

            let space = document.createElement('div')

            space.classList.add('espaco')
            space.id = `space${idCount}`

            coluna.appendChild(space)

            idCount++
        }
    }
}

criarTabuleiro();

function criaJogadores() {
    const $body = document.querySelector("body")
    const jogadores = document.createElement("div")
    const jogadorVermelho = document.createElement("div")
    const jogadorPreto = document.createElement("div")
    const jV = document.createElement("div")
    const jP = document.createElement("div")
    const textV = document.createElement("p")
    const textP = document.createElement("p")


    jogadores.classList.add("container_jogadores")
    jogadorVermelho.classList.add("jodador")
    jogadorPreto.classList.add("jodador")
    jV.classList.add("vermelho")
    jV.classList.add("disco2")
    jP.classList.add("preto")
    jP.classList.add("disco2")
    textV.classList.add("pontos_vermelho")
    textP.classList.add("pontos_preto")

    jogadorVermelho.innerText = "Jogador"
    jogadorPreto.innerText = "Jogador"
    textP.innerText = "0"
    textV.innerText = "0"

    $body.appendChild(jogadores)
    jogadores.appendChild(jogadorVermelho)
    jogadores.appendChild(jogadorPreto)
    jogadorVermelho.appendChild(jV)
    jogadorPreto.appendChild(jP)
    jogadorVermelho.appendChild(textV)
    jogadorPreto.appendChild(textP)
}

criaJogadores()

function Restart() {
    document.querySelector("button").remove()
    posicoesVermelho = [];
    posicoesPreto = [];
    $main.innerText = ""
    controleJogador()
    criarTabuleiro()
}

function contadorVitória(cor, pontos) {
    const pontosjogador = document.querySelector(`.pontos_${cor}`)
    pontosjogador.innerText = pontos
}

function notificarVitoria(cor) {


    $main.innerText = ""
    let notificação = document.createElement("p")
    notificação.classList.add("fadeIn")
    if (cor === "empate") {
        notificação.innerText = "EMPATE"
    } else if (cor === "vermelho") {
        pontosVermelho++
        contadorVitória(cor, pontosVermelho)
        notificação.innerText = `JOGADOR: ${cor.toUpperCase()} GANHOU`
    }
    else if (cor === "preto") {
        pontosPreto++
        contadorVitória(cor, pontosPreto)
        notificação.innerText = `JOGADOR: ${cor.toUpperCase()} GANHOU`
    }
    $main.appendChild(notificação)
    const $body = document.querySelector("body")
    const btnRestart = document.createElement("button")
    btnRestart.classList.add("restart")
    btnRestart.innerText = "Restart"
    $body.appendChild(btnRestart)
    btnRestart.addEventListener("click", Restart)

}

function verificarAngulo(posicoes, angulo) {

    let idsEncima = [0, 6, 12, 18, 24, 30, 36];
    let idsEmbaixo = [5, 11, 17, 23, 29, 35, 41];

    let incremento = 6;

    if (angulo === "vertical") {
        incremento = 1;
    }

    if (angulo === "diagonal") {
        incremento = 5;
    }

    if (angulo === "outra") {
        incremento = 7;
    }

    for (let i = 0; i < posicoes.length; i++) {

        let vitoria1 = posicoes[i] + incremento;
        let vitoria2 = posicoes[i] + incremento * 2;
        let vitoria3 = posicoes[i] + incremento * 3;

        let vitorias = [posicoes[i], vitoria1, vitoria2, vitoria3]

        let invalido = false;

        let encima = 0
        let embaixo = 0

        for (let j = 0; j < idsEncima.length; j++) {

            if (vitorias.includes(idsEncima[j])) {
                encima++
            }
            if (vitorias.includes(idsEmbaixo[j])) {
                embaixo++
            }

            if (embaixo > 0 && encima > 0) {
                invalido = true;
            }

        }

        encima = 0;
        embaixo = 0;

        if (posicoes.includes(vitoria1) && posicoes.includes(vitoria2) && posicoes.includes(vitoria3)) {
            if (!invalido) {
                return 1
            }
        }

    }

    return 0

}

function verficiarVencedor(cor) {

    let posicoesJogador = posicoesVermelho

    if (cor === "preto") {
        posicoesJogador = posicoesPreto;
    }


    let ganhou = verificarAngulo(posicoesJogador, "horizontal")

    ganhou += verificarAngulo(posicoesJogador, "vertical")

    ganhou += verificarAngulo(posicoesJogador, "diagonal")

    ganhou += verificarAngulo(posicoesJogador, "outra")

    if (ganhou > 0) {

        notificarVitoria(cor)

    } else if (posicoesVermelho.length === 21 && posicoesPreto.length === 21) {

        notificarVitoria("empate")
    }
}

function controleJogador() {

    if (jogadorAtual.classList[1] === "vermelho") {
        jogadorAtual.classList.remove("vermelho")
        jogadorAtual.classList.add("preto")
    } else if (jogadorAtual.classList[1] === "preto") {
        jogadorAtual.classList.remove("preto")
        jogadorAtual.classList.add("vermelho")
    }

}

function atualizarArray(id, cor) {

    if (cor === "vermelho") {
        posicoesVermelho.push(parseInt(id.substr(5)))
    }
    if (cor === "preto") {
        posicoesPreto.push(parseInt(id.substr(5)))
    }

    verficiarVencedor(cor)

}

function adicionarDisco(id) {

    let criaDisco = document.createElement("div")

    criaDisco.classList.add(jogadorAtual.classList[0])
    criaDisco.classList.add(jogadorAtual.classList[1])

    let corDisco = criaDisco.classList[1]

    let espacoLivre = document.getElementById(id)

    espacoLivre.appendChild(criaDisco)

    let idEspacoLivre = espacoLivre.id

    atualizarArray(idEspacoLivre, corDisco)

    controleJogador()

}

function identificarLivre(colunaClicada) {

    let idEspacoLivre;

    if (colunaClicada.children[0].childElementCount !== 0) {
        return "Coluna totalmente ocupada."
    }

    for (let i = 0; i < colunaClicada.children.length; i++) {
        if (colunaClicada.children[i].childElementCount !== 0) {
            idEspacoLivre = colunaClicada.children[i - 1].id
            break
        }
        idEspacoLivre = colunaClicada.children[i].id
    }

    adicionarDisco(idEspacoLivre)

}