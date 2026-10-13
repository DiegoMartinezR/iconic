import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import Modal from '../Components/Adminto/Modal';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import Global from '../Utils/Global';
import TechnologiesRest from '../Actions/Admin/TechnologiesRest';
import Swal from 'sweetalert2';
import DxButton from '../Components/dx/DxButton';
import ReactAppend from '../Utils/ReactAppend';

const technologiesRest = new TechnologiesRest();

const Technologies = ({ }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    // Form Refs
    const idRef = useRef();
    const nameRef = useRef();
    const iconRef = useRef();

    const onModalOpen = (data) => {
        if (iconRef.current && iconRef.resetDeleteFlag) {
            iconRef.resetDeleteFlag();
        }

        if (data?.id) {
            setIsEditing(true);
            idRef.current.value = data.id;
            nameRef.current.value = data.name || '';
            
            if (iconRef.current && iconRef.image) {
                iconRef.current.value = null;
                iconRef.image.src = data.icon ? `/storage/images/technology/${data.icon}` : '';
            }
        } else {
            setIsEditing(false);
            idRef.current.value = '';
            nameRef.current.value = '';
            
            if (iconRef.current && iconRef.image) {
                iconRef.current.value = null;
                iconRef.image.src = '';
            }
        }
        $(modalRef.current).modal('show');
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (idRef.current.value) formData.append('id', idRef.current.value);
        formData.append('name', nameRef.current.value);

        if (iconRef.current) {
            const icon = iconRef.current.files[0];
            if (icon) {
                formData.append('icon', icon);
            }
            if (iconRef.getDeleteFlag && iconRef.getDeleteFlag()) {
                formData.append('icon_delete', 'DELETE');
            }
        }

        const result = await technologiesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid('instance').refresh();
        $(modalRef.current).modal('hide');
    };

    const onStatusChange = async ({ id, status }) => {
        const result = await technologiesRest.status({ id, status });
        if (!result) return;
        $(gridRef.current).dxDataGrid('instance').refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar tecnología?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!isConfirmed) return;
        const result = await technologiesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid('instance').refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                rest={technologiesRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar",
                            hint: "Agregar",
                            onClick: () => onModalOpen(null),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: 'id',
                        caption: 'ID',
                        visible: false
                    },
                    {
                        dataField: 'icon',
                        caption: 'Ícono',
                        width: 80,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            const src = options.data.icon
                                ? `/storage/images/technology/${options.data.icon}`
                                : "/api/cover/thumbnail/null";
                            ReactAppend(
                                container,
                                <img
                                    src={src}
                                    alt={options.data.name}
                                    style={{
                                        width: "60px",
                                        height: "45px",
                                        objectFit: "contain",
                                        borderRadius: "6px",
                                        backgroundColor: '#ebeff0'
                                    }}

                                    onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                />,
                            );
                        },
                    },
                    {
                        dataField: 'name',
                        caption: 'Nombre'
                    },

                    {
                        caption: 'Acciones',
                        width: 100,
                        cellTemplate: (container, { data }) => {
                            container.append(DxButton({
                                className: 'btn btn-xs btn-soft-primary',
                                title: 'Editar',
                                icon: 'fas fa-pen',
                                onClick: () => {
                                    onModalOpen(data);
                                }
                            }));
                            container.append(DxButton({
                                className: 'btn btn-xs btn-soft-danger',
                                title: 'Eliminar',
                                icon: 'fas fa-trash',
                                onClick: () => onDeleteClicked(data.id)
                            }));
                        },
                        allowFiltering: false,
                        allowExporting: false
                    }
                ]}
            />

            <Modal modalRef={modalRef} title={isEditing ? 'Editar Tecnología' : 'Nueva Tecnología'} size="md" onSubmit={onModalSubmit}>
                <input type="hidden" ref={idRef} name="id" />
                <div className="row g-3">
                    <div className="col-12">
                        <InputFormGroup eRef={nameRef} label="Nombre de la Tecnología" name="name" required />
                    </div>
                    <div className="col-12">
                        <ImageFormGroup eRef={iconRef} label="Imagen" name="icon" aspect='1/1' />
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Tecnologías">
            <Technologies {...properties} />
        </BaseAdminto>
    );
});
