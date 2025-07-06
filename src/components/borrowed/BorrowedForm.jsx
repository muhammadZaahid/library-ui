import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const BorrowedForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bookId: '',
    memberId: '',
    borrowDate: '',
    returnDate: ''
  });

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const loadFormData = async () => {
    const [bookRes, memberRes] = await Promise.all([
      api.get('/books'),
      api.get('/members')
    ]);
    setBooks(bookRes.data);
    setMembers(memberRes.data);
  };

  const loadBorrowedBook = async () => {
    if (id) {
      const res = await api.get(`/borrowed-books/${id}`);
      const data = res.data;
      setForm({
        bookId: data.book?.id,
        memberId: data.member?.id,
        borrowDate: data.borrowDate,
        returnDate: data.returnDate
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await api.put(`/borrowed-books/${id}`, form);
    } else {
      await api.post('/borrowed-books', form);
    }
    navigate('/borrowed-books');
  };

  useEffect(() => {
    loadFormData();
    loadBorrowedBook();
  }, [id]);

  return (
    <div>
      <h2>{id ? 'Edit Borrowed Book' : 'Add Borrowed Book'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Book</label>
          <select name="bookId" value={form.bookId} onChange={handleChange} className="form-control" required>
            <option value="">-- Select Book --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Member</label>
          <select name="memberId" value={form.memberId} onChange={handleChange} className="form-control" required>
            <option value="">-- Select Member --</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Borrow Date</label>
          <input type="date" name="borrowDate" value={form.borrowDate} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Return Date</label>
          <input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-success">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default BorrowedForm;
