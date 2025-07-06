import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import api from '../../services/api';

const AuthorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState({ name: '' });

  const loadAuthor = async () => {
    if (id) {
      const res = await api.get(`/authors/${id}`);
      setAuthor(res.data);
    }
  };

  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.name.trim()) {
      alert("Name is required");
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
  }, [id]);

  return (
    <div className="p-4 flex justify-content-center">
      <Card title={id ? 'Edit Author' : 'Add New Author'} className="w-full md:w-6 shadow-3">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-4">
            <label htmlFor="name" className="font-bold block mb-2">Name</label>
            <InputText id="name" name="name" value={author.name} onChange={handleChange} required />
          </div>

          <div className="flex justify-content-end gap-2">
            <Button label={id ? 'Update' : 'Create'} icon="pi pi-check" type="submit" severity="success" />
            <Button label="Cancel" icon="pi pi-times" severity="secondary" onClick={() => navigate('/authors')} />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AuthorForm;
