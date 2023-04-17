axios.defaults.headers.common['Authorization'] = "pYMibMjkB0MmSoYOvynCYRRB";

let enviarPara ='Todos', modoEnvio = 'Público', to = 'Todos', type = 'message', nome;

function capturaMensagens(){
    const resposta = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    resposta.then(rederizaMesangens);
    resposta.catch( error =>{
        alert(`${error.message} \nNão foi possível carregar as mensagens. Por favor tente mais tarde!`);
    });
    
}

function rederizaMesangens(msgs){
    const mensagens = msgs.data;
    const ul = document.querySelector('ul');
    ul.innerHTML = '';
    mensagens.forEach(mensagem => {
        if(mensagem.type === 'message' || mensagem.to === 'Todos' || mensagem.type === 'status'){
            if(mensagem.type === 'status'){
                ul.innerHTML += `
                <li class="entrar" data-test="message">
                    <p class="hora">(${mensagem.time})</p><p class="msg"><span class="user">${mensagem.from}</span> ${mensagem.text} </p>
                </li>
                `
            }else if(mensagem.type === 'message'){
                ul.innerHTML += `
                <li class="msg_all" data-test="message">   
                    <p class="hora">(${mensagem.time})</p><p class="msg"> <span class="user">${mensagem.from}</span> para <span class="user">${mensagem.to}:</span>  ${mensagem.text}</p>
                </li>
                `
            } else if(mensagem.type === 'private_message' && mensagem.to === 'Todos'){
                ul.innerHTML += `
                <li class="msg_private" data-test="message">   
                    <p class="hora">(${mensagem.time})</p><p class="msg"> <span class="user">${mensagem.from}</span> reservadamente para  <span class="user">${mensagem.to}:</span>  ${mensagem.text}</p>
                </li>
                `
            }
        } else if(mensagem.to === nome || mensagem.from === nome || mensagem.to === 'Todos'){
            ul.innerHTML += `
            <li class="msg_private" data-test="message">   
                <p class="hora">(${mensagem.time})</p><p class="msg"> <span class="user">${mensagem.from}</span> reservadamente para  <span class="user">${mensagem.to}:</span>  ${mensagem.text}</p>
            </li>
            `
        }
    });

    const ultimaMensagem = ul.lastElementChild;
    ultimaMensagem.scrollIntoView();
}

function userAtivo(){
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', {name: nome});
}


function entrarSala(){
    nome = document.querySelector(".tela_entrada input").value;

    const promisse = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', {name: nome});
    promisse.then(function(){
        const tela_entrada = document.querySelector('.tela_entrada');
        tela_entrada.style.display = 'none';
        capturaMensagens();
        setTimeout(function(){
            const tela_loading = document.querySelector('.tela_loading');
            tela_loading.style.display = 'none';
        }, 1000);
        setInterval(capturaMensagens, 3000);
        setInterval(userAtivo, 5000);
    });
    promisse.catch(function(){
        alert("Nome já em uso");
        document.querySelector(".tela_entrada input").value = '';
    });
}

function enviarMensagem(){
    const footer = document.querySelector('.footer');
    const textoDigitado = footer.querySelector('input').value;
    const request =
        {
            from: nome,
            to: to,
            text: textoDigitado,
            type: type
        };

    const promisse = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", request);
    promisse.then(function(){
        footer.querySelector('input').value = '';
        capturaMensagens();
    })

    promisse.catch(function() {
        window.location.reload()
    });
}


function teste(event){ //TODO: Mudar nome da função
    var x = event.keyCode; // Obtém o valor Unicode (decimal)
    if(x === 13){
        enviarMensagem();
    }
}

function participantes(){
    const tamanhoTela = window.screen.width;
    const area_preta = document.querySelector('.area_preta');
    area_preta.style.width = `${tamanhoTela - 259}px`;
    const divParticipantes = document.querySelector('.div_participantes');
    divParticipantes.style.display = 'block';

    const divMensagens = document.querySelector('.tela_mensagens');
    divMensagens.classList.add('transparencia');
}

function ocultaParticipantes(){
    const divParticipantes = document.querySelector('.div_participantes');
    divParticipantes.style.display = 'none';
}

function buscaParticipantes(){
    const promisse = axios.get('https://mock-api.driven.com.br/api/vm/uol/participants');
    promisse.then(redenrizarParticipantes);
}

function redenrizarParticipantes(res){
    const ul = document.querySelector('.pessoinhas ul');
    ul.innerHTML = '';
    ul.innerHTML = `
        <li onclick="pessoaEscolhida(this)" data-test="all">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
            <ion-icon name="checkmark-outline" class="check escondido" data-test="check"></ion-icon>
        </li>`
    res.data.forEach(function(participante){
        ul.innerHTML += `
            <li onclick="pessoaEscolhida(this)" data-test="participant">
                <ion-icon name="people-circle-outline" class="person"></ion-icon>
                <p>${participante.name}</p>
                <ion-icon name="checkmark-outline" class="check escondido" data-test="check"></ion-icon>
            </li>
        `
    });   //TODO: v´deo
}

function pessoaEscolhida(pessoa){
    enviarPara = pessoa.querySelector('p').innerHTML;
    to = enviarPara;

    const texto = `Enviando para ${enviarPara} (${modoEnvio.toLowerCase()})`;
    document.querySelector('.textoMsg').innerHTML = texto;

    const pessoaSelecionada = document.querySelector('.pessoinhas ul').querySelector('.selecionado');
    if(pessoaSelecionada == null){
        pessoa.classList.add('selecionado');
        const check = pessoa.querySelector('.check');
        check.classList.remove('escondido');
    } else{
        pessoaSelecionada.classList.remove('selecionado');
        const check = pessoaSelecionada.querySelector('.check');
        check.classList.add('escondido');
        pessoa.classList.add('selecionado');
        const check2 = pessoa.querySelector('.check');
        check2.classList.remove('escondido');
    }
}

function modoMensagem(cadeado){
    modoEnvio = cadeado.querySelector('p').innerHTML;

    if(modoEnvio !== 'Público'){
        type = "private_message";
    }

    const texto = `Enviando para ${enviarPara} (${modoEnvio.toLowerCase()})`;
    document.querySelector('.textoMsg').innerHTML = texto;
    const cadSelecionado = document.querySelector('.visibilidade .selecionado');
    if(cadSelecionado == null){
        const check = cadeado.querySelector('.check');
        check.classList.remove('escondido');
        cadeado.classList.add('selecionado');
    }else{
        const check = cadSelecionado.querySelector('.check');
        check.classList.add('escondido');
        cadSelecionado.classList.remove('selecionado');
        const check2 = cadeado.querySelector('.check');
        check2.classList.remove('escondido');
        cadeado.classList.add('selecionado');
    }
}

buscaParticipantes();
setInterval(buscaParticipantes, 10000);