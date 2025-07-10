import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import api from '../../services/api';
import './Borrowed.css';

const BorrowedForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [form, setForm] = useState({
    bookId: '',
    memberId: '',
    borrowDate: null,
    returnDate: null
  });

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const loadFormData = useCallback(async () => {
    try {
      const [bookRes, memberRes] = await Promise.all([
        api.get('/books', { params: { page: 0, size: 9999 } }),
        api.get('/members', { params: { page: 0, size: 9999 } })
      ]);

      setBooks(bookRes.data?.content || []);
      setMembers(memberRes.data?.content || []);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load books or members.',
        life: 3000
      });
    }
  }, []);

  const loadBorrowedBook = useCallback(async () => {
    if (id) {
      try {
        const res = await api.get(`/borrowed-books/${id}`);
        const data = res.data;
        setForm({
          bookId: data.book?.id || '',
          memberId: data.member?.id || '',
          borrowDate: data.borrowDate ? new Date(data.borrowDate) : null,
          returnDate: data.returnDate ? new Date(data.returnDate) : null
        });
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load borrowed book.',
          life: 3000
        });
      }
    }
  }, [id]);

  useEffect(() => {
    loadFormData();
    loadBorrowedBook();
  }, [loadFormData, loadBorrowedBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bookId || !form.memberId || !form.borrowDate || !form.returnDate) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'All fields are required.',
        life: 3000
      });
      return;
    }

    const payload = {
      ...form,
      borrowDate: form.borrowDate.toISOString().split('T')[0],
      returnDate: form.returnDate.toISOString().split('T')[0]
    };

    try {
      if (id) {
        await api.put(`/borrowed-books/${id}`, payload);
        toast.current.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Borrowed book updated successfully.',
          life: 3000
        });
      } else {
        await api.post('/borrowed-books', payload);
        toast.current.show({
          severity: 'success',
          summary: 'Created',
          detail: 'Borrowed book created successfully.',
          life: 3000
        });
      }

      setTimeout(() => navigate('/borrowed-books'), 500);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save borrowed book.',
        life: 3000
      });
    }
  };

  return (
      <div className="p-4 flex justify-content-center">
        <Toast ref={toast} />
        <Card
            title={<span className="card-title-custom">{id ? 'Edit Borrowed Book' : 'Add Borrowed Book'}</span>}
            className="w-full md:w-6 shadow-3"
        >
          <form onSubmit={handleSubmit} className="p-fluid">
            {/* Book */}
            <div className="field mb-4">
              <label htmlFor="bookId" className="font-bold block mb-2 samsung-font">Book</label>
              <Dropdown
                  id="bookId"
                  name="bookId"
                  value={form.bookId}
                  onChange={(e) => setForm({ ...form, bookId: e.value })}
                  options={(Array.isArray(books) ? books : []).map((b) => ({
                    label: b.title,
                    value: b.id
                  }))}
                  placeholder="Select Book"
                  className="p-dropdown-sm w-full samsung-400 rounded-input"
                  required
              />
            </div>

            {/* Member */}
            <div className="field mb-4">
              <label htmlFor="memberId" className="font-bold block mb-2 samsung-font">Member</label>
              <Dropdown
                  id="memberId"
                  name="memberId"
                  value={form.memberId}
                  onChange={(e) => setForm({ ...form, memberId: e.value })}
                  options={(Array.isArray(members) ? members : []).map((m) => ({
                    label: m.name,
                    value: m.id
                  }))}
                  placeholder="Select Member"
                  className="p-dropdown-sm w-full samsung-400 rounded-input"
                  required
              />
            </div>

            {/* Borrow Date */}
            <div className="field mb-4">
              <label htmlFor="borrowDate" className="font-bold block mb-2 samsung-font">Borrow Date</label>
              <span className="p-inputgroup rounded-calendar w-full">
              <Calendar
                  id="borrowDate"
                  value={form.borrowDate}
                  onChange={(e) => setForm({ ...form, borrowDate: e.value })}
                  dateFormat="yy-mm-dd"
                  showIcon
                  placeholder="Select Borrow Date"
                  className="w-full samsung-400"
                  required
              />
            </span>
            </div>

            {/* Return Date */}
            <div className="field mb-4">
              <label htmlFor="returnDate" className="font-bold block mb-2 samsung-font">Return Date</label>
              <span className="p-inputgroup rounded-calendar w-full">
              <Calendar
                  id="returnDate"
                  value={form.returnDate}
                  onChange={(e) => setForm({ ...form, returnDate: e.value })}
                  dateFormat="yy-mm-dd"
                  showIcon
                  placeholder="Select Return Date"
                  className="w-full samsung-400"
                  required
              />
            </span>
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
                  onClick={() => navigate('/borrowed-books')}
                  className="btn-gray-custom rounded-input"
              />
            </div>
          </form>
        </Card>
      </div>
  );
};

export default BorrowedForm;
