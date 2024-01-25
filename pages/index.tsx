import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [storedNames, setStoredNames] = useState<string>('');
  const [inputNames, setInputNames] = useState<string>('');
  const [randomizedNames, setRandomizedNames] = useState<string[]>([]);
  const [copyBtnLbl, setCopyBtnLbl] = useState('Share this list');


  useEffect(() => {
    // console.log('randomizedNames', randomizedNames);
  }, [randomizedNames]);
  
  const randomizeNames = (namesList: string[]) => {
    const shuffledNames = namesList.sort(() => Math.random() - 0.5);
    // console.log('randomize2', shuffledNames);
    setRandomizedNames(shuffledNames);
  };

  const handleRandomizeClick = () => {
    const newNames = inputNames.split(',').map(name => name.trim());
    // console.log('click', newNames);
    randomizeNames(newNames);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputNames(event.target.value);
  };

  const handleInputSubmit = () => {
    const newNames = inputNames.split(',').map(name => name.trim());
    localStorage.setItem('names', JSON.stringify(newNames));

    updateUrl();

    randomizeNames(newNames);
  };

  useEffect(() => {
    const urlNames = router.query.names as string;
    const storedNamesVar = localStorage.getItem('names');

    if (urlNames) {
      const decodedNames = decodeURIComponent(urlNames).split(/,\s*/);
      setInputNames(decodedNames.join(', '));
      randomizeNames(decodedNames);
    } else if (storedNamesVar && storedNamesVar != storedNames) {
      const nameArray = storedNamesVar ? JSON.parse(storedNamesVar) : [];
      setStoredNames(storedNamesVar);
      setInputNames(nameArray.join(', '));
      randomizeNames(nameArray);
    }
  }, []);

  const copyToClipboard = (copiedPropFunction: React.Dispatch<React.SetStateAction<string>>) => {
    updateUrl();
    copiedPropFunction('Copied to clipboard!');
        setTimeout(() => {
          copiedPropFunction('Share this list');
        }, 5000);
  }

  const updateUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('names', inputNames);
    navigator.clipboard.writeText(url.toString());
    router.push(url.toString());
  };


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
          onClick={handleRandomizeClick}
        >
          Randomize Names
        </button>
        {randomizedNames && randomizedNames.length > 0 && (
          <div>
            <h2 className="text-2xl mt-12">Randomized Names:</h2>
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
          value={inputNames}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-2 py-1"
          placeholder="Enter names, separated by commas"
          name='names'
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
