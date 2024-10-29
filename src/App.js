import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserPlus, faPlay, faPause, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import sampleAudio from './assets/sample.mp3'; 

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // State and ref for music player
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(sampleAudio)); // Instance de l'audio

  // State and ref for camera
  const [photos, setPhotos] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Camera state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setUsers(users.map(user => (user.id === formData.id ? formData : user)));
      setIsEditing(false);
    } else {
      setFormData({ ...formData, id: users.length + 1 });
      setUsers([...users, { ...formData, id: users.length + 1 }]);
    }
    setFormData({
      id: null,
      nom: '',
      prenom: '',
      email: '',
      tel: '',
      password: ''
    });
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setFormData(user);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Music player logic
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause music
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      }); // Play music
    }
    setIsPlaying(!isPlaying); // Toggle play/pause
  };

  // Camera functionality
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsCameraOpen(true); // Open camera state
    } catch (err) {
      console.error('Error accessing camera: ', err);
    }
  };

  const closeCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Stop each track
    }
    videoRef.current.srcObject = null; // Clear the stream
    setIsCameraOpen(false); // Close camera state
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL('image/png');
      setPhotos([...photos, photoData]);
    }
  };

  return (
    <div className="app-container">
      <h1>Gestion des utilisateurs</h1>
      
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="tel"
          placeholder="Téléphone"
          value={formData.tel}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-add">
          {isEditing ? "Modifier" : "Ajouter"} <FontAwesomeIcon icon={faUserPlus} />
        </button>
      </form>

      <h2>Liste des utilisateurs</h2>
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.nom} {user.prenom}</h3>
              <p>{user.email}</p>
              <p>{user.tel}</p>
            </div>
            <div className="user-actions">
              <button className="btn-edit" onClick={() => handleEdit(user)}>
                <FontAwesomeIcon icon={faEdit} /> Modifier
              </button>
              <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                <FontAwesomeIcon icon={faTrash} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Music player section */}
      <div className="music-player" style={{ textAlign: 'center' }}>
        <audio ref={audioRef} src={sampleAudio} preload="auto" />
        <div className="music-controls">
          <button onClick={handlePlayPause} className="btn-music">
            {isPlaying ? <FontAwesomeIcon icon={faPause} size="2x" /> : <FontAwesomeIcon icon={faPlay} size="2x" />}
          </button>
        </div>
      </div>

      {/* Camera section */}
      <div className="camera-section" style={{ textAlign: 'center' }}>
        <video ref={videoRef} width="320" height="240" />
        {!isCameraOpen ? (
          <button onClick={startCamera} className="btn-camera">
            <FontAwesomeIcon icon={faCamera} /> Ouvrir Caméra
          </button>
        ) : (
          <>
            <button onClick={takePhoto} className="btn-camera">
              Prendre Photo
            </button>
            <button onClick={closeCamera} className="btn-close-camera">
              <FontAwesomeIcon icon={faTimes} /> Fermer Caméra
            </button>
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} width="320" height="240"></canvas>
      </div>

      {/* Gallery section */}
      <div className="gallery-container" style={{ textAlign: 'center', color: '#ddd', paddingBottom: '10px', marginTop: '30px' }}>
        <h2 style={{ visibility: 'hidden' }}>Galerie de photos</h2>
      </div>
      <div className="gallery" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Image ${index + 1}`} style={{ width: '100px', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', margin: '5px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
