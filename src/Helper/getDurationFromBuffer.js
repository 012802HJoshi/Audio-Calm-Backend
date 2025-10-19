
import decodeAudio from 'audio-decode';

export function secToMinSec(sec) {
  const total = Math.max(0, Number(sec) || 0);
  console.log(`total:${Number(sec)}`);
  let m = Math.floor(total / 60);
  let s = Math.round(total - m * 60);
  if (s === 60) { m += 1; s = 0; } // handle rounding edge-case
  return `${m}:${String(s).padStart(2, '0')}`;
}

export async function getDurationFromBuffer(nodeBuffer) {
  const arrBuf = nodeBuffer.buffer.slice(
    nodeBuffer.byteOffset,
    nodeBuffer.byteOffset + nodeBuffer.byteLength
  );

  
  const audioBuffer = await decodeAudio(arrBuf);

  
  const duration =
    typeof audioBuffer.duration === 'number'
      ? audioBuffer.duration
      : audioBuffer.length / audioBuffer.sampleRate;

  return secToMinSec(duration); 
}
