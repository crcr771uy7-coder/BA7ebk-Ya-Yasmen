import confetti from 'canvas-confetti';

export function triggerCelebration() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#D97706', '#FCD34D', '#FBBF24', '#ffffff'],
    });
  } catch (e) {
    console.error('Confetti trigger error:', e);
  }
}

export function triggerGrandCelebration() {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#F59E0B', '#D97706', '#FDE68A', '#38BDF8', '#E0E7FF'],
      });
    }, 250);
  } catch (e) {
    console.error('Grand confetti trigger error:', e);
  }
}
