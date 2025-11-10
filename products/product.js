// ========================= FIREBASE =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, child, onValue, update, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

//Config FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBhbB991IVCom0iTg3Az5Vsmk74SUtYOsk",
    authDomain: "smart-digital-f84e0.firebaseapp.com",
    databaseURL: "https://smart-digital-f84e0-default-rtdb.firebaseio.com",
    projectId: "smart-digital-f84e0",
    storageBucket: "smart-digital-f84e0.firebasestorage.app",
    messagingSenderId: "203372938207",
    appId: "1:203372938207:web:8bfab4b849bc96214a7a6a",
    measurementId: "G-77778ZSPSK"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

//Login do usuário
async function login(email, senha) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
        console.error("Erro no login:", error.message);
    }
}

//Logout do usuário
function logout() {
    signOut(auth)
        .then(() => {
            return
        })
        .catch((error) => {
            alert('Erro ao deslogar, tente novamente...')
            console.log('erro ao deslogar: ', error)
            return
        })
}

//Links do header
const btn_inicio = document.querySelectorAll(".link-inicio");
const btn_product = document.querySelectorAll(".link-product");
const btn_contact = document.querySelectorAll(".link-contact");
const btn_service = document.querySelectorAll(".link-service");

//Verifica se foi clicado no link de inicio
btn_inicio.forEach(link => {
    link.addEventListener("click", () => {
        window.location.href = '../index.html'
    })
})

//Verifica se foi clicado no link de produtos
btn_product.forEach(link => {
    link.addEventListener("click", () => {
        window.location.href = "../index.html"
    })
})

//Verifica se foi clicado o link de contato
btn_contact.forEach(link => {
    link.addEventListener("click", () => {
        window.open("https://forms.gle/K7LHCJjoQm8SVo837", "_blank")
    })
})

//Verifica se foi clicado o link de serviços
btn_service.forEach(link => [
    link.addEventListener("click", () => {
        window.open("https://forms.gle/K7LHCJjoQm8SVo837", "_blank")
    })
])

//Botão de logout
const btn_logout = document.getElementById("logout_user");

//Quando clicar em Logout
btn_logout.addEventListener("click", () => {
    localStorage.removeItem("userId")
    window.location.reload()
})

// === LINK DE LOGIN E CADASTRO ===
const entrar = document.getElementById("btn_login");
const cadastrar = document.getElementById("btn_register");

//Quando clicar em ENTRAR
entrar.addEventListener("click", () => {
    localStorage.setItem("method", "login")
    window.location.href = 'auth/login.html'
})

//Quando clicar em CADASTRAR
cadastrar.addEventListener("click", () => {
    localStorage.setItem("method", "cadastrar")
    window.location.href = 'auth/login.html'
})

localStorage.setItem("pgn", "U2FsdGVkX1+7BlCGbDEOa1CgyFZyr72grZKLifoO3M0=")
localStorage.setItem("pgn2", "U2FsdGVkX19CCwHDzc/GYHWKzHPLVW4Ll3+hkRREefBvrLCCK+ixAwunFk9IMWizHMB4yToTBX+AC/1s6ZrzWw==:U2FsdGVkX1/rjb8j13CrD589YdqXaL3kqnbIyCCff9eAru9K2ZvgJc6UW+geFMMJ")

// === CONFIGURAÇÕES DE LOGIN ===

