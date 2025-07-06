import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({ title: '', authorId: '' });
  const [authors, setAuthors] = useState([]);

  const loadBook = async () => {
    if (id) {
      const res = await api.get(`/books/${id}`);
      setBook(res.data);
    }
  };

  const loadAuthors = async () => {
    const res = await api.get('/authors');
    setAuthors(res.data);
  };

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await api.put(`/books/${id}`, book);
    } else {
      await api.post('/books', book);
    }
    navigate('/books');
  };

  useEffect(() => {
    loadAuthors();
    loadBook();
  }, [id]);

  return (
    <div>
      <h2>{id ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input type="text" name="title" value={book.title} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Author</label>
          <select name="authorId" value={book.authorId} onChange={handleChange} className="form-select" required>
            <option value="">-- Select Author --</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default BookForm;
