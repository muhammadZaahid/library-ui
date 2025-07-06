import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import api from '../../services/api';
import './Member.css';

const MemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [member, setMember] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const loadMember = useCallback(async () => {
    if (id) {
      try {
        const res = await api.get(`/members/${id}`);
        setMember(res.data);
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load member data.',
          life: 3000,
        });
      }
    }
  }, [id]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/members/${id}`, member);
        toast.current.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Member updated successfully.',
          life: 3000,
        });
      } else {
        await api.post('/members', member);
        toast.current.show({
          severity: 'success',
          summary: 'Created',
          detail: 'Member created successfully.',
          life: 3000,
        });
      }
      setTimeout(() => navigate('/members'), 500); // Delay to show toast
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Failed',
        detail: 'An error occurred while saving the member.',
        life: 3000,
      });
    }
  };

  return (
      <div className="p-4 flex justify-content-center">
        <Toast ref={toast} />
        <Card
            title={<span className="card-title-custom">{id ? 'Edit Member' : 'Add New Member'}</span>}
            className="w-full md:w-6 shadow-3"
        >
          <form onSubmit={handleSubmit} className="p-fluid">
            {/* Name */}
            <div className="field mb-4">
              <label htmlFor="name" className="font-bold block mb-2 samsung-font">Name</label>
              <InputText
                  id="name"
                  name="name"
                  value={member.name}
                  onChange={handleChange}
                  className="p-inputtext p-component samsung-400 rounded-input"
                  placeholder="Enter member name"
                  required
              />
            </div>

            {/* Email */}
            <div className="field mb-4">
              <label htmlFor="email" className="font-bold block mb-2 samsung-font">Email</label>
              <InputText
                  id="email"
                  name="email"
                  value={member.email}
                  onChange={handleChange}
                  className="p-inputtext p-component samsung-400 rounded-input"
                  placeholder="Enter member email"
                  required
              />
            </div>

            {/* Phone */}
            <div className="field mb-4">
              <label htmlFor="phone" className="font-bold block mb-2 samsung-font">Phone</label>
              <InputText
                  id="phone"
                  name="phone"
                  value={member.phone}
                  onChange={handleChange}
                  className="p-inputtext p-component samsung-400 rounded-input"
                  placeholder="Enter phone number"
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
                  onClick={() => navigate('/members')}
                  className="btn-gray-custom rounded-input"
              />
            </div>
          </form>
        </Card>
      </div>
  );
};

export default MemberForm;
