import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

const App = () => {
  const [dirPath, setDirPath] = useState('');
  const [isLoading, setLoading] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9090/scan', {
        dirPath,
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          position: 'top-center',
        });
      } else {
        toast.error(response.data.message, {
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : error.message,
        {
          position: 'top-center',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='App'>
      <h1 className='title'>File Categorisation</h1>
      <form onSubmit={submitHandler} className='form-container'>
        <label>Directory Path</label>
        <input
          type='text'
          placeholder='Ex: D:\User\Project'
          value={dirPath}
          onChange={(e) => setDirPath(e.target.value)}
        />
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Processing....' : 'Scan'}
        </button>
      </form>
      <Toaster
        position='top-center'
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#000',
          },
        }}
      />
    </div>
  );
};

export default App;
