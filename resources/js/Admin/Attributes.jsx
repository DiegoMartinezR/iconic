import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import AttributesRest from "../Actions/Admin/AttributesRest";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import Fillable from "../Utils/Fillable";
import Swal from "sweetalert2";

const attributesRest = new AttributesRest();

const Attributes = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const typeRef = useRef();
    const unitRef = useRef();
    const descriptionRef = useRef();
    const isParentRef = useRef();
    const sortOrderRef = useRef();

    const [isParent, setIsParent] = useState(false);

    // Para opciones de tipo select
    const [options, setOptions] = useState([]);
    const optionInputRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedType, setSelectedType] = useState("text");

    // Tipos de atributos disponibles
    const attributeTypes = [
        { value: "text", label: "Texto" },
        { value: "number", label: "Número" },
        { value: "select", label: "Selección (Opciones)" },
        { value: "color", label: "Color" },
    ];

    // Órdenes disponibles para los valores del atributo en la tienda
    const sortOrderOptions = [
        { value: "manual", label: "Manual (orden de carga)" },
        { value: "asc", label: "A → Z (texto y números)" },
        { value: "desc", label: "Z → A (texto y números)" },
        { value: "numeric_asc", label: "Numérico: menor a mayor" },
        { value: "numeric_desc", label: "Numérico: mayor a menor" },
        { value: "custom", label: "Personalizado (mi lista)" },
    ];

    const [selectedSortOrder, setSelectedSortOrder] = useState("manual");
    const customOrderRef = useRef();

    const parseCustomOrder = (raw) => {
        if (!raw) return [];
        return raw
            .split(/[\n,]+/)
            .map((v) => v.trim())
            .filter((v) => v !== "");
    };

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        $(typeRef.current)
            .val(data?.type ?? "text")
            .trigger("change");
        unitRef.current.value = data?.unit ?? "";
        descriptionRef.current.value = data?.description ?? "";
        $(sortOrderRef.current)
            .val(data?.sort_order ?? "manual")
            .trigger("change");
        setSelectedSortOrder(data?.sort_order ?? "manual");
        if (customOrderRef.current) {
            const current = data?.custom_order;
            customOrderRef.current.value = Array.isArray(current) ? current.join("\n") : (current ?? "");
        }

        setIsParent(Boolean(data?.is_parent));

        setSelectedType(data?.type ?? "text");
        setOptions(data?.options ?? []);

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            type: $(typeRef.current).val(),
            is_parent: isParent,
            sort_order: $(sortOrderRef.current).val() || "manual",
            custom_order: selectedSortOrder === "custom"
                ? parseCustomOrder(customOrderRef.current?.value)
                : null,
            unit: unitRef.current.value || null,
            description: descriptionRef.current.value || null,
            options: selectedType === "select" ? options : null,
        };

        const result = await attributesRest.save(request);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await attributesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await attributesRest.boolean({
            id,
            field: "status",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar atributo",
            text: "¿Estás seguro de eliminar este atributo? Los valores asignados a productos se eliminarán.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await attributesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    // Funciones para manejar opciones del tipo select
    const addOption = () => {
        const value = optionInputRef.current?.value?.trim();
        if (value && !options.includes(value)) {
            setOptions([...options, value]);
            optionInputRef.current.value = "";
        }
    };

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        if (e.target.value !== "select") {
            setOptions([]);
        }
    };

    // Función para manejar el reordering remoto
    const onReorder = async (e) => {
        const newOrderIndex = e.toIndex;
        try {
            const result = await attributesRest.reorder(
                e.itemData.id,
                newOrderIndex,
            );
            if (result) {
                $(gridRef.current).dxDataGrid("instance").refresh();
            }
        } catch (error) {
            console.error("Error reordering attribute:", error);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Atributos de Productos"
                rest={attributesRest}
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
                            text: "Nuevo atributo",
                            hint: "Nuevo atributo",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    dropFeedbackMode: "push",
                }}
                sorting={{
                    mode: "single",
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "order_index",
                        caption: "Orden",
                        visible: false,
                        sortOrder: "asc",
                        sortIndex: 0,
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        width: "30%",
                    },
                    {
                        dataField: "type",
                        caption: "Tipo",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            const typeLabels = {
                                text: "Texto",
                                number: "Número",
                                select: "Selección",
                                color: "Color",
                            };
                            const typeColors = {
                                text: "primary",
                                number: "success",
                                select: "warning",
                                color: "info",
                            };
                            ReactAppend(
                                container,
                                <span
                                    className={`badge bg-${typeColors[data.type] || "secondary"}`}
                                >
                                    {typeLabels[data.type] || data.type}
                                </span>,
                            );
                        },
                    },
                    Fillable.has('attributes', 'sort_order') && {
                        dataField: "sort_order",
                        caption: "Orden",
                        width: "170px",
                        cellTemplate: (container, { data }) => {
                            const sortLabels = {
                                manual: "Manual",
                                asc: "A → Z",
                                desc: "Z → A",
                                numeric_asc: "Menor a mayor",
                                numeric_desc: "Mayor a menor",
                                custom: "Personalizado",
                            };
                            const sortColors = {
                                manual: "secondary",
                                asc: "primary",
                                desc: "info",
                                numeric_asc: "success",
                                numeric_desc: "warning",
                                custom: "dark",
                            };
                            ReactAppend(
                                container,
                                <span
                                    className={`badge bg-${sortColors[data.sort_order] || "secondary"}`}
                                >
                                    {sortLabels[data.sort_order] || data.sort_order || "Manual"}
                                </span>,
                            );
                        },
                    },
                    {
                        dataField: "unit",
                        caption: "Unidad",
                        width: "100px",
                    },
                    {
                        dataField: "is_parent",
                        caption: "Principal/Padre",
                        dataType: "boolean",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                data.is_parent
                                    ? '<span class="badge bg-purple">Sí</span>'
                                    : '<span class="badge bg-light text-dark">No</span>',
                            );
                        },
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        width: "25%",
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={() =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: !data.visible,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    {
                        dataField: "status",
                        caption: "Activo",
                        dataType: "boolean",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.status == 1}
                                    onChange={() =>
                                        onStatusChange({
                                            id: data.id,
                                            value: !data.status,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                }),
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ].filter((col) => col !== false)}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar atributo" : "Nuevo atributo"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <input ref={idRef} type="hidden" />
                <div className="row" id="attributes-container">
                    {/* Información básica */}
                    <div className="col-12 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">
                                    <i className="fas fa-tag me-2 text-primary"></i>
                                    Información del Atributo
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <InputFormGroup
                                            eRef={nameRef}
                                            label="Nombre del Atributo"
                                            placeholder="Ej: Espesor, Dimensiones, Color"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <SelectFormGroup
                                            eRef={typeRef}
                                            label="Tipo de Valor"
                                            onChange={handleTypeChange}
                                            dropdownParent="#attributes-container"
                                            required
                                        >
                                            {attributeTypes.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </SelectFormGroup>
                                    </div>
                                    <div className="col-md-12" hidden={!Fillable.has('attributes', 'sort_order')}>
                                        <SelectFormGroup
                                            eRef={sortOrderRef}
                                            label="Orden de Valores en Tienda"
                                            dropdownParent="#attributes-container"
                                            onChange={(e) => setSelectedSortOrder(e.target.value)}
                                        >
                                            {sortOrderOptions.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </SelectFormGroup>
                                        <small className="text-muted">
                                            Define cómo se ordenan los valores (tallas, colores, etc.) en la ficha del producto.
                                        </small>
                                    </div>
                                    {selectedSortOrder === "custom" && (
                                        <div className="col-md-12 mt-2">
                                            <div className="form-group">
                                                <label className="form-label">Mi lista de orden</label>
                                                <textarea
                                                    ref={customOrderRef}
                                                    className="form-control"
                                                    rows={4}
                                                    placeholder={"XS\nS\nM\nL\nXL"}
                                                />
                                                <small className="text-muted d-block mt-1">
                                                    Escribe los valores en el orden exacto que quieres mostrar, uno por línea o separados por comas. Los valores que no estén en la lista aparecen al final.
                                                </small>
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-md-12">
                                        <InputFormGroup
                                            eRef={unitRef}
                                            label="Unidad"
                                            placeholder="Ej: mm, kg, m²"
                                        />
                                        <small className="text-muted">
                                            Opcional
                                        </small>
                                    </div>
                                    <div className="col-md-12 mt-2">
                                        <SwitchFormGroup
                                            label="¿Es atributo principal?"
                                            checked={isParent}
                                            onChange={(e) =>
                                                setIsParent(e.target.checked)
                                            }
                                        />
                                        <small className="text-muted d-block mt-1">
                                            Los atributos principales (como
                                            Medida) ayudan a resetear
                                            selecciones cuando cambian.
                                        </small>
                                    </div>
                                    <div className="col-12">
                                        <TextareaFormGroup
                                            eRef={descriptionRef}
                                            label="Descripción"
                                            rows={2}
                                            placeholder="Descripción del atributo (opcional)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Opciones para tipo Select */}
                    {selectedType === "select" && (
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">
                                        <i className="fas fa-list me-2 text-warning"></i>
                                        Opciones de Selección
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-md-10">
                                            <input
                                                ref={optionInputRef}
                                                type="text"
                                                className="form-control"
                                                placeholder="Escribe una opción y presiona 'Agregar'"
                                                onKeyPress={(e) =>
                                                    e.key === "Enter" &&
                                                    (e.preventDefault(),
                                                    addOption())
                                                }
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={addOption}
                                            >
                                                <i className="fas fa-plus me-1"></i>{" "}
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                    {options.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {options.map((option, index) => (
                                                <span
                                                    key={index}
                                                    className="badge bg-secondary d-flex align-items-center gap-2"
                                                    style={{
                                                        fontSize: "0.9rem",
                                                        padding:
                                                            "0.5rem 0.75rem",
                                                    }}
                                                >
                                                    {option}
                                                    <i
                                                        className="fas fa-times cursor-pointer"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            removeOption(index)
                                                        }
                                                    ></i>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">
                                            <i className="fas fa-info-circle me-1"></i>
                                            Agrega opciones que estarán
                                            disponibles para seleccionar
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Atributos">
            <Attributes {...properties} />
        </BaseAdminto>,
    );
});
