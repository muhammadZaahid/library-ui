import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import './Member.css';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [inquiry, setInquiry] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalRecords: 0,
    });

    const toast = useRef(null);
    const rowsPerPageOptions = [5, 10, 20, 50];

    const loadMembers = useCallback(async () => {
        try {
            const res = await api.get('/members', {
                params: {
                    inquiry,
                    page: pagination.page,
                    size: pagination.size,
                },
            });

            setMembers(res.data.content);
            setPagination((prev) => ({
                ...prev,
                totalRecords: res.data.totalElements,
            }));
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Failed to load members',
                detail: 'Please check your API or network.',
                life: 3000,
            });
        }
    }, [inquiry, pagination.page, pagination.size]);

    const handleBulkDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedMembers.length} member(s)?`);
        if (confirmDelete) {
            const ids = selectedMembers.map((member) => member.id);
            await api.post('/members/bulk-delete', ids);
            setSelectedMembers([]);
            loadMembers();

            toast.current.show({
                severity: 'success',
                summary: 'Deleted',
                detail: `${selectedMembers.length} member(s) deleted successfully.`,
                life: 3000,
            });
        }
    };

    const onRowEditComplete = async (e) => {
        const { newData } = e;
        try {
            await api.put(`/members/${newData.id}`, newData);
            loadMembers();

            toast.current.show({
                severity: 'success',
                summary: 'Updated',
                detail: 'Member has been updated successfully.',
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'There was an error updating the member.',
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

    const onPageChange = (e) => {
        setPagination((prev) => ({
            ...prev,
            page: Math.floor(e.first / e.rows),
            size: e.rows,
        }));
    };

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    return (
        <div className="p-4">
            <Toast ref={toast} />

            {/* Title & Info */}
            <div className="flex justify-content-between align-items-center mb-3">
                <div className="flex align-items-center gap-2">
                    <h1 className="text-3xl text-gray-800 samsung-bold m-0">Member</h1>
                    <i
                        className="pi pi-info-circle text-primary text-xl cursor-pointer"
                        onClick={() => setShowInfo(true)}
                        title="What is this page?"
                    />
                </div>
            </div>

            {/* Info Dialog */}
            <Dialog
                header="What is Member Page?"
                visible={showInfo}
                style={{ width: '40vw' }}
                onHide={() => setShowInfo(false)}
                draggable={false}
                className="samsung-400"
            >
                <p className="m-0 text-sm">
                    This page displays a list of members in the system. You can search, edit, add, or delete member data here.
                </p>
            </Dialog>

            {/* Card */}
            <Card className="shadow-3">
                <div className="flex justify-content-between align-items-center mb-3">
                    <h2 className="card-title-custom m-0 samsung-bold">Member List</h2>
                    <div className="flex align-items-center gap-2">
                        <Button
                            label="Delete Selected"
                            icon="pi pi-trash"
                            className="btn-danger-custom samsung-bold"
                            onClick={handleBulkDelete}
                            disabled={!selectedMembers.length}
                            rounded
                        />
                        <Link to="/members/new">
                            <Button
                                label="Add New Member"
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
                            placeholder="Search member by name..."
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
                    value={members}
                    lazy
                    editMode="row"
                    dataKey="id"
                    onRowEditComplete={onRowEditComplete}
                    selection={selectedMembers}
                    onSelectionChange={(e) => setSelectedMembers(e.value)}
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
                        field="name"
                        header="Name"
                        editor={textEditor}
                        sortable
                        headerClassName="samsung-bold"
                        bodyClassName="samsung-400"
                    />
                    <Column
                        field="email"
                        header="Email"
                        editor={textEditor}
                        sortable
                        headerClassName="samsung-bold"
                        bodyClassName="samsung-400"
                    />
                    <Column
                        field="phone"
                        header="Phone"
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

export default MemberList;
