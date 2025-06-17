
import LoginForm from '@/components/LoginForm';

const Index = () => {
  const handleLogin = () => {
    // This is a placeholder since this component is currently unused
    console.log('Login successful');
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default Index;
