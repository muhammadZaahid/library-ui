import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Book.css';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [inquiry, setInquiry] = useState('');
    const [authors, setAuthors] = useState([]);
    const [showInfo, setShowInfo] = useState(false);
    const toast = useRef(null);

    const loadBooks = async (query = '') => {
        const res = await api.get('/books', {
            params: query ? { inquiry: query } : {},
        });
        setBooks(res.data);
    };

    const loadAuthors = async () => {
        const res = await api.get('/authors');
        setAuthors(res.data);
    };

    const handleBulkDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedBooks.length} book(s)?`);
        if (confirmDelete) {
            const ids = selectedBooks.map((book) => book.id);
            await api.post('/books/bulk-delete', ids);
            setSelectedBooks([]);
            loadBooks(inquiry);

            toast.current.show({
                severity: 'success',
                summary: 'Deleted',
                detail: `${selectedBooks.length} book(s) deleted successfully.`,
                life: 3000,
            });
        }
    };

    const onRowEditComplete = async (e) => {
        const { newData } = e;
        try {
            await api.put(`/books/${newData.id}`, newData);
            loadBooks(inquiry);

            toast.current.show({
                severity: 'success',
                summary: 'Updated',
                detail: 'Book has been updated successfully.',
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'There was an error updating the book.',
                life: 3000,
            });
        }
    };

    const textEditor = (options) => (
        <input
            type="text"
            value={options.value}
            onChange={(e) => options.editorCallback(e.target.value)}
            className="p-inputtext p-component samsung-400"
        />
    );

    const authorEditor = (options) => (
        <Dropdown
            value={options.value}
            options={authors}
            optionLabel="name"
            optionValue="id"
            placeholder="Select Author"
            onChange={(e) => options.editorCallback(e.value)}
            className="w-full samsung-400"
        />
    );

    const getAuthorName = (authorId) => {
        const author = authors.find((a) => a.id === authorId);
        return author ? author.name : '';
    };

    useEffect(() => {
        loadBooks();
        loadAuthors();
    }, []);

    return (
        <div className="p-4">
            <Toast ref={toast} />

            {/* Title & Info */}
            <div className="flex justify-content-between align-items-center mb-3">
                <div className="flex align-items-center gap-2">
                    <h1 className="text-3xl text-gray-800 samsung-bold m-0">Book</h1>
                    <i
                        className="pi pi-info-circle text-primary text-xl cursor-pointer"
                        onClick={() => setShowInfo(true)}
                        title="What is this page?"
                    />
                </div>
            </div>

            {/* Info Dialog */}
            <Dialog
                header="What is Book Page?"
                visible={showInfo}
                style={{ width: '40vw' }}
                onHide={() => setShowInfo(false)}
                draggable={false}
                className="samsung-400"
            >
                <p className="m-0 text-sm">
                    This page displays a list of books available in the system. You can search, edit, add, or delete book records.
                </p>
            </Dialog>

            {/* Card and Content */}
            <Card className="shadow-3">
                {/* Header Card */}
                <div className="flex justify-content-between align-items-center mb-3">
                    <h2 className="card-title-custom m-0 samsung-bold">Book List</h2>
                    <div className="flex align-items-center gap-2">
                        <Button
                            label="Delete Selected"
                            icon="pi pi-trash"
                            className="btn-danger-custom samsung-bold"
                            onClick={handleBulkDelete}
                            disabled={!selectedBooks.length}
                            rounded
                        />
                        <Link to="/books/new">
                            <Button
                                label="Add New Book"
                                icon="pi pi-plus"
                                className="btn-primary-custom samsung-font"
                                rounded
                            />
                        </Link>
                    </div>
                </div>

                <hr className="mb-3 mt-1" />

                {/* Search */}
                <div className="flex align-items-center mb-3 gap-2" style={{ maxWidth: '360px' }}>
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        loadBooks(inquiry);
                    }
                }}
                placeholder="Search book by title..."
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
                            loadBooks('');
                        }}
                        tooltip="Refresh"
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>

                {/* Table */}
                <DataTable
                    value={books}
                    editMode="row"
                    dataKey="id"
                    onRowEditComplete={onRowEditComplete}
                    selection={selectedBooks}
                    onSelectionChange={(e) => setSelectedBooks(e.value)}
                    selectionMode="checkbox"
                    paginator
                    rows={5}
                    stripedRows
                    responsiveLayout="scroll"
                    className="p-datatable-sm"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column
                        field="title"
                        header="Title"
                        editor={textEditor}
                        sortable
                        headerClassName="samsung-bold"
                        bodyClassName="samsung-400"
                    />
                    <Column
                        field="authorId"
                        header="Author"
                        editor={authorEditor}
                        body={(rowData) => getAuthorName(rowData.authorId)}
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

export default BookList;
