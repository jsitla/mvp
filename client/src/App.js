import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios with Base URL
axios.defaults.baseURL = process.env.REACT_APP_API_BASE || "https://hse-go-backend-39f0717351cb.herokuapp.com";

function App() {
  // States
  const [news, setNews] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch news on load
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/news');
        console.log('News fetched:', res.data);
        setNews(res.data.news || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to fetch news.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Fetch incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/incidents');
        console.log('Incidents fetched:', res.data);
        setIncidents(res.data || []);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError('Failed to fetch incidents.');
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  // Submit Chat Message
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) {
      alert('Please enter a message.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/chatbot', { message: chatMessage });
      console.log('Chatbot response:', res.data);
      setChatResponse(res.data.bot_reply || 'No response');
    } catch (err) {
      console.error('Error interacting with chatbot:', err);
      setError('Failed to get a response from the chatbot.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Incident
  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    if (!incidentDescription.trim() || !incidentLocation.trim()) {
      alert('Please fill out both description and location.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/incidents', {
        description: incidentDescription,
        location: incidentLocation,
      });
      console.log('Incident submitted:', { incidentDescription, incidentLocation });

      // Fetch updated incidents
      const res = await axios.get('/api/incidents');
      setIncidents(res.data);
      setIncidentDescription('');
      setIncidentLocation('');
    } catch (err) {
      console.error('Error submitting incident:', err);
      setError('Failed to submit the incident.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>HSE GO MVP</h1>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* NEWS SECTION */}
      <section>
        <h2>News</h2>
        {news.map((item, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <a href={item.link} target="_blank" rel="noreferrer">
              <strong>{item.title}</strong>
            </a>
            <p>{item.summary}</p>
          </div>
        ))}
      </section>

      {/* CHATBOT SECTION */}
      <section>
        <h2>Chatbot</h2>
        <form onSubmit={handleChatSubmit}>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask a question..."
          />
          <button type="submit">Send</button>
        </form>
        {chatResponse && <p><strong>Bot reply:</strong> {chatResponse}</p>}
      </section>

      {/* INCIDENT FORM */}
      <section>
        <h2>Report an Incident</h2>
        <form onSubmit={handleIncidentSubmit}>
          <div>
            <input
              type="text"
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
          <div>
            <input
              type="text"
              value={incidentLocation}
              onChange={(e) => setIncidentLocation(e.target.value)}
              placeholder="Location"
            />
          </div>
          <button type="submit">Submit Incident</button>
        </form>
      </section>

      {/* INCIDENT LIST */}
      <section>
        <h2>Incidents</h2>
        {incidents.map((inc) => (
          <div
            key={inc.id}
            style={{ border: "1px solid #ccc", margin: "5px 0", padding: "5px" }}
          >
            <p><strong>ID:</strong> {inc.id}</p>
            <p><strong>Description:</strong> {inc.description}</p>
            <p><strong>Location:</strong> {inc.location}</p>
            <p><strong>Created:</strong> {new Date(inc.created_at).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
