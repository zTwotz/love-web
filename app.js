const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/* =========================
   DATA
========================= */
const galleryImages = Array.from(
  { length: 20 },
  (_, i) => `./assets/images/gallery/img${i + 1}.jpg`
);

const songs = [
  {
    title: "Trước Khi Em Tồn Tại",
    artist: "Thắng",
    file: "./assets/audio/TruocKhiEmTonTai.mp3",
    cover: "./assets/images/music/song1-cover.jpg",
  },
  {
    title: "Bình Yên",
    artist: "Vũ",
    file: "./assets/audio/binhyen.mp3",
    cover: "./assets/images/music/song2-cover.jpg",
  },
  {
    title: "XTC (Xích Thêm Chút)",
    artist: "Tlinh ft. MCK",
    file: "./assets/audio/xtc.mp3",
    cover: "./assets/images/music/song3-cover.jpg",
  },
];

const letterText = `Gửi bé yêu,

Cảm ơn em đã đến bên anh và làm cho mỗi ngày của anh trở nên dịu dàng hơn.

Anh cũng không nghĩ được mình sẽ có một tình yêu như thế này.

Bên em, từng giây phút hay khoảng khắc đều trở nên thật đặc biệt.
Anh thích cách em cười, cách em quan tâm, và cả những lúc em làm nũng nữa.

Anh không hứa những điều quá lớn lao,
nhưng anh hứa sẽ luôn chân thành, luôn cố gắng, và luôn thương em theo cách dịu dàng nhất.

Chúc em luôn xinh đẹp, vui vẻ, và hạnh phúc.
Hy vọng rằng mỗi khi em mở trang web này ra, em sẽ biết rằng:
ở đây luôn có một người rất thương em.

Yêu em nhiều.`;

const loveWords = [
  "Anh thương bé nhiều 💗",
  "Cảm ơn bé đã đến bên anh",
  "Em là điều dễ thương nhất",
  "Kẻ hong mít ướt",
  "Yêu em nhiều lắm",
  "Always with you",
  "05/09💞",
  "My little princess",
  "Nhớ giữ sức khoẻ nha",
  "Cười lên nha bé ơi",
  "cute cute",
  "Sao mà đáng iu thé",
  "Cái má phúng phính",
];

/* =========================
   LOCK SCREEN
========================= */
const lockScreen = $("#lockScreen");
const homeScreen = $("#homeScreen");
const lockCard = $("#lockCard");
const lockMessage = $("#lockMessage");
const deleteBtn = $("#deleteBtn");
const dots = $$(".dot");
const numberButtons = $$(".num-btn[data-key]");

let inputPassword = "";
let isCheckingPassword = false;
const correctPassword = "0509";

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < inputPassword.length);
  });
}

function setLockMessage(message) {
  lockMessage.textContent = message;
}

function clearPasswordInput() {
  inputPassword = "";
  updateDots();
}

function showHomeScreen() {
  lockScreen.classList.remove("active");
  homeScreen.classList.add("active");
  document.body.classList.add("is-unlocked");
}

function wrongPassword() {
  lockCard.classList.remove("shake");
  void lockCard.offsetWidth;
  lockCard.classList.add("shake");

  setLockMessage("Sai mật khẩu rồi nè 💔");
  clearPasswordInput();
  isCheckingPassword = false;
}

function successPassword() {
  lockCard.classList.remove("success-unlock");
  void lockCard.offsetWidth;
  lockCard.classList.add("success-unlock");

  setLockMessage("Mở khóa thành công rồi 💖");

  setTimeout(() => {
    showHomeScreen();
    // Start music automatically after entering password
    loadSong(0, true);
  }, 650);
}

function checkPassword() {
  if (inputPassword.length !== 4 || isCheckingPassword) return;
  isCheckingPassword = true;

  setTimeout(() => {
    if (inputPassword === correctPassword) {
      successPassword();
    } else {
      wrongPassword();
    }
  }, 180);
}

function addPasswordNumber(value) {
  if (isCheckingPassword || inputPassword.length >= 4) return;
  inputPassword += value;
  updateDots();
  setLockMessage("Đang kiểm tra mật khẩu...");
  checkPassword();
}

function deletePasswordNumber() {
  if (isCheckingPassword || inputPassword.length === 0) return;
  inputPassword = inputPassword.slice(0, -1);
  updateDots();
  setLockMessage("Nhập mật khẩu của hai đứa nè 💗");
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addPasswordNumber(button.dataset.key);
  });
});

deleteBtn.addEventListener("click", deletePasswordNumber);

