import React, { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import BasicRest from "../Actions/BasicRest";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import FieldHelp from "../Components/Adminto/form/FieldHelp";

const bonusRest = new BasicRest();
bonusRest.path = "admin/rank-bonuses";

const RankBonuses = ({ ranks = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [isGroup, setIsGroup] = useState(true);

    // Form refs
    const idRef = useRef();
    const rankIdRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const typeRef = useRef();
    const triggerTypeRef = useRef();
    const minValueRef = useRef();
    const bonusAmountRef = useRef();

    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);
        setIsGroup(data?.is_group ?? true);
        
        idRef.current.value = data?.id || "";
        rankIdRef.current.value = data?.rank_id || "";
        nameRef.current.value = data?.name || "";
        descriptionRef.current.value = data?.description || "";
        typeRef.current.value = data?.type || "items";
        triggerTypeRef.current.value = data?.trigger_type || "volume";
        minValueRef.current.value = data?.min_value || 0;
        bonusAmountRef.current.value = data?.bonus_amount || 0;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        const request = {
            id: idRef.current.value || undefined,
            rank_id: rankIdRef.current.value || null,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            type: typeRef.current.value,
            trigger_type: triggerTypeRef.current.value,
            is_group: isGroup,
            min_value: minValueRef.current.value,
            bonus_amount: bonusAmountRef.current.value,
        };

        const result = await bonusRest.save(request);
        if (result) {
            $(modalRef.current).modal("hide");
            $(gridRef.current).dxDataGrid("instance").refresh();
        }
    };

    const onDelete = async (id) => {
        const result = await bonusRest.delete(id);
        if (result) $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await bonusRest.status({ id, status: value });
        if (result) $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Configuración de Bonos Extra (Personales / Grupales)"
                rest={bonusRest}
                withRelations="rank"
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () => $(gridRef.current).dxDataGrid("instance").refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Nuevo Bono",
                            hint: "Crear un nuevo bono personal o grupal",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "name",
                        caption: "Nombre del Bono",
                    },
                    {
                        dataField: "rank.name",
                        caption: "Rango Requerido",
                        cellTemplate: (container, { data }) => {
                            $(container).text(data.rank?.name || 'Cualquiera');
                        }
                    },
                    {
                        dataField: "trigger_type",
                        caption: "Disparador",
                        cellTemplate: (container, { data }) => {
                            const isAttainment = data.trigger_type === 'attainment';
                            $(container).html(
                                `<span class="badge badge-soft-${isAttainment ? "primary" : "info"}">${isAttainment ? "Al Subir Rango" : "Por Volumen Mensual"}</span>`,
                            );
                        }
                    },
                    {
                        dataField: "min_value",
                        caption: "Meta Requerida",
                        cellTemplate: (container, { data }) => {
                            if (data.trigger_type === 'attainment') return container.text('Al ascender');
                            container.text(`${data.min_value} ${data.type === 'items' ? 'productos' : 'puntos'}`);
                        }
                    },
                    {
                        dataField: "is_group",
                        caption: "Ámbito",
                        cellTemplate: (container, { data }) => {
                            $(container).html(
                                `<span class="badge badge-soft-${data.is_group ? "warning" : "secondary"}">${data.is_group ? "Grupal (Equipo)" : "Personal"}</span>`,
                            );
                        },
                    },
                    {
                        dataField: "bonus_amount",
                        caption: "Premio (S/.)",
                        cellTemplate: (container, { data }) => {
                            container.text(`S/ ${parseFloat(data.bonus_amount).toLocaleString()}`);
                        }
                    },
                    {
                        dataField: "status",
                        caption: "Estado",
                        dataType: "boolean",
                        width: 100,
                        cellTemplate: (container, { data }) => {
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
                        width: 100,
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    icon: "fa fa-pencil",
                                    onClick: () => onModalOpen(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    icon: "fa fa-trash",
                                    onClick: () => onDelete(data.id),
                                }),
                            );
                        },
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Bono Personal / Grupal" : "Crear Bono Personal / Grupal"}
                onSubmit={onModalSubmit}
            >
                <input type="hidden" ref={idRef} />
                <div className="row g-3">
                    <div className="col-12">
                        <InputFormGroup 
                            eRef={nameRef} 
                            label={
                                <span>
                                    Nombre del Bono
                                    <FieldHelp 
                                        title="Nombre del Bono" 
                                        description="Nombre comercial o identificador de este bono extraordinario." 
                                        example="'Bono Manager 1000 Productos Grupales' o 'Bono Rendimiento Individual 200 Productos'."
                                    />
                                </span>
                            } 
                            required 
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">
                            Rango Requerido
                            <FieldHelp 
                                title="Rango Requerido" 
                                description="Define si este bono es exclusivo para un nivel o rango específico, o si cualquier vendedor puede ganarlo independientemente de su rango ('Cualquiera')." 
                                example="Si seleccionas 'Manager Executive', solo los vendedores con dicho rango podrán cobrar el bono al llegar a la meta."
                            />
                        </label>
                        <select className="form-select" ref={rankIdRef}>
                            <option value="">Cualquiera</option>
                            {ranks.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">
                            Tipo Disparador
                            <FieldHelp 
                                title="Tipo de Disparador" 
                                description="Determina cuándo y cómo se otorga el bono: <ul><li><b>Por Volumen (Meta mensual):</b> Se evalúa cada mes calendario según la meta de productos o soles alcanzada.</li><li><b>Al subir de Rango (Único):</b> Se entrega automáticamente por única vez cuando el usuario asciende al rango indicado.</li></ul>" 
                                example="Usa 'Por Volumen' para incentivos recurrentes de fin de mes; usa 'Al subir de Rango' para un bono de bienvenida al nuevo nivel."
                            />
                        </label>
                        <select className="form-select" ref={triggerTypeRef}>
                            <option value="volume">Por Volumen (Meta mensual)</option>
                            <option value="attainment">Al subir de Rango (Único)</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">
                            Tipo Meta
                            <FieldHelp 
                                title="Tipo de Meta" 
                                description="Establece si el valor de la meta se contabiliza por volumen físico de productos vendidos ('Productos') o por valor monetario ('Puntos / Soles S/.')." 
                                example="Si escoges 'Productos', una meta de 500 requerirá vender 500 productos."
                            />
                        </label>
                        <select className="form-select" ref={typeRef}>
                            <option value="items">Productos (Unidades)</option>
                            <option value="amount">Puntos (Soles S/.)</option>
                        </select>
                    </div>
                    <div className="col-sm-6 align-self-end">
                        <SwitchFormGroup 
                            checked={isGroup} 
                            onChange={setIsGroup} 
                            label={
                                <span>
                                    ¿Meta Grupal? (Desactivar para Personal)
                                    <FieldHelp 
                                        title="Ámbito de la Meta (¿Personal o Grupal?)" 
                                        description="Indica si la meta debe ser cumplida por el equipo completo o únicamente por el vendedor en solitario: <ul><li><b>Activado (Grupal):</b> Se suma la producción de toda la red (el vendedor + todos sus reclutas).</li><li><b>Desactivado (Personal):</b> El vendedor debe alcanzar la meta por sí mismo con sus ventas personales directas.</li></ul>" 
                                        example="Si la meta es 1,000 productos y activas 'Grupal', basta con que entre el promotor y sus 10 referidos alcancen las 1,000 productos juntos para ganar el bono."
                                    />
                                </span>
                            } 
                            refreshable={isEditing}
                        />
                    </div>
                    <div className="col-sm-6">
                        <InputFormGroup 
                            eRef={minValueRef} 
                            label={
                                <span>
                                    Valor Meta (0 si es al subir)
                                    <FieldHelp 
                                        title="Valor de la Meta" 
                                        description="Cantidad de productos o soles que deben acumularse en el mes para ganar el bono. Si el disparador es 'Al subir de Rango', puedes dejarlo en 0." 
                                        example="Coloca 1000 para exigir 1,000 productos vendidos en el periodo."
                                    />
                                </span>
                            } 
                            type="number" 
                        />
                    </div>
                    <div className="col-sm-6">
                        <InputFormGroup 
                            eRef={bonusAmountRef} 
                            label={
                                <span>
                                    Monto Bono (S/.)
                                    <FieldHelp 
                                        title="Monto del Premio en Soles (S/.)" 
                                        description="Cantidad de dinero en efectivo en Soles que se pagará y registrará como comisión aprobada cuando el vendedor califique al bono." 
                                        example="Si colocas 1500, el sistema le adjudicará S/ 1,500 en su estado de cuenta de comisiones."
                                    />
                                </span>
                            } 
                            type="number" 
                            step="0.01" 
                            required 
                        />
                    </div>
                    <div className="col-12">
                        <TextareaFormGroup 
                            eRef={descriptionRef} 
                            label={
                                <span>
                                    Descripción
                                    <FieldHelp 
                                        title="Descripción del Bono" 
                                        description="Notas informativas sobre el propósito del bono o aclaraciones adicionales sobre sus reglas." 
                                        example="'Bono mensual para equipos que superen la meta regional de 1,000 productos'."
                                    />
                                </span>
                            } 
                            rows={2} 
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Bonos Personales / Grupales">
            <RankBonuses {...properties} />
        </BaseAdminto>,
    );
});

