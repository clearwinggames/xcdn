//import Greeting from './Greeting';

export default function App() {
  return (
    <div>
      <h1>Parent Component</h1>
      {/* Pass two parameters as props */}
      <Greeting name="Alex" age={30} />
      <Greeting name="Maria" age={25} />
    </div>
  );
}
// Destructure the 'props' object directly in the function parameters
export function Greeting({ name, age }) {
  return (
    <p>
      Hello, {name}! You are {age} years old.
    </p>
  );
}
//export default Greeting;
