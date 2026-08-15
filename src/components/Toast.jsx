import { CheckCircle2, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Toast = () => {
  const { toast, dismissToast } = usePlayer();

  if (!toast) return null;

  return (
    <div key={toast.id} className="toast">
      <CheckCircle2 size={18} />
      <span>{toast.message}</span>
      <button className="toast-close" onClick={dismissToast} title="Fechar">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