document.addEventListener("keydown", (event) => {
  if (!lockScreen.classList.contains("active")) return;

  if (/^\d$/.test(event.key)) {
    addPasswordNumber(event.key);
  } else if (event.key === "Backspace") {
    deletePasswordNumber();
  }
});

updateDots();

/* =========================
   MODAL SYSTEM
========================= */
const modals = $$(".modal");
const openButtons = $$("[data-open]");
const closeButtons = $$("[data-close]");

function dispatchModalEvent(type, id) {
  document.dispatchEvent(
    new CustomEvent(type, {
      detail: { id },
    })
  );
}

function closeAllModals() {
  modals.forEach((modal) => modal.classList.remove("active"));
  document.body.classList.remove("no-scroll");
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  closeAllModals();
  modal.classList.add("active");
  document.body.classList.add("no-scroll");
  dispatchModalEvent("love:modal-open", id);
}

function closeModal(modal) {
  if (!modal) return;
  const modalId = modal.id;
  modal.classList.remove("active");

  if (!document.querySelector(".modal.active")) {
    document.body.classList.remove("no-scroll");
  }

  dispatchModalEvent("love:modal-close", modalId);
}

openButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.open);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".modal"));
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const activeModal = document.querySelector(".modal.active");
    if (activeModal) {
      closeModal(activeModal);
    }
  }
});

/* =========================
   MUSIC
========================= */
const audio = $("#audio");
const songCover = $("#songCover");
const songTitle = $("#songTitle");
const songArtist = $("#songArtist");
const progress = $("#progress");
const currentTimeEl = $("#currentTime");
const durationTimeEl = $("#durationTime");
const prevBtn = $("#prevBtn");
const playPauseBtn = $("#playPauseBtn");
const nextBtn = $("#nextBtn");
const playlist = $("#playlist");
const musicMiniControl = $("#musicMiniControl");
const playIcon = $("#playIcon");
const pauseIcon = $("#pauseIcon");

let currentSongIndex = 0;

function updatePlayButton() {
  const isPaused = audio.paused;
  playIcon.classList.toggle("hidden", !isPaused);
  pauseIcon.classList.toggle("hidden", isPaused);
  musicMiniControl.classList.toggle("playing", !isPaused);
}

function renderPlaylist() {
  playlist.innerHTML = songs
    .map(
      (song, index) => `
        <button class="playlist-item ${index === currentSongIndex ? "active" : ""}" data-index="${index}">
          <img class="playlist-thumb" src="${song.cover}" alt="${song.title}">
          <div class="playlist-info">
            <strong>${song.title}</strong>
            <span>${song.artist}</span>
          </div>
        </button>
      `
    )
    .join("");

  $$(".playlist-item", playlist).forEach((item) => {
    item.addEventListener("click", () => {
      const index = Number(item.dataset.index);
      if (index === currentSongIndex) {
        playOrPauseSong();
      } else {
        loadSong(index, true);
      }
    });
  });
}

function loadSong(index, autoPlay = false) {
  currentSongIndex = index;
  const song = songs[currentSongIndex];

  audio.src = song.file;
  songCover.src = song.cover;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  durationTimeEl.textContent = "0:00";

  renderPlaylist();

  if (autoPlay) {
    audio.play().catch(() => {});
  }

  updatePlayButton();
}

function playOrPauseSong() {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function nextSong() {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  loadSong(nextIndex, true);
}

function prevSong() {
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex, true);
}

playPauseBtn.addEventListener("click", playOrPauseSong);
musicMiniControl.addEventListener("click", playOrPauseSong);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);
audio.addEventListener("ended", nextSong);

