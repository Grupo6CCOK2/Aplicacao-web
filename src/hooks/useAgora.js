import { useEffect, useState } from 'react';
export function useAgora(intervalo = 15000) {
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const atualizar = () => setAgora(new Date());
    const timer = setInterval(atualizar, intervalo);
    window.addEventListener('focus', atualizar);
    document.addEventListener('visibilitychange', atualizar);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', atualizar);
      document.removeEventListener('visibilitychange', atualizar);
    };
  }, [intervalo]);
  return agora;
}
