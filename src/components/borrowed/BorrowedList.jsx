import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Borrowed.css';

const BorrowedList = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [selectedBorrowed, setSelectedBorrowed] = useState([]);
    const [inquiry, setInquiry] = useState('');
    const toast = useRef(null);

    const loadBorrowedBooks = async (query = '') => {
        const res = await api.get('/borrowed-books', {
            params: query ? { inquiry: query } : {},
        });
        setBorrowedBooks(res.data);
    };

    const handleBulkDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedBorrowed.length} item(s)?`);
        if (confirmDelete) {
            const ids = selectedBorrowed.map((item) => item.id);
            await api.post('/borrowed-books/bulk-delete', ids);
            setSelectedBorrowed([]);
            loadBorrowedBooks(inquiry);

            toast.current.show({
                severity: 'success',
                summary: 'Deleted',
                detail: `${selectedBorrowed.length} item(s) deleted successfully.`,
                life: 3000,
            });
        }
    };

    const onRowEditComplete = async (e) => {
        const { newData } = e;
        try {
            await api.put(`/borrowed-books/${newData.id}`, newData);
            loadBorrowedBooks(inquiry);

            toast.current.show({
                severity: 'success',
                summary: 'Updated',
                detail: 'Borrowed book has been updated successfully.',
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'There was an error updating the data.',
                life: 3000,
            });
        }
    };


    const dateEditor = (options) => (
        <Calendar
            value={options.value ? new Date(options.value) : null}
            onChange={(e) => {
                const selectedDate = e.value;
                if (selectedDate) {
                    const isoDate = selectedDate.toISOString().split('T')[0];
                    options.editorCallback(isoDate);
                }
            }}
            dateFormat="yy-mm-dd"
            showIcon
            className="p-inputtext-sm samsung-400"
        />
    );

    useEffect(() => {
        loadBorrowedBooks();
    }, []);

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <Card className="shadow-3">
                {/* Header */}
                <div className="flex justify-content-between align-items-center mb-3">
                    <h2 className="card-title-custom m-0 samsung-bold">Borrowed Books</h2>
                    <div className="flex align-items-center gap-2">
                        <Button
                            label="Delete Selected"
                            icon="pi pi-trash"
                            className="btn-danger-custom samsung-bold"
                            onClick={handleBulkDelete}
                            disabled={!selectedBorrowed.length}
                            rounded
                        />
                        <Link to="/borrowed-books/new">
                            <Button
                                label="Add New"
                                icon="pi pi-plus"
                                className="btn-primary-custom samsung-font"
                                rounded
                            />
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <hr className="mb-3 mt-1" />

                {/* Search Bar */}
                <div className="flex align-items-center mb-3 gap-2" style={{ maxWidth: '360px' }}>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-search" />
                        <InputText
                            value={inquiry}
                            onChange={(e) => setInquiry(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    loadBorrowedBooks(inquiry);
                                }
                            }}
                            placeholder="Search by book or member..."
                            className="p-inputtext-sm w-full rounded-input samsung-400 search-input"
                        />
                    </span>

                    <Button
                        icon="pi pi-sync"
                        className="p-button-text p-button-sm"
                        style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => {
                            setInquiry('');
                            loadBorrowedBooks('');
                        }}
                        tooltip="Refresh"
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>

                {/* Table */}
                <DataTable
                    value={borrowedBooks}
                    editMode="row"
                    dataKey="id"
                    onRowEditComplete={onRowEditComplete}
                    selection={selectedBorrowed}
                    onSelectionChange={(e) => setSelectedBorrowed(e.value)}
                    selectionMode="checkbox"
                    paginator
                    rows={5}
                    stripedRows
                    responsiveLayout="scroll"
                    className="p-datatable-sm"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column
                        field="bookTitle"
                        header="Book"
                        sortable
                        headerClassName="samsung-bold"
                        bodyClassName="samsung-400"
                    />
                    <Column
                        field="memberName"
                        header="Member"
                        sortable
                        headerClassName="samsung-bold"
                        bodyClassName="samsung-400"
                    />
                    <Column
                        field="borrowDate"
                        header="Borrow Date"
                        editor={dateEditor}
                        sortable
                        headerClassName="samsung-bold"
                        bodyClassName="samsung-400"
                    />
                    <Column
                        field="returnDate"
                        header="Return Date"
                        editor={dateEditor}
                        sortable
                        headerClassName="samsung-bold"
                        bodyClassName="samsung-400"
                    />
                    <Column
                        rowEditor
                        headerStyle={{ width: '8rem' }}
                        bodyStyle={{ textAlign: 'center' }}
                    />
                </DataTable>
            </Card>
        </div>
    );
};

export default BorrowedList;
