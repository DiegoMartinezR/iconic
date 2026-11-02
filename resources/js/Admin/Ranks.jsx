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

const ranksRest = new BasicRest();
ranksRest.path = "admin/ranks";

const Ranks = ({}) => {
    const gridRef = useRef();
    const modalRef = useRef();
    const [isEditing, setIsEditing] = useState(false);

    // Form refs
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const requirementTypeRef = useRef();
    const minPersonalRef = useRef();
    const minGroupRef = useRef();
    const requirementLogicRef = useRef();
    const commissionPercentRef = useRef();
    const prizeCommissionPercentRef = useRef();
    const bonusAmountRef = useRef();
    const benefitsRef = useRef();
    const colorRef = useRef();
    const minActiveRecruitsRef = useRef();
    const minActiveSellerAmountRef = useRef();
    const maintenanceMonthsRef = useRef();
    const lossConditionMonthsRef = useRef();
    const fixedSalaryRef = useRef();
    const minLeadersRef = useRef();
    const recruitsPerLeaderRef = useRef();

    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);
        
        if (idRef.current) idRef.current.value = data?.id || "";
        if (nameRef.current) nameRef.current.value = data?.name || "";
        if (descriptionRef.current) descriptionRef.current.value = data?.description || "";
        if (requirementTypeRef.current) requirementTypeRef.current.value = data?.requirement_type || "items";
        if (minPersonalRef.current) minPersonalRef.current.value = data?.min_personal_items || 0;
        if (minGroupRef.current) minGroupRef.current.value = data?.min_group_items || 0;
        if (requirementLogicRef.current) requirementLogicRef.current.value = data?.requirement_logic || "OR";
        if (commissionPercentRef.current) commissionPercentRef.current.value = data?.commission_percent || 0;
        if (prizeCommissionPercentRef.current) prizeCommissionPercentRef.current.value = data?.prize_commission_percent || 100;
        if (bonusAmountRef.current) bonusAmountRef.current.value = data?.bonus_amount || 0;
        if (benefitsRef.current) benefitsRef.current.value = Array.isArray(data?.benefits) ? data.benefits.join("\n") : "";
        if (colorRef.current) colorRef.current.value = data?.color || "#3bafda";
        if (minActiveRecruitsRef.current) minActiveRecruitsRef.current.value = data?.min_active_recruits || 0;
        if (minActiveSellerAmountRef.current) minActiveSellerAmountRef.current.value = data?.min_active_seller_amount || 300;
        if (maintenanceMonthsRef.current) maintenanceMonthsRef.current.value = data?.maintenance_months || 0;
        if (lossConditionMonthsRef.current) lossConditionMonthsRef.current.value = data?.loss_condition_months || 0;
        if (fixedSalaryRef.current) fixedSalaryRef.current.value = data?.fixed_salary || 0;
        if (minLeadersRef.current) minLeadersRef.current.value = data?.min_leaders || 0;
        if (recruitsPerLeaderRef.current) recruitsPerLeaderRef.current.value = data?.recruits_per_leader || 0;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        const request = {
            id: idRef.current?.value || undefined,
            name: nameRef.current?.value,
            description: descriptionRef.current?.value,
            requirement_type: requirementTypeRef.current?.value,
            min_personal_items: minPersonalRef.current?.value,
            min_group_items: minGroupRef.current?.value,
            requirement_logic: requirementLogicRef.current?.value,
            commission_percent: commissionPercentRef.current?.value,
            prize_commission_percent: prizeCommissionPercentRef.current?.value,
            bonus_amount: bonusAmountRef.current?.value,
            benefits: benefitsRef.current?.value.split("\n").filter(b => b.trim() !== ""),
            color: colorRef.current?.value,
            min_active_recruits: minActiveRecruitsRef.current?.value,
            min_active_seller_amount: minActiveSellerAmountRef.current?.value,
            maintenance_months: maintenanceMonthsRef.current?.value,
            loss_condition_months: lossConditionMonthsRef.current?.value,
            fixed_salary: fixedSalaryRef.current?.value,
            min_leaders: minLeadersRef.current?.value,
            recruits_per_leader: recruitsPerLeaderRef.current?.value,
        };

        const result = await ranksRest.save(request);
        if (result) {
            $(modalRef.current).modal("hide");
            $(gridRef.current).dxDataGrid("instance").refresh();
        }
    };

    const onDelete = async (id) => {
        const result = await ranksRest.delete(id);
        if (result) $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await ranksRest.status({ id, status: value });
        if (result) $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Configuración de Plan de Carrera (Rangos)"
                rest={ranksRest}
                withRelations="rankBonuses"
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
                            text: "Nuevo Rango",
                            hint: "Añadir un nuevo nivel al plan de carrera",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "order_index",
                        caption: "#",
                        dataType: "number",
                        width: 50,
                        sortOrder: "asc",
                        alignment: "center"
                    },
                    {
                        dataField: "name",
                        caption: "Rango",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex align-items-center">
                                    <span
                                        className="badge rounded-circle p-1 me-2"
                                        style={{
                                            backgroundColor: data.color,
                                            width: "14px",
                                            height: "14px",
                                            border: "2px solid #fff",
                                            boxShadow: "0 0 4px rgba(0,0,0,0.2)"
                                        }}
                                    ></span>
                                    <div>
                                        <div className="fw-bold text-dark">{data.name}</div>
                                        <small className="text-muted" style={{ fontSize: '10px' }}>{data.description}</small>
                                    </div>
                                </div>,
                            );
                        },
                    },
                    {
                        caption: "Metas Requeridas",
                        width: 180,
                        cellTemplate: (container, { data }) => {
                            const unit = data.requirement_type === 'items' ? 'productos' : 'puntos';
                            const parts = [];
                            if (parseFloat(data.min_personal_items) > 0) parts.push(`Pers: ${data.min_personal_items}`);
                            if (parseFloat(data.min_group_items) > 0) parts.push(`Grup: ${data.min_group_items}`);
                            
                            const text = parts.length > 1 ? parts.join(` ${data.requirement_logic} `) : (parts[0] || 'Inicia');
                            $(container).html(`<span class="badge badge-outline-secondary">${text} ${unit}</span>`);
                        }
                    },
                    {
                        caption: "Bonos Extra (Personales / Grupales)",
                        cellTemplate: (container, { data }) => {
                            const bonuses = data.rank_bonuses || [];
                            if (bonuses.length === 0) return container.text('-');
                            
                            const html = bonuses.map(b => 
                                `<div class="text-success small fw-bold mb-1">
                                    <span class="badge badge-soft-${b.is_group ? "warning" : "secondary"} me-1" style="font-size: 9px;">${b.is_group ? "Grupal" : "Personal"}</span>
                                    + S/ ${parseFloat(b.bonus_amount).toLocaleString()} (${b.min_value} ${b.type === 'items' ? 'productos' : 'puntos'})
                                </div>`
                            ).join('');
                            $(container).html(html);
                        }
                    },
                    {
                        dataField: "commission_percent",
                        caption: "% Comisión",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(container, <span className="badge badge-soft-info">{data.commission_percent}%</span>);
                        },
                    },
                    {
                        dataField: "bonus_amount",
                        caption: "Bono Fijo",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            container.text(data.bonus_amount > 0 ? `S/ ${data.bonus_amount}` : '-');
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
                                    onChange={() => onStatusChange({ id: data.id, value: !data.status })}
                                />,
                            );
                        },
                    },
                    {
                        caption: "Condiciones Especiales",
                        width: 220,
                        cellTemplate: (container, { data }) => {
                            const details = [];
                            if (data.min_active_recruits > 0) details.push(`<i class="fa fa-users text-primary me-1"></i> ${data.min_active_recruits} Reclutas`);
                            if (data.min_leaders > 0) details.push(`<i class="fa fa-star text-warning me-1"></i> ${data.min_leaders} Líderes (${data.recruits_per_leader} rec. c/u)`);
                            if (data.fixed_salary > 0) details.push(`<i class="fa fa-money-bill text-success me-1"></i> Sueldo: S/ ${data.fixed_salary}`);
                            if (data.maintenance_months > 0) details.push(`<i class="fa fa-calendar-check text-info me-1"></i> Mantener: ${data.maintenance_months} meses`);
                            if (data.loss_condition_months > 0) details.push(`<i class="fa fa-calendar-times text-danger me-1"></i> Pérdida: ${data.loss_condition_months} meses`);
                            
                            if (details.length === 0) return container.text('-');
                            $(container).html(`<div style="font-size: 11px; line-height: 1.4;">${details.join('<br>')}</div>`);
                        }
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
                            const isInitialRank = data.name?.toLowerCase().includes("promotor junior") || data.order_index == 0;
                            if (!isInitialRank) {
                                container.append(
                                    DxButton({
                                        className: "btn btn-xs btn-soft-danger",
                                        icon: "fa fa-trash",
                                        title: "Eliminar",
                                        onClick: () => onDelete(data.id),
                                    }),
                                );
                            }
                        },
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Rango" : "Crear Rango"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input type="hidden" ref={idRef} />
                <div className="row g-3">
                    <div className="col-md-8">
                        <InputFormGroup 
                            eRef={nameRef} 
                            label={
                                <span>
                                    Nombre del Rango
                                    <FieldHelp 
                                        title="Nombre del Rango" 
                                        description="Nombre comercial o institucional del rango o nivel en la carrera de ventas (ej. Promotor Junior, Senior, Manager, Director Master)." 
                                        example="Si defines 'Manager Executive', los promotores que alcancen los requisitos ostentarán ese título oficial en su perfil."
                                    />
                                </span>
                            } 
                            required 
                        />
                    </div>
                    <div className="col-md-4">
                        <InputFormGroup 
                            eRef={colorRef} 
                            label={
                                <span>
                                    Color
                                    <FieldHelp 
                                        title="Color del Rango" 
                                        description="Color identificador en formato hexadecimal (#HEX) usado para pintar badges, insignias y las tarjetas del árbol de red." 
                                        example="'#2e7d32' (verde) para rangos estándar, '#f1b44c' (dorado) para niveles directivos."
                                    />
                                </span>
                            } 
                            type="color" 
                            required 
                        />
                    </div>
                    
                    <div className="col-md-6">
                        <label className="form-label">
                            Tipo de Unidad
                            <FieldHelp 
                                title="Tipo de Unidad de Medida" 
                                description="Define si las metas de ascenso de este rango se miden por número de productos vendidos (unidades físicas) o por monto en ventas (Soles S/.)." 
                                example="Con 'Productos', una meta de 150 exige vender 150 productos. Con 'Ventas (Soles)', exige facturar S/ 150 en dinero."
                            />
                        </label>
                        <select className="form-select" ref={requirementTypeRef}>
                            <option value="items">Productos (Unidades)</option>
                            <option value="amount">Ventas (Soles S/.)</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">
                            Lógica de Requisito
                            <FieldHelp 
                                title="Lógica de Requisito (OR / AND)" 
                                description="Establece cómo se relacionan la Meta Personal y la Meta Grupal: <ul><li><b>OR (Cualquiera):</b> Asciende si cumple la Meta Personal O la Meta Grupal.</li><li><b>AND (Ambos):</b> Debe cumplir obligatoriamente AMBAS metas simultáneamente.</li></ul>" 
                                example="Si configuras 100 Personal y 500 Grupal con 'OR': un vendedor con 100 productos personales asciende aunque no tenga grupo. Con 'AND': requiere 100 personales Y 500 grupales."
                            />
                        </label>
                        <select className="form-select" ref={requirementLogicRef}>
                            <option value="OR">Cualquiera (Personal O Grupal)</option>
                            <option value="AND">Ambos (Personal Y Grupal)</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <InputFormGroup 
                            eRef={minPersonalRef} 
                            label={
                                <span>
                                    Meta Personal
                                    <FieldHelp 
                                        title="Meta Personal" 
                                        description="Volumen mínimo (en productos o en Soles) que debe vender el promotor por su cuenta directa." 
                                        example="Si colocas 150, el promotor debe generar al menos 150 productos vendidos con sus propios enlaces para calificar."
                                    />
                                </span>
                            } 
                            type="number" 
                            step="0.01" 
                        />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup 
                            eRef={minGroupRef} 
                            label={
                                <span>
                                    Meta Grupal (Equipo)
                                    <FieldHelp 
                                        title="Meta Grupal (Equipo)" 
                                        description="Volumen total acumulado generado por toda la red descendente del vendedor (suma de sus ventas personales más las de todos sus referidos directos e indirectos)." 
                                        example="Si pones 1,000 productos grupales, el promotor y todo su equipo deben acumular al menos 1,000 productos en conjunto."
                                    />
                                </span>
                            } 
                            type="number" 
                            step="0.01" 
                        />
                    </div>

                    <div className="col-md-4">
                        <InputFormGroup 
                            eRef={commissionPercentRef} 
                            label={
                                <span>
                                    % Comis. Venta
                                    <FieldHelp 
                                        title="% Comisión por Venta Ordinaria" 
                                        description="Porcentaje de ganancia que gana el vendedor por cada producto regular vendido mientras ostente este rango." 
                                        example="Con 25%: Por una venta regular de S/ 100, el promotor se adjudica S/ 25 de comisión aprobada."
                                    />
                                </span>
                            } 
                            type="number" 
                            step="0.01" 
                            required 
                        />
                    </div>
                    <div className="col-md-4">
                        <InputFormGroup 
                            eRef={prizeCommissionPercentRef} 
                            label={
                                <span>
                                    % Comis. Bono
                                    <FieldHelp 
                                        title="% Comisión de Bono/Premio (Bóveda)" 
                                        description="Porcentaje de comisión que recibe el vendedor cuando vende un producto que tenía almacenado en su Bóveda de Premios (productos regalados o ganados como premio)." 
                                        example="Fijado en 100%: Si vende un producto de S/ 100 que tenía en su Bóveda de Premios, recibe el 100% (S/ 100), monetizando íntegramente su regalo."
                                    />
                                </span>
                            } 
                            type="number" 
                            step="0.01" 
                            required 
                        />
                    </div>
                    <div className="col-md-4">
                        <InputFormGroup 
                            eRef={bonusAmountRef} 
                            label={
                                <span>
                                    Bono Fijo (S/.)
                                    <FieldHelp 
                                        title="Bono Fijo por Ascenso (S/.)" 
                                        description="Recompensa en dinero en efectivo que se entrega por única vez de manera automática al vendedor en el instante en que asciende a este rango." 
                                        example="Si colocas 500, al subir a este nivel se genera una comisión instantánea de S/ 500 aprobada en su cuenta."
                                    />
                                </span>
                            } 
                            type="number" 
                            step="0.01" 
                        />
                    </div>

                    <hr className="my-2" />
                    <h5 className="mb-0 text-primary">Requisitos de Red y Mantenimiento</h5>

                    <div className="col-md-4">
                        <InputFormGroup 
                            eRef={minActiveRecruitsRef} 
                            label={
                                <span>
                                    Reclutas Activos
                                    <FieldHelp 
                                        title="Reclutas Activos Requeridos" 
                                        description="Número mínimo de referidos directos que el promotor debe tener calificados como activos durante el mes." 
                                        example="Si colocas 10, el promotor debe tener al menos 10 reclutas directos que hayan comprado en el mes el monto mínimo requerido."
                                    />
                                </span>
                            } 
                            type="number" 
                        />
                    </div>
                    <div className="col-md-4">
                        <InputFormGroup 
                            eRef={minActiveSellerAmountRef} 
                            label={
                                <span>
                                    Mín. Venta Activo (S/.)
                                    <FieldHelp 
                                        title="Monto Mínimo para Vendedor Activo (S/.)" 
                                        description="Monto mínimo de compras o ventas pagadas en el mes que debe registrar un referido directo para ser considerado como 'Activo'." 
                                        example="Con S/ 300: Un recluta que compró S/ 350 cuenta como 1 activo; un recluta que compró S/ 100 no califica como activo."
                                    />
                                </span>
                            } 
                            type="number" 
                            step="0.01" 
                        />
                    </div>
                    <div className="col-md-4">
                        <InputFormGroup 
                            eRef={fixedSalaryRef} 
                            label={
                                <span>
                                    Sueldo Fijo (S/.)
                                    <FieldHelp 
                                        title="Sueldo Fijo Mensual (S/.)" 
                                        description="Remuneración base mensual asignada a este rango para puestos de alta dirección o gestión regional." 
                                        example="Para un 'Director Asociado', un sueldo fijo de S/ 2,000 mensuales adicional a sus comisiones de ventas."
                                    />
                                </span>
                            } 
                            type="number" 
                            step="0.01" 
                        />
                    </div>

                    <div className="col-md-3">
                        <InputFormGroup 
                            eRef={minLeadersRef} 
                            label={
                                <span>
                                    Cant. Líderes
                                    <FieldHelp 
                                        title="Cantidad de Líderes Requeridos" 
                                        description="Número de referidos directos que deben haber construido su propio equipo y calificar como líderes." 
                                        example="Si indicas 3, el promotor debe contar con 3 referidos directos que a su vez lideren sus propios grupos de venta."
                                    />
                                </span>
                            } 
                            type="number" 
                        />
                    </div>
                    <div className="col-md-3">
                        <InputFormGroup 
                            eRef={recruitsPerLeaderRef} 
                            label={
                                <span>
                                    Reclutas x Líder
                                    <FieldHelp 
                                        title="Reclutas Mínimos por cada Líder" 
                                        description="Tamaño mínimo de la organización descendente que debe tener un referido directo para calificar como líder válido." 
                                        example="Si pones 10, un referido directo solo cuenta como líder si su red tiene al menos 10 vendedores."
                                    />
                                </span>
                            } 
                            type="number" 
                        />
                    </div>
                    <div className="col-md-3">
                        <InputFormGroup 
                            eRef={maintenanceMonthsRef} 
                            label={
                                <span>
                                    Meses Mantención
                                    <FieldHelp 
                                        title="Meses de Mantención Requeridos" 
                                        description="Número de meses consecutivos durante los cuales el promotor debe sostener las metas antes de consolidar el ascenso oficial." 
                                        example="Si fijas 3 meses, el promotor debe cumplir los requisitos durante 3 meses seguidos para subir permanentemente."
                                    />
                                </span>
                            } 
                            type="number" 
                        />
                    </div>
                    <div className="col-md-3">
                        <InputFormGroup 
                            eRef={lossConditionMonthsRef} 
                            label={
                                <span>
                                    Meses Pérdida
                                    <FieldHelp 
                                        title="Meses de Gracia / Pérdida de Rango" 
                                        description="Cantidad de meses de gracia que se le permite al vendedor sin alcanzar la meta antes de degradar o descender su rango." 
                                        example="Con 2 meses: si no cumple en enero y febrero sigue en el rango; pero si tampoco cumple en marzo, el sistema lo degrada."
                                    />
                                </span>
                            } 
                            type="number" 
                        />
                    </div>

                    <hr className="my-2" />

                    <div className="col-12">
                        <TextareaFormGroup 
                            eRef={benefitsRef} 
                            label={
                                <span>
                                    Beneficios Extra (Uno por línea)
                                    <FieldHelp 
                                        title="Beneficios Extra del Rango" 
                                        description="Listado de incentivos, reconocimientos o privilegios no monetarios que se muestran en el perfil del vendedor (un beneficio por renglón)." 
                                        example="Capacitaciones VIP exclusivas\nLínea de crédito comercial\nInsignia dorada en catálogo"
                                    />
                                </span>
                            } 
                            rows={3} 
                        />
                    </div>
                    <div className="col-12">
                        <TextareaFormGroup 
                            eRef={descriptionRef} 
                            label={
                                <span>
                                    Descripción Interna
                                    <FieldHelp 
                                        title="Descripción Interna" 
                                        description="Anotación o resumen interno para los administradores sobre el perfil y propósito del rango." 
                                        example="Nivel de consolidación para vendedores con red activa en provincias."
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
        <BaseAdminto {...properties} title="Configuración de Rangos">
            <Ranks {...properties} />
        </BaseAdminto>,
    );
});
