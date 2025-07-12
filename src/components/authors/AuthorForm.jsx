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

  const [author, setAuthor] = useState({
    name: '',
    email: '',
    bio: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const loadAuthor = useCallback(async () => {
    if (id) {
      try {
        const res = await api.get(`/authors/${id}`);
        setAuthor(res.data);
      } catch (err) {
        console.error('Failed to load author');
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthor({ ...author, [name]: value });

    // Clear per-field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFieldErrors({});

    const missingFields = ['name', 'email', 'bio'].filter((key) => !author[key].trim());

    if (missingFields.length > 0) return;

    try {
      if (id) {
        await api.put(`/authors/${id}`, author);
      } else {
        await api.post('/authors', author);
      }

      navigate('/authors');
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.errors) {
        const newFieldErrors = {};
        for (const err of error.response.data.errors) {
          newFieldErrors[err.field] = err.message;
        }
        setFieldErrors(newFieldErrors);
      } else {
        console.error('Failed to save author');
      }
    }
  };

  useEffect(() => {
    loadAuthor();
  }, [loadAuthor]);

  const renderFieldError = (message) => (
      <small
          className="p-error flex align-items-center gap-1 mt-1 ml-2"
          style={{ fontSize: '0.875rem' }}
      >
        <i className="pi pi-times-circle" style={{ fontSize: '0.875rem', marginTop: '1px' }}></i>
        {message}
      </small>
  );

  return (
      <div className="p-4 flex justify-content-center">
        <Card
            title={<span className="card-title-custom">{id ? 'Edit Author' : 'Add New Author'}</span>}
            className="w-full md:w-6 shadow-3"
        >
          <form onSubmit={handleSubmit} className="p-fluid">

            {/* Name */}
            <div className="field mb-4">
              <label htmlFor="name" className="font-bold block mb-2 samsung-font">Name</label>
              <InputText
                  id="name"
                  name="name"
                  value={author.name}
                  onChange={handleChange}
                  className={`p-inputtext p-component samsung-400 rounded-input ${
                      (submitted && !author.name.trim()) || fieldErrors.name ? 'p-invalid' : ''
                  }`}
                  placeholder="Enter author name"
              />
              {submitted && !author.name.trim() && renderFieldError('Name is required')}
              {fieldErrors.name && renderFieldError(fieldErrors.name)}
            </div>

            {/* Email */}
            <div className="field mb-4">
              <label htmlFor="email" className="font-bold block mb-2 samsung-font">Email</label>
              <InputText
                  id="email"
                  name="email"
                  type="email"
                  value={author.email}
                  onChange={handleChange}
                  className={`p-inputtext p-component samsung-400 rounded-input ${
                      (submitted && !author.email.trim()) || fieldErrors.email ? 'p-invalid' : ''
                  }`}
                  placeholder="Enter email"
              />
              {submitted && !author.email.trim() && renderFieldError('Email is required')}
              {fieldErrors.email && renderFieldError(fieldErrors.email)}
            </div>

            {/* Bio */}
            <div className="field mb-4">
              <label htmlFor="bio" className="font-bold block mb-2 samsung-font">Bio</label>
              <InputText
                  id="bio"
                  name="bio"
                  value={author.bio}
                  onChange={handleChange}
                  className={`p-inputtext p-component samsung-400 rounded-input ${
                      (submitted && !author.bio.trim()) || fieldErrors.bio ? 'p-invalid' : ''
                  }`}
                  placeholder="Enter short bio"
              />
              {submitted && !author.bio.trim() && renderFieldError('Bio is required')}
              {fieldErrors.bio && renderFieldError(fieldErrors.bio)}
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
