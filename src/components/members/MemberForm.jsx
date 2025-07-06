import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const MemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState({ name: '', email: '', phone: '' });

  const loadMember = async () => {
    if (id) {
      const res = await api.get(`/members/${id}`);
      setMember(res.data);
    }
  };

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await api.put(`/members/${id}`, member);
    } else {
      await api.post('/members', member);
    }
    navigate('/members');
  };

  useEffect(() => {
    loadMember();
  }, [id]);

  return (
    <div>
      <h2>{id ? 'Edit Member' : 'Add Member'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" name="name" value={member.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" value={member.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" name="phone" value={member.phone} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-success">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default MemberForm;
