import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import api from '../../services/api';
import './Author.css';

const AuthorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState({ name: '' });

  const loadAuthor = useCallback(async () => {
    if (id) {
      const res = await api.get(`/authors/${id}`);
      setAuthor(res.data);
    }
  }, [id]);

  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.name.trim()) {
      alert('Name is required');
      return;
    }

    if (id) {
      await api.put(`/authors/${id}`, author);
    } else {
      await api.post('/authors', author);
    }
    navigate('/authors');
  };

  useEffect(() => {
    loadAuthor();
  }, [loadAuthor]);

  return (
      <div className="p-4 flex justify-content-center">
        <Card
            title={<span className="card-title-custom"> {id ? 'Edit Author' : 'Add New Author'} </span>}
            className="w-full md:w-6 shadow-3"
        >
          <form onSubmit={handleSubmit} className="p-fluid">
            <div className="field mb-4">
              <label htmlFor="name" className="font-bold block mb-2 samsung-font">Name</label>
              <InputText
                  id="name"
                  name="name"
                  value={author.name}
                  onChange={handleChange}
                  className="p-inputtext p-component samsung-400 rounded-input"
                  placeholder="Enter author name"
              />
            </div>

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
                  onClick={() => navigate('/authors')}
                  className="btn-gray-custom rounded-input"
              />
            </div>
          </form>
        </Card>
      </div>
  );
};

export default AuthorForm;
