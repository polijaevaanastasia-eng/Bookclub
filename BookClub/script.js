console.log("Сайт книжного клуба запущен!");

// Глобальная переменная для имени текущего пользователя
let currentUser = "";

// ------------------ Функции для карточек и событий ------------------
function toggleCard(header){
    const content = header.nextElementSibling;
    const text = header.querySelector(".toggle-text");

    if(content.style.display === "block"){
        content.style.display = "none";
        text.textContent = "Развернуть";
    }else{
        content.style.display = "block";
        text.textContent = "Свернуть";
    }
}

function like(el){
    if(el.classList.contains("liked")) return;
    let num = el.querySelector("span");
    num.textContent = parseInt(num.textContent)+1;
    el.classList.add("liked");
}

function addComment(btn){
    const textarea = btn.previousElementSibling;
    const text = textarea.value.trim();

    if(!text) return;

    const cardContent = btn.closest(".card-content");
    const comments = cardContent.querySelectorAll(".comment");
    const repliesContainer = cardContent.querySelector(".replies");

    const newComment = document.createElement("div");
    newComment.className = "comment";

    const displayedName = currentUser || "Гость";
    const firstLetter = displayedName.charAt(0).toUpperCase();

    newComment.innerHTML = `
        <div class="avatar">${firstLetter}</div>
        <div class="comment-body">
            <div class="comment-top">
                <strong>${displayedName}</strong>
                <span>только что</span>
            </div>
            <p>${text}</p>

            <div class="comment-actions">
                <span class="like-btn" onclick="like(this)">👍 <span>0</span></span>
                <span onclick="showReply(this)">Ответить</span>
            </div>

            <div class="replies"></div>
        </div>
    `;

    const addCommentBlock = btn.closest(".add-comment");

    cardContent.insertBefore(newComment, addCommentBlock);

    textarea.value = "";
}

function showReply(){
    alert("Ответы работают полностью только при подключении backend.");
}

// ------------------ Вкладки ------------------
const tabs = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".events");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        sections.forEach(sec => sec.classList.remove("active"));
        document.getElementById(tab.dataset.tab).classList.add("active");
    });
});

// ------------------ Кнопки "Присоединиться" к событию ------------------
const buttons = document.querySelectorAll(".join-btn");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".event-card");
        const countElement = card.querySelector(".count");
        let count = parseInt(countElement.textContent);
        count++;
        countElement.textContent = count;

        button.textContent = "Вы участвуете ✓";
        button.style.background = "#22b14c";
        button.disabled = true;
    });
});

// ------------------ Книга месяца ------------------
function toggleBookInfo(){
    const info = document.getElementById("bookInfo");
    const btn = document.querySelector(".more-btn");

    info.classList.toggle("active");

    if(info.classList.contains("active")){
        btn.textContent = "Свернуть";
    }else{
        btn.textContent = "Узнать больше";
    }
}

// ------------------ Хочу прочитать ------------------
function increaseInterest(button){
    if(button.classList.contains("clicked")) return;
    let count = button.querySelector(".count");
    let current = parseInt(count.textContent);
    count.textContent = current + 1;
    button.classList.add("clicked");
    button.disabled = true;
}

// ------------------ Форма "Предложить книгу" ------------------
function toggleSuggestForm(){
    const form = document.getElementById("suggestForm");

    if(form.style.display === "flex"){
        form.style.display = "none";
    }else{
        form.style.display = "flex";
        form.scrollIntoView({behavior: "smooth"});
    }
}

function submitBook() {
    const form = document.getElementById("suggestForm");
    const button = form.querySelector(".submit-book");

    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const genre = document.getElementById("bookGenre").value.trim();
    const desc = document.getElementById("bookDesc").value.trim();
    const reason = document.getElementById("bookReason").value.trim();

    if (!title || !author || !genre || !desc || !reason) {
        alert("Пожалуйста, заполните все поля формы.");
        return;
    }

    const container = document.getElementById("membersBooks");
    const book = document.createElement("div");
    book.className = "member-book";

    // Текущий пользователь берём **в момент добавления книги**
    const displayedName = currentUser || "участник клуба";

    book.innerHTML = `
        <div class="genre">${genre}</div>
        <h3>${title}</h3>
        <p class="member-author">${author}</p>
        <p class="member-desc">${desc}</p>
        <div class="member-reason">
            <strong>Почему стоит прочитать:</strong>
            ${reason}
        </div>
        <p class="recommended">Рекомендовано: ${displayedName}</p>
        <button class="read-btn" onclick="increaseInterest(this)">
            <span class="material-symbols-outlined">menu_book</span>
            Хочу прочитать (<span class="count">1</span>)
        </button>
    `;

    container.appendChild(book);
    book.scrollIntoView({ behavior: "smooth" });

    // Очистка формы, но **кнопку не блокируем навсегда**
    document.getElementById("bookTitle").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookGenre").value = "";
    document.getElementById("bookDesc").value = "";
    document.getElementById("bookReason").value = "";

    // Скрываем форму
    form.style.display = "none";

    // Разблокируем кнопку, чтобы можно было добавить следующую книгу
    button.disabled = false;
}
// ------------------ Регистрация пользователя ------------------
function openRegister() {
    document.getElementById("registerModal").style.display = "block";
}

function closeRegister() {
    document.getElementById("registerModal").style.display = "none";
}

function submitRegister() {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value.trim();

    if(name && email && pass){
        currentUser = name; // сохраняем имя пользователя
        alert(`Спасибо за регистрацию, ${name}!`);
        closeRegister();

        // Меняем кнопку на главной странице после регистрации
        const mainBtn = document.querySelector(".main-btn");
        if(mainBtn){
            mainBtn.textContent = "Перейти к обсуждению";
            mainBtn.onclick = function(){
                window.location.href = "discussion.html";
            };
        }
    } else {
        alert("Пожалуйста, заполните все поля");
    }
}