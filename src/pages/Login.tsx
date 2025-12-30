import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';

export const Login = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <div>
      <AuthForm onSuccess={handleAuthSuccess} />
    </div>
  );
};