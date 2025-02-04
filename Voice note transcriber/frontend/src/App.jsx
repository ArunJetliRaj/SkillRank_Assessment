import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const VoiceNoteTranscriber = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const transcribeAudio = async () => {
    if (!audioFile) {
      alert('Please upload an audio file.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      // Sending the audio file to the backend for transcription
      const response = await axios.post('http://localhost:5000/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTranscribedText(response.data.transcription);
      setSummary(response.data.summary);
      setLoading(false);
    } catch (error) {
      console.error('Error during transcription:', error);
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      // Sending the transcribed text to the backend for summary
      const response = await axios.post('http://localhost:5000/summarize', { text: transcribedText });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const exportText = (format) => {
    const textToExport = summary || transcribedText;
    const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });

    if (format === 'txt') {
      saveAs(blob, 'transcription.txt');
    } else if (format === 'doc') {
      // If you want to export as DOCX, you would need a library like `html-docx-js` or similar
      saveAs(blob, 'transcription.doc');
    }
  };

  return (
    <div className="container">
      <h1>Voice Note Transcriber</h1>
      <div>
        <input type="file" accept=".mp3, .wav" onChange={handleFileUpload} />
        <button onClick={transcribeAudio} disabled={loading}>
          {loading ? 'Transcribing...' : 'Transcribe Audio'}
        </button>
      </div>

      {transcribedText && (
        <div>
          <h2>Transcribed Text</h2>
          <p>{transcribedText}</p>
        </div>
      )}

      {transcribedText && (
        <div>
          <button onClick={generateSummary}>Generate Summary</button>
        </div>
      )}

      {summary && (
        <div>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {(transcribedText || summary) && (
        <div>
          <button onClick={() => exportText('txt')}>Export as TXT</button>
          <button onClick={() => exportText('doc')}>Export as DOC</button>
        </div>
      )}
    </div>
  );
};

export default VoiceNoteTranscriber;
