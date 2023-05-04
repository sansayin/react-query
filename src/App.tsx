import { MyComp1 } from './components/MyComp1'
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyComp1 />
    </QueryClientProvider>
  )
}

export default App
