import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import api from '../../services/api';
import './Book.css';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [book, setBook] = useState({ title: '', authorId: '' });
  const [authors, setAuthors] = useState([]);

  const loadBook = useCallback(async () => {
    if (id) {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load book data.',
          life: 3000,
        });
      }
    }
  }, [id]);

  const loadAuthors = useCallback(async () => {
    try {
      const res = await api.get('/authors');
      setAuthors(res.data);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load authors.',
        life: 3000,
      });
    }
  }, []);

  useEffect(() => {
    loadAuthors();
    loadBook();
  }, [loadAuthors, loadBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!book.title.trim() || !book.authorId) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Title and Author are required.',
        life: 3000,
      });
      return;
    }

    try {
      if (id) {
        await api.put(`/books/${id}`, book);
        toast.current.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Book updated successfully.',
          life: 3000,
        });
      } else {
        await api.post('/books', book);
        toast.current.show({
          severity: 'success',
          summary: 'Created',
          detail: 'Book created successfully.',
          life: 3000,
        });
      }

      setTimeout(() => navigate('/books'), 500);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save book.',
        life: 3000,
      });
    }
  };

  return (
      <div className="p-4 flex justify-content-center">
        <Toast ref={toast} />
        <Card
            title={<span className="card-title-custom">{id ? 'Edit Book' : 'Add New Book'}</span>}
            className="w-full md:w-6 shadow-3"
        >
          <form onSubmit={handleSubmit} className="p-fluid">
            {/* Title */}
            <div className="field mb-4">
              <label htmlFor="title" className="font-bold block mb-2 samsung-font">Title</label>
              <InputText
                  id="title"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                  className="p-inputtext p-component samsung-400 rounded-input"
                  placeholder="Enter book title"
                  required
              />
            </div>

            {/* Author */}
            <div className="field mb-4">
              <label htmlFor="authorId" className="font-bold block mb-2 samsung-font">Author</label>
              <Dropdown
                  id="authorId"
                  name="authorId"
                  value={book.authorId}
                  onChange={(e) => setBook({ ...book, authorId: e.value })}
                  options={authors.map((a) => ({ label: a.name, value: a.id }))}
                  placeholder="Select Author"
                  className="p-dropdown-sm w-full samsung-400 rounded-input"
                  required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-content-end gap-2 mt-4">
              <Button
                  label={id ? 'Update' : 'Create'}
                  icon="pi pi-check"
                  type="submit"
                  className="btn-primary-custom rounded-input"
              />
              <Button
                  label="Cancel"
                  icon="pi pi-times"
                  type="button"
                  onClick={() => navigate('/books')}
                  className="btn-gray-custom rounded-input"
              />
            </div>
          </form>
        </Card>
      </div>
  );
};

export default BookForm;
