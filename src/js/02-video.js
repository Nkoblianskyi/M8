import Player from '../node_modules/@vimeo/player/dist/player';
import throttle from '../node_modules/lodash.throttle/index';

// Отримати елемент плеєра з iframe
const playerElement = document.getElementById('vimeo-player');

//ініціалізація плеєра 
const player = new Player(playerElement);

// Функція для оновлення відтворення в locale storage
const updateLocalStorage = throttle(async () => {
    try {
        const currentTime = await player.getCurrentTime();
        localStorage.setItem('videoplayer-current-time', currentTime);
    } catch(error) {
        console.error('Error update local storage', error);
    }
}, 250);

//відстежуємо час для нового відтворення 
player.on('timeupdate', updateLocalStorage);

// загрузка плеєра з місця попердньої зупинки 
player.on('loaded', async() => {
    const currentTime = localStorage.getItem('videoplayer-current-time');

    if(currentTime) {
        try {
            await player.setCurrentTime(parseFloat(currentTime));
        } catch(error) {
            console.error('Error setting current time', error);
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    player.ready().then(() => {
        player.getPaused().then((paused) => {
            if (!paused) {
                player.play();
            }
        });
    });
});
