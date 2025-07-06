import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import api from '../../services/api';
import './Author.css';
import { Link } from 'react-router-dom';

const AuthorList = () => {
    const [authors, setAuthors] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [inquiry, setInquiry] = useState('');
    const toast = useRef(null);

    const loadAuthors = async (query = '') => {
        const res = await api.get('/authors', {
            params: query ? { inquiry: query } : {},
        });
        setAuthors(res.data);
    };

    const handleBulkDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedAuthors.length} author(s)?`);
        if (confirmDelete) {
            const ids = selectedAuthors.map((author) => author.id);
            await api.post('/authors/bulk-delete', ids);
            setSelectedAuthors([]);
            loadAuthors(inquiry);

            toast.current.show({
                severity: 'success',
                summary: 'Deleted',
                detail: `${selectedAuthors.length} author(s) deleted successfully.`,
                life: 3000,
            });
        }
    };

    const onRowEditComplete = async (e) => {
        const { newData } = e;
        try {
            await api.put(`/authors/${newData.id}`, newData);
            loadAuthors(inquiry);

            toast.current.show({
                severity: 'success',
                summary: 'Updated',
                detail: 'Author has been updated successfully.',
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'There was an error updating the author.',
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

    useEffect(() => {
        loadAuthors();
    }, []);

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <Card className="shadow-3">
                {/* Header */}
                <div className="flex justify-content-between align-items-center mb-3">
                    <h2 className="card-title-custom m-0 samsung-bold">Author List</h2>
                    <div className="flex align-items-center gap-2">
                        <Button
                            label="Delete Selected"
                            icon="pi pi-trash"
                            className="btn-danger-custom samsung-bold"
                            onClick={handleBulkDelete}
                            disabled={!selectedAuthors.length}
                            rounded
                        />
                        <Link to="/authors/new">
                            <Button
                                label="Add New Author"
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
                                    loadAuthors(inquiry);
                                }
                            }}
                            placeholder="Search author by name..."
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
                            loadAuthors('');
                        }}
                        tooltip="Refresh"
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>



                {/* Table */}
                <DataTable
                    value={authors}
                    editMode="row"
                    dataKey="id"
                    onRowEditComplete={onRowEditComplete}
                    selection={selectedAuthors}
                    onSelectionChange={(e) => setSelectedAuthors(e.value)}
                    selectionMode="checkbox"
                    paginator
                    rows={5}
                    stripedRows
                    responsiveLayout="scroll"
                    className="p-datatable-sm"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column
                        field="name"
                        header="Name"
                        editor={textEditor}
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

export default AuthorList;
