import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Borrowed.css';

const BorrowedList = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [selectedBorrowed, setSelectedBorrowed] = useState([]);
    const [inquiry, setInquiry] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalRecords: 0,
    });

    const toast = useRef(null);
    const rowsPerPageOptions = [5, 10, 20, 50];

    const loadBorrowedBooks = useCallback(async () => {
        try {
            const res = await api.get('/borrowed-books', {
                params: {
                    inquiry,
                    page: pagination.page,
                    size: pagination.size,
                },
            });
            setBorrowedBooks(res.data.content);
            setPagination((prev) => ({
                ...prev,
                totalRecords: res.data.totalElements,
            }));
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Failed to load data',
                detail: 'Please check your network or API.',
                life: 3000,
            });
        }
    }, [inquiry, pagination.page, pagination.size]);

    const handleBulkDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedBorrowed.length} item(s)?`);
        if (confirmDelete) {
            const ids = selectedBorrowed.map((item) => item.id);
            await api.post('/borrowed-books/bulk-delete', ids);
            setSelectedBorrowed([]);
            loadBorrowedBooks();

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
            loadBorrowedBooks();

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

    const onPageChange = (e) => {
        setPagination((prev) => ({
            ...prev,
            page: Math.floor(e.first / e.rows),
            size: e.rows,
        }));
    };

    useEffect(() => {
        loadBorrowedBooks();
    }, [loadBorrowedBooks]);

    return (
        <div className="p-4">
            <Toast ref={toast} />

            {/* Title & Info */}
            <div className="flex justify-content-between align-items-center mb-3">
                <div className="flex align-items-center gap-2">
                    <h1 className="text-3xl text-gray-800 samsung-bold m-0">Borrowed</h1>
                    <i
                        className="pi pi-info-circle text-primary text-xl cursor-pointer"
                        onClick={() => setShowInfo(true)}
                        title="What is this page?"
                    />
                </div>
            </div>

            {/* Info Dialog */}
            <Dialog
                header="What is Borrowed Page?"
                visible={showInfo}
                style={{ width: '40vw' }}
                onHide={() => setShowInfo(false)}
                draggable={false}
                className="samsung-400"
            >
                <p className="m-0 text-sm">
                    This page displays a list of borrowed books. You can search, edit, add, or delete borrow records here.
                </p>
            </Dialog>

            {/* Card */}
            <Card className="shadow-3">
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
                                    setPagination((prev) => ({ ...prev, page: 0 }));
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
                            setPagination((prev) => ({ ...prev, page: 0 }));
                        }}
                        tooltip="Refresh"
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>

                {/* DataTable */}
                <DataTable
                    value={borrowedBooks}
                    lazy
                    editMode="row"
                    dataKey="id"
                    onRowEditComplete={onRowEditComplete}
                    selection={selectedBorrowed}
                    onSelectionChange={(e) => setSelectedBorrowed(e.value)}
                    selectionMode="checkbox"
                    paginator
                    rows={pagination.size}
                    totalRecords={pagination.totalRecords}
                    first={pagination.page * pagination.size}
                    onPage={onPageChange}
                    rowsPerPageOptions={rowsPerPageOptions}
                    stripedRows
                    responsiveLayout="scroll"
                    className="p-datatable-sm"
                    paginatorTemplate={{
                        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown',
                        RowsPerPageDropdown: (options) => (
                            <div className="custom-rows-dropdown">
                                <span className="text-sm">Rows per page:</span>
                                <Dropdown
                                    value={options.value}
                                    options={options.options}
                                    onChange={options.onChange}
                                    className="p-dropdown-sm"
                                />
                            </div>
                        ),
                    }}
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