audio.addEventListener("loadedmetadata", () => {
  durationTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationTimeEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

document.addEventListener("love:modal-close", (event) => {
  // Allow music to keep playing even when modal is closed
});

loadSong(0, false);

/* =========================
   LETTER
========================= */
const letterTextEl = $("#letterText");
let letterTimeout = null;
let letterIndex = 0;

function stopTypingLetter() {
  if (letterTimeout) {
    clearTimeout(letterTimeout);
    letterTimeout = null;
  }
  letterTextEl.classList.remove("typing");
}

function startTypingLetter() {
  stopTypingLetter();
  letterIndex = 0;
  letterTextEl.textContent = "";
  letterTextEl.classList.add("typing");

  function typeNext() {
    if (letterIndex < letterText.length) {
      letterTextEl.textContent += letterText[letterIndex];
      letterIndex += 1;
      // Tự động cuộn xuống chỗ đang gõ chữ
      letterTextEl.scrollTop = letterTextEl.scrollHeight;
      letterTimeout = setTimeout(typeNext, 36);
    } else {
      letterTextEl.classList.remove("typing");
    }
  }

  typeNext();
}

document.addEventListener("love:modal-open", (event) => {
  if (event.detail.id === "letterModal") {
    startTypingLetter();
  }
});

document.addEventListener("love:modal-close", (event) => {
  if (event.detail.id === "letterModal") {
    stopTypingLetter();
  }
});

/* =========================
   GALLERY
========================= */
const track1 = $("#galleryTrack1");
const track2 = $("#galleryTrack2");
const imagePreview = $("#imagePreview");
const previewImg = $("#previewImg");
const previewClose = $("#previewClose");

const row1Images = galleryImages.slice(0, 10);
const row2Images = galleryImages.slice(10, 20);

function createGalleryTrackHTML(list) {
  const duplicated = [...list, ...list];
  return duplicated
    .map(
      (src) => `
        <button class="gallery-item" data-src="${src}">
          <img src="${src}" alt="Memory image" />
        </button>
      `
    )
    .join("");
}

function openImagePreview(src) {
  previewImg.src = src;
  imagePreview.classList.remove("hidden");
  track1.classList.add("paused");
  track2.classList.add("paused");
}

function closeImagePreview() {
  imagePreview.classList.add("hidden");
  previewImg.src = "";
  track1.classList.remove("paused");
  track2.classList.remove("paused");
}

track1.innerHTML = createGalleryTrackHTML(row1Images);
track2.innerHTML = createGalleryTrackHTML(row2Images.length ? row2Images : row1Images);

[track1, track2].forEach((track) => {
  track.addEventListener("click", (event) => {
    const button = event.target.closest(".gallery-item");
    if (!button) return;
    openImagePreview(button.dataset.src);
  });
});

previewClose.addEventListener("click", closeImagePreview);

imagePreview.addEventListener("click", (event) => {
  if (event.target === imagePreview) {
    closeImagePreview();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imagePreview.classList.contains("hidden")) {
    closeImagePreview();
  }
});

document.addEventListener("love:modal-close", (event) => {
  if (event.detail.id === "imageModal") {
    closeImagePreview();
  }
});

/* =========================
   GIFT
========================= */
const bouquet = $("#bouquet");
const giftRain = $("#giftRain");

let giftRainInterval = null;
let giftStartTimeout = null;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function resetBouquetAnimation() {
  bouquet.classList.remove("grow");
  void bouquet.offsetWidth;
  bouquet.classList.add("grow");
}

function clearGiftRain() {
  if (giftRainInterval) {
    clearInterval(giftRainInterval);
    giftRainInterval = null;
  }

  if (giftStartTimeout) {
    clearTimeout(giftStartTimeout);
    giftStartTimeout = null;
  }

  giftRain.innerHTML = "";
}

function createFallingGiftItem() {
  const createPhoto = Math.random() < 0.35;

  if (createPhoto) {
    const photo = document.createElement("div");
    photo.className = "falling-photo";
    photo.style.left = `${randomBetween(4, 88)}%`;
    photo.style.setProperty("--rotate", `${randomBetween(-28, 28)}deg`);
    photo.style.animationDuration = `${randomBetween(5.5, 8.5)}s`;

    const src = galleryImages[Math.floor(Math.random() * galleryImages.length)];
    photo.innerHTML = `<img src="${src}" alt="gift photo" />`;

    giftRain.appendChild(photo);
    setTimeout(() => photo.remove(), 9000);
    return;
  }

  const chip = document.createElement("div");
  chip.className = "falling-chip";
  chip.textContent = loveWords[Math.floor(Math.random() * loveWords.length)];
  chip.style.left = `${randomBetween(3, 82)}%`;
  chip.style.setProperty("--rotate", `${randomBetween(-18, 18)}deg`);
  chip.style.animationDuration = `${randomBetween(5, 8)}s`;

  giftRain.appendChild(chip);
  setTimeout(() => chip.remove(), 9000);
}

function startGiftShow() {
  clearGiftRain();
  resetBouquetAnimation();

  giftStartTimeout = setTimeout(() => {
    giftRainInterval = setInterval(createFallingGiftItem, 650);
  }, 1600);
}

function stopGiftShow() {
  clearGiftRain();
  bouquet.classList.remove("grow");
}

document.addEventListener("love:modal-open", (event) => {
  if (event.detail.id === "giftModal") {
    startGiftShow();
  }
});

document.addEventListener("love:modal-close", (event) => {
  if (event.detail.id === "giftModal") {
    stopGiftShow();
  }
});