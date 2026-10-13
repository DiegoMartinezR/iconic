import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";

import CreateReactScript from "@Utils/CreateReactScript";
import Swal from "sweetalert2";
import BaseAdminto from "../Components/Adminto/Base";
import DxButton from "../Components/Adminto/Dx/DxButton";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";

//const typeDeliveryRest = new TypeDeliveryRest();
const typeDeliveryRest = "";
const DeliveryTypes = () => {
    const gridRef = useRef();
    const modalRef = useRef();
    const descriptionRef = useRef();
    const [currentType, setCurrentType] = useState(null);

    const onModalOpen = (data) => {
        setCurrentType(data);
        descriptionRef.current.value = data?.description || "";
        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const result = await typeDeliveryRest.save({
            id: currentType.id,
            description: descriptionRef.current.value,
        });

        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Tipos de envío"
                rest={typeDeliveryRest}
                exportable={false}
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
                }}
                columns={[
                    {
                        dataField: "name",
                        caption: "Tipo de envío",
                        width: "200px",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                data.description ||
                                    '<i class="text-muted">- Sin descripción -</i>'
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                        },
                        allowFiltering: false,
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title="Editar descripción del tipo de envío"
                onSubmit={onModalSubmit}
                size="md"
            >
                <div className="row">
                    <div className="col-12 mb-3">
                        <h5>{currentType?.name}</h5>
                    </div>
                    <TextareaFormGroup
                        eRef={descriptionRef}
                        label="Descripción"
                        rows={4}
                        required
                    />
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Tipos de envío">
            <DeliveryTypes {...properties} />
        </BaseAdminto>
    );
});
