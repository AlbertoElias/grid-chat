import Grid from './components/Grid';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { ChatsProvider } from './context/ChatsContext';

function App() {

  return (
    <AuthProvider>
      <>
        <Header />
        <ChatsProvider>
          <Grid  />
        </ChatsProvider>
      </>
    </AuthProvider>
  );
}

export default App;