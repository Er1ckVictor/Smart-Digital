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
const btn_product = document.querySelectorAll(".link-product");
const btn_contact = document.querySelectorAll(".link-contact");
const btn_service = document.querySelectorAll(".link-service");

//Verifica se foi clicado no link de produtos
btn_product.forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("section1").scrollIntoView({
            behavior: "smooth"
        })
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
        await login(pagination_id, pagination_secret)

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

// === CRIAÇÃO DO CARD ===

//Inputs
// Inputs
const tituloProduto = document.getElementById("create_title_product");
const descricaoProduto = document.getElementById("create_description_product");
const categoriaInput = document.getElementById("create_category_product");
const tagsInput = document.getElementById("create_tags_product");
const valorProduto = document.getElementById("create_value_product");
const promocaoProduto = document.getElementById("create_promotion_product");
const link_imgProduto = document.getElementById("create_link_img_product");
const link_compraProduto = document.getElementById("create_link_product");
const btn_criar = document.getElementById("create_product");

const containerCards = document.querySelector(".card-box");

// === ATUALIZAÇÃO EM TEMPO REAL ===
onValue(ref(db, "plataforma/produtos/categorias"), (snapshot) => {
    containerCards.innerHTML = ""; // Limpa o container antes de recriar os cards

    if (!snapshot.exists()) return;

    const categorias = snapshot.val();

    const cardBox = document.createElement("div");
    cardBox.className = "card-box";

    Object.keys(categorias).forEach(categoriaKey => {
        const produtos = categorias[categoriaKey];
        Object.entries(produtos).forEach(([index, prod]) => {

            const card = document.createElement("div");
            card.className = "card";
            card.dataset.path = `plataforma/produtos/categorias/${categoriaKey}/${index}`; // Caminho no Firebase

            card.innerHTML = `
                <div class="img-card">
                    <img src="${prod.imagem}" alt="${prod.titulo}">
                </div>
                <div class="info-card">
                    <h2>${prod.titulo}</h2>
                    <p>${prod.descricao}</p>
                </div>
                <div class="tag-box">
                    ${prod.tags.map(tag => `<p>${tag}</p>`).join("")}
                </div>
                <div class="price">
                    ${prod.promocao && prod.promocao !== ""
                    ? `<p>Valor: <span class="price-card-promotion">R$${parseFloat(prod.valor).toFixed(2)}</span>
                           <span class="price-card-off">R$${parseFloat(prod.promocao).toFixed(2)}</span></p>`
                    : `<p>Valor: <span class="price-card">R$${parseFloat(prod.valor).toFixed(2)}</span></p>`}
                </div>
                <div class="btn">
                    <button onclick="window.open('${prod.linkCompra}', '_blank')">Comprar agora</button>
                    <button class="btn-sobre-produto">Sobre produto</button>
                </div>
            `;

            // === Evento do botão 'Sobre produto' para salvar no localStorage ===
            const btnSobre = card.querySelector(".btn-sobre-produto");

            btnSobre.addEventListener("click", (e) => {
                e.stopPropagation();

                // Envia as informações completas no localStorage
                localStorage.setItem("produtoSelecionado", JSON.stringify({
                    titulo: prod.titulo,
                    descricao: prod.descricao,
                    categoria: prod.categoria,
                    tags: prod.tags,
                    valor: prod.valor,
                    promocao: prod.promocao || "",
                    imagem: prod.imagem,
                    linkCompra: prod.linkCompra,
                    firebasePath: card.dataset.path
                }));

                // Redireciona para página de detalhes
                window.location.href = "products/product.html";
            });

            // === Ao clicar no card, abre modal preenchido (apenas ADMIN) ===
            if (dadosUsuario && dadosUsuario.admin) {
                card.addEventListener("click", (e) => {
                    e.stopPropagation();

                    modalCard.classList.add("active");

                    tituloProduto.value = prod.titulo;
                    descricaoProduto.value = prod.descricao;
                    categoriaInput.value = prod.categoria;
                    tagsInput.value = prod.tags.join(", ");
                    valorProduto.value = prod.valor;
                    promocaoProduto.value = prod.promocao || "";
                    link_imgProduto.value = prod.imagem;
                    link_compraProduto.value = prod.linkCompra;

                    btn_criar.textContent = "Salvar alterações";
                    btn_criar.dataset.path = card.dataset.path;
                });
            }

            cardBox.appendChild(card);
        });
    });

    containerCards.appendChild(cardBox);
});

// === Salvar ou atualizar produto ===
btn_criar.addEventListener("click", async () => {
    const titulo = tituloProduto.value.trim();
    const descricao = descricaoProduto.value.trim();
    const valor = valorProduto.value.trim();
    const promocao = promocaoProduto.value.trim();
    const link_img = link_imgProduto.value.trim();
    const link_compra = link_compraProduto.value.trim();
    const categoria = categoriaInput.value.trim();
    const tags = tagsInput.value.trim().split(",").map(t => t.trim()).filter(t => t !== "");

    if (!titulo || !descricao || !valor || !link_img || !link_compra || !categoria) {
        alert("Preencha todos os campos obrigatórios *");
        return;
    }

    try {
        const dadosProduto = {
            titulo,
            descricao,
            valor: parseFloat(valor),
            promocao: promocao || "",
            imagem: link_img,
            linkCompra: link_compra,
            categoria,
            tags,
            atualizadoEm: new Date().toISOString(),
        };

        // === SE ESTIVER EDITANDO ===
        if (btn_criar.dataset.path) {
            const caminhoProduto = btn_criar.dataset.path;

            await update(ref(db, caminhoProduto), dadosProduto);

            alert("Produto atualizado com sucesso!");

            // Limpa status de edição
            btn_criar.textContent = "Criar produto";
            delete btn_criar.dataset.path;
        }

        // === SE FOR NOVO PRODUTO ===
        else {
            const categoriaFormatada = categoria.toLowerCase().replace(/\s+/g, "");
            const categoriaRef = ref(db, `plataforma/produtos/categorias/${categoriaFormatada}`);

            const snapshot = await get(categoriaRef);
            let index = 1;
            if (snapshot.exists()) {
                const dados = snapshot.val();
                index = Object.keys(dados).length + 1;
            }

            await set(ref(db, `plataforma/produtos/categorias/${categoriaFormatada}/${index}`), {
                ...dadosProduto,
                criadoEm: new Date().toISOString(),
            });

            alert("Produto criado com sucesso!");
        }

        // === LIMPA CAMPOS ===
        tituloProduto.value = "";
        descricaoProduto.value = "";
        valorProduto.value = "";
        promocaoProduto.value = "";
        link_imgProduto.value = "";
        link_compraProduto.value = "";
        categoriaInput.value = "";
        tagsInput.value = "";
        modalCard.classList.remove("active");

    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        alert("Erro ao salvar o produto, tente novamente.");
    }
});

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