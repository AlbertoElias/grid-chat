import Grid from './components/Grid';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <>
        <Header />
        <Grid />
      </>
    </AuthProvider>
  );
}

export default App;