const MOVE_SOUND_URL =
  "https://raw.githubusercontent.com/lichess-org/lila/master/public/sound/standard/Move.mp3";
const CAPTURE_SOUND_URL =
  "https://raw.githubusercontent.com/lichess-org/lila/master/public/sound/standard/Capture.mp3";
const CHECK_SOUND_URL =
  "https://raw.githubusercontent.com/lichess-org/lila/master/public/sound/standard/Check.mp3";
const GAME_END_SOUND_URL =
  "https://raw.githubusercontent.com/lichess-org/lila/master/public/sound/standard/Victory.mp3";

const moveAudio = new Audio(MOVE_SOUND_URL);
const captureAudio = new Audio(CAPTURE_SOUND_URL);
const checkAudio = new Audio(CHECK_SOUND_URL);
const gameEndAudio = new Audio(GAME_END_SOUND_URL);

export const playMoveSound = (isCapture: boolean = false) => {
  if (isCapture) {
    captureAudio.currentTime = 0;
    captureAudio.play().catch(() => {});
  } else {
    moveAudio.currentTime = 0;
    moveAudio.play().catch(() => {});
  }
};

export const playCheckSound = () => {
  checkAudio.currentTime = 0;
  checkAudio.play().catch(() => {});
};

export const playGameEndSound = () => {
  gameEndAudio.currentTime = 0;
  gameEndAudio.play().catch(() => {});
};
