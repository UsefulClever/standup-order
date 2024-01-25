import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [names, setNames] = useState<string[]>([]);
  const [storedNames, setStoredNames] = useState<string>('');
  const [inputNames, setInputNames] = useState<string>('');
  const [randomizedNames, setRandomizedNames] = useState<string[]>([]);
  const [copyBtnLbl, setCopyBtnLbl] = useState('Share this list');


  const randomizeNames = () => {
    const shuffledNames = [...names].sort(() => Math.random() - 0.5);
    setRandomizedNames(shuffledNames);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputNames(event.target.value);
  };

  const handleInputSubmit = () => {
    const newNames = inputNames.split(',').map(name => name.trim());
    setNames(newNames);
    localStorage.setItem('names', JSON.stringify(newNames));
    router.push(`/?names=${encodeURIComponent(inputNames)}`);
  };

  useEffect(() => {
    const storedNamesVar = localStorage.getItem('names');
    if (storedNamesVar != storedNames) {
      setStoredNames(storedNamesVar);
    }
  }, []);


  useEffect(() => {
    const storedNamesVar = localStorage.getItem('names');
    if (storedNamesVar != storedNames) {
      setStoredNames(storedNamesVar);
    }
    const urlNames = router.query.names as string;
    if (urlNames) {
      const decodedNames = decodeURIComponent(urlNames).split(/,\s*/);
      setNames(decodedNames);
      setInputNames(decodedNames.join(', '));
    } else if (storedNamesVar) {
      setNames(JSON.parse(storedNamesVar));
    }
    randomizeNames();
  }, [inputNames, router.query.names, storedNames]);

  const copyToClipboard = (copiedPropFunction: React.Dispatch<React.SetStateAction<string>>) => {
    router.push(`/?names=${encodeURIComponent(inputNames)}`);
    navigator.clipboard.writeText(window.location.href);
    copiedPropFunction('Copied to clipboard!');
        setTimeout(() => {
          copiedPropFunction('Share this list');
        }, 5000);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 text-gray-800 font-sans">
      <div className="w-full max-w-xl px-4 space-y-4">
        <h1 className="text-4xl font-bold text-center">List Randomizer</h1>
        <p>
          This is a simple tool to randomize a list of names. Enter a list of names, separated by commas, and click the
          button to randomize the list. Useful for standups, board game orders, etc. The list is 
          stored in your browser's local storage, so it will be saved between visits. You can also share the list by
          copying the URL in the "Share this list" link.
        </p>
        <button
          className="w-full px-4 py-2 font-bold text-blue-500 border border-blue-500 rounded hover:bg-blue-100"
          onClick={randomizeNames}
        >
          Randomize Names
        </button>
        {randomizedNames.length > 0 && (
          <div>
            <h2 className="text-2xl">Randomized Names:</h2>
            <ul className="list-disc list-inside">
              {randomizedNames.map((name, index) => (
                <li key={index} className="text-xl text-blue-500">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="w-full max-w-xl px-4 space-y-4 mt-12">
        <input
          type="text"
          value={inputNames || names}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-2 py-1"
          placeholder="Enter names, separated by commas"
        />
        <button
          onClick={handleInputSubmit}
          className="w-full px-4 py-2 font-bold text-blue-500 border border-blue-500 rounded hover:bg-blue-100"
        >
          Submit Names
        </button>
        <div>
          <a onClick={(event) => {
            event.preventDefault();
            copyToClipboard(setCopyBtnLbl);
          }} className="text-blue-500 underline">
            {copyBtnLbl}
          </a>
        </div>
      </div>
    </div>
  );
}
