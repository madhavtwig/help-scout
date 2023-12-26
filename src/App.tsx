import { useSetAppHeight } from "@helpscout/ui-kit";
import Auth from "./components/Auth";

function App() {
  const appRef = useSetAppHeight();

  return (
    <div className="App" ref={appRef}>
      <Auth />
    </div>
  );
}

export default App;