// Função para descriptografar
let SECRET_KEY = "usuario"
function descriptografar(key) {
    const n = CryptoJS.AES.decrypt(key, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return `${n}`
}

//Valida se existe usuário logado
let dadosUsuario = {};
async function validarUsuarioAutenticado() {
    const usuarioLogado = localStorage.getItem("userId")
    if (usuarioLogado && usuarioLogado !== "" && usuarioLogado.includes(":")) {
        let dadosNovo = usuarioLogado.split(":")
        let d1 = dadosNovo[0].trim();
        let d2 = dadosNovo[1].trim();
        let pagination_id = descriptografar(d1)
        let pagination_secret = descriptografar(d2)

        try {
            const user = pagination_id.replace(/\./g, ",");
            const usuarioRef = ref(db)

            const snapshot = await get(child(usuarioRef, `plataforma/usuarios/${user}/nome`))
            if (snapshot.exists()) {
                const nome = snapshot.val();
                if (nome.toLowerCase().includes("admin")) {
                    return { id: pagination_id, secret: pagination_secret, nome: nome, admin: true }
                }
                else return { id: pagination_id, secret: pagination_secret, nome: nome, admin: false }
            }

        } catch (error) { console.error("Erro:", error) }
    }
    else return
}

// === VALIDAÇÃO DE LOGIN E PERFIL DO USUÁRIO ===
//Box dos cards
const btn_login_box = document.getElementById("nav_login_web");
const btn_user_box = document.getElementById("nav_login_user");
const user = document.getElementById("config_client");
const dropdownUser = document.querySelector(".dropdown");

async function profileUser(dados) {
    if (dados && dados.nome) {
        btn_login_box.classList.remove("active")
        btn_user_box.classList.add("active")
        const nome = dados.nome
        const parts = nome.split(" ")
        const n1 = parts[0]
        const n2 = parts[1]
        user.innerHTML = `${n1} ${n2}`
    }
}

//Valida dados do usuário e tipo do usuário
dadosUsuario = await validarUsuarioAutenticado();
await profileUser(dadosUsuario)

const modalCard = document.getElementById("modal_card");
if (dadosUsuario && dadosUsuario.admin) {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.altKey && e.key === "a") {
            e.stopPropagation();
            modalCard.classList.add("active")
        }
    })

    //Fecha modal
    modalCard.addEventListener("click", (event) => {
        if (event.target === modalCard) {
            modalCard.classList.remove("active")
        }
    })
}

// Ao clicar no usuário, abre/fecha o dropdown
user.addEventListener("click", (e) => {
    e.stopPropagation(); // impede que o clique propague e feche o dropdown
    dropdown_mobile.classList.remove("active")
    dropdownUser.classList.toggle("active");
});

//Botão de menu MOBILE && PC (DROPDOWN)
const menu_pc = document.getElementById("nav_pc");
const menu_mobile = document.getElementById("nav_mobile");
const btn_menu_mobile = document.getElementById("menu_mobile");
const dropdown_mobile = document.getElementById("dropdown_menu_mobile");

//Quando clicar no botão de menu no mobile
btn_menu_mobile.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownUser.classList.remove("active")
    dropdown_mobile.classList.toggle("active");
})

//Verifica se o dispositivo é móvel (CELULAR)
function checarModo() {
    if (window.innerWidth <= 768) {
        menu_mobile.classList.add("active")
        menu_pc.classList.remove("active")
        // ação para mobile
    } else {
        menu_mobile.classList.remove("active")
        menu_pc.classList.add("active")
    }
}


// Fecha o dropdown ao clicar fora
document.addEventListener("click", (e) => {
    if (!dropdownUser.contains(e.target) && e.target !== user) {
        dropdownUser.classList.remove("active");
    }

    if (!dropdown_mobile.contains(e.target) && e.target !== btn_menu_mobile) {
        dropdown_mobile.classList.remove("active")
    }

});

// roda ao carregar e quando redimensionar
window.addEventListener("resize", checarModo)

//Carregar produto
// Recupera dados salvos
const dados = JSON.parse(localStorage.getItem("produtoSelecionado"));

// Se não existir produto no localStorage → retorna para index
if (!dados) {
    window.location.href = "../index.html";
} else {
    // Preenche o conteúdo da página

    // Imagem
    document.querySelector(".content .img img").src = dados.imagem;
    document.querySelector(".content .img img").alt = dados.titulo;

    // Título
    document.querySelector(".title-product").textContent = dados.titulo;

    // Descrição
    document.querySelector(".description-product").textContent = dados.descricao;

    // Tags
    const tagsDiv = document.querySelector(".tags");
    tagsDiv.innerHTML = "";
    dados.tags.forEach(tag => {
        const p = document.createElement("p");
        p.textContent = tag;
        tagsDiv.appendChild(p);
    });

    // Preço normal ou promoção
    const valorNormal = document.querySelector(".value");
    const valorDisabled = document.querySelector(".value-disabled");
    const valorPromo = document.querySelector(".promotion");

    // Lógica de preenchimento
    if (dados.promocao && dados.promocao.trim() !== "") {
        // Com promoção
        valorNormal.parentElement.style.display = "none";
        valorDisabled.textContent = `R$${parseFloat(dados.valor).toFixed(2)}`;
        valorPromo.textContent = `R$${parseFloat(dados.promocao).toFixed(2)}`;
    } else {
        // Sem promoção
        valorDisabled.parentElement.style.display = "none";
        valorNormal.textContent = `R$${parseFloat(dados.valor).toFixed(2)}`;
    }

    // Botão comprar agora
    const btnComprar = document.querySelector(".btn button");
    btnComprar.addEventListener("click", () => {
        window.open(dados.linkCompra, "_blank");
    });
}