// App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function App() {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', age: '' });
  const [newProgram, setNewProgram] = useState('');
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchPrograms();
  }, []);

  const fetchClients = async () => {
    const res = await axios.get(`${API}/clients`);
    setClients(res.data);
  };

  const fetchPrograms = async () => {
    const res = await axios.get(`${API}/programs`);
    setPrograms(res.data);
  };

  const createProgram = async () => {
    if (!newProgram.trim()) return;
    await axios.post(`${API}/programs`, { name: newProgram });
    setNewProgram('');
    fetchPrograms();
  };

  const registerClient = async () => {
    if (!newClient.name || !newClient.age) return;
    await axios.post(`${API}/clients`, newClient);
    setNewClient({ name: '', age: '' });
    fetchClients();
  };

  const enrollClient = async (clientId, programId) => {
    await axios.post(`${API}/clients/${clientId}/enroll`, { programIds: [programId] });
    fetchClients();
  };

  const viewProfile = async (clientId) => {
    const res = await axios.get(`${API}/clients/${clientId}`);
    setSelectedClient(res.data);
  };

  const searchClients = async () => {
    const res = await axios.get(`${API}/clients?search=${search}`);
    setClients(res.data);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Health Information System</h1>

      {/* Program Creation */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create Health Program</h2>
        <div className="flex space-x-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Program Name"
            value={newProgram}
            onChange={e => setNewProgram(e.target.value)}
          />
          <button className="bg-blue-500 text-white p-2 rounded" onClick={createProgram}>
            Create
          </button>
        </div>
      </div>

      {/* Client Registration */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Register New Client</h2>
        <div className="flex space-x-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Client Name"
            value={newClient.name}
            onChange={e => setNewClient({ ...newClient, name: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Age"
            type="number"
            value={newClient.age}
            onChange={e => setNewClient({ ...newClient, age: e.target.value })}
          />
          <button className="bg-green-500 text-white p-2 rounded" onClick={registerClient}>
            Register
          </button>
        </div>
      </div>

      {/* Search Clients */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Search Clients</h2>
        <div className="flex space-x-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Search by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="bg-gray-500 text-white p-2 rounded" onClick={searchClients}>
            Search
          </button>
        </div>
      </div>

      {/* Clients List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Registered Clients</h2>
        <div className="space-y-4">
          {clients.map(client => (
            <div key={client.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">{client.name} (Age: {client.age})</h3>
              <div className="flex flex-wrap space-x-2 mt-2">
                {programs.map(program => (
                  <button
                    key={program.id}
                    className="bg-purple-400 text-white px-2 py-1 rounded text-sm"
                    onClick={() => enrollClient(client.id, program.id)}
                  >
                    Enroll in {program.name}
                  </button>
                ))}
              </div>
              <button
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={() => viewProfile(client.id)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Client Profile */}
      {selectedClient && (
        <div className="p-6 border rounded shadow mt-8">
          <h2 className="text-2xl font-bold mb-4">Client Profile: {selectedClient.name}</h2>
          <p>Age: {selectedClient.age}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Enrolled Programs:</h3>
          <ul className="list-disc list-inside">
            {selectedClient.enrolledPrograms.map(program => (
              <li key={program.id}>{program.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
