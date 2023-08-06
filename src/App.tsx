import { ZennContentProvider } from './contexts/ZennContext';
import Home from './components/Home';

export const App = () => {
  return (
    <ZennContentProvider>
      <Home/>
    </ZennContentProvider>
  )
}
