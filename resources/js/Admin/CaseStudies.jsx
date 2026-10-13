import BaseAdminto from "@Adminto/Base";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import CaseStudiesRest from "../Actions/Admin/CaseStudiesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import SetSelectValue from "../Utils/SetSelectValue";
import getYTVideoId from "../Utils/getYTVideoId";

const caseStudiesRest = new CaseStudiesRest();

const CaseStudies = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements refs
    const idRef = useRef();
    const projectRef = useRef();
    const nameRef = useRef();
    const slugRef = useRef();
    const summaryRef = useRef();
    const descriptionRef = useRef();
    const clientRef = useRef();
    const impactRef = useRef();
    const beforeRef = useRef();
    const afterRef = useRef();
    const authorRef = useRef();
    const challengeRef = useRef();
    const solutionRef = useRef();
    const videoUrlRef = useRef();
    const imageRef = useRef();
    const backgroundImageRef = useRef();
    const featuredRef = useRef();
    const visibleRef = useRef();

    // SEO refs
    const metaTitleRef = useRef();
    const metaDescriptionRef = useRef();
    const metaKeywordsRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [videoPreview, setVideoPreview] = useState('');

    // Dynamic JSON Arrays States
    const [caseStudyIndicators, setCaseStudyIndicators] = useState([]);
    const [caseStudyStrengths, setCaseStudyStrengths] = useState([]);
    const [caseStudySteps, setCaseStudySteps] = useState([]);
    const [caseStudyFaqs, setCaseStudyFaqs] = useState([]);

    /*****************************/
    /* Indicators Dynamic Arrays */
    /*****************************/
    const addIndicator = () => setCaseStudyIndicators([...caseStudyIndicators, { image: "", name: "", description: "" }]);
    const updateIndicator = (index, field, value) => {
        const newItems = [...caseStudyIndicators];
        newItems[index][field] = value;
        setCaseStudyIndicators(newItems);
    };
    const handleIndicatorImageChange = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateIndicator(index, "image", reader.result);
        reader.readAsDataURL(file);
    };
    const removeIndicator = (index) => setCaseStudyIndicators(caseStudyIndicators.filter((_, i) => i !== index));

    /****************************/
    /* Strengths Dynamic Arrays */
    /****************************/
    const addStrength = () => setCaseStudyStrengths([...caseStudyStrengths, { image: "", name: "", description: "" }]);
    const updateStrength = (index, field, value) => {
        const newItems = [...caseStudyStrengths];
        newItems[index][field] = value;
        setCaseStudyStrengths(newItems);
    };
    const handleStrengthImageChange = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateStrength(index, "image", reader.result);
        reader.readAsDataURL(file);
    };
    const removeStrength = (index) => setCaseStudyStrengths(caseStudyStrengths.filter((_, i) => i !== index));

    /************************/
    /* Steps Dynamic Arrays */
    /************************/
    const addStep = () => setCaseStudySteps([...caseStudySteps, { step_number: String(caseStudySteps.length + 1).padStart(2, "0"), image: "", name: "", description: "" }]);
    const updateStep = (index, field, value) => {
        const newItems = [...caseStudySteps];
        newItems[index][field] = value;
        setCaseStudySteps(newItems);
    };
    const handleStepImageChange = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateStep(index, "image", reader.result);
        reader.readAsDataURL(file);
    };
    const removeStep = (index) => setCaseStudySteps(caseStudySteps.filter((_, i) => i !== index));

    /***********************/
    /* FAQs Dynamic Arrays */
    /***********************/
    const addFaq = () => setCaseStudyFaqs([...caseStudyFaqs, { question: "", answer: "" }]);
    const updateFaq = (index, field, value) => {
        const newItems = [...caseStudyFaqs];
        newItems[index][field] = value;
        setCaseStudyFaqs(newItems);
    };
    const removeFaq = (index) => setCaseStudyFaqs(caseStudyFaqs.filter((_, i) => i !== index));

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();

        idRef.current.value = data?.id ?? "";
        if (data?.project) {
            SetSelectValue(projectRef.current, data.project.id, data.project.name);
        } else if (data?.project_id) {
            SetSelectValue(projectRef.current, data.project_id);
        } else {
            SetSelectValue(projectRef.current, null);
        }

        nameRef.current.value = data?.name ?? "";
        slugRef.current.value = data?.slug ?? "";
        summaryRef.current.value = data?.summary ?? "";
        descriptionRef.current.value = data?.description ?? "";
        clientRef.current.value = data?.client ?? "";
        impactRef.current.value = data?.impact ?? "";
        beforeRef.current.value = data?.before ?? "";
        afterRef.current.value = data?.after ?? "";
        authorRef.current.value = data?.author ?? "";

        if (challengeRef.current?.setValue) challengeRef.current.setValue(data?.challenge ?? "");
        else if (challengeRef.current) challengeRef.current.value = data?.challenge ?? "";

        if (solutionRef.current?.setValue) solutionRef.current.setValue(data?.solution ?? "");
        else if (solutionRef.current) solutionRef.current.value = data?.solution ?? "";

        videoUrlRef.current.value = data?.video_url ?? "";
        setVideoPreview(getYTVideoId(data?.video_url) || '');

        imageRef.image.src = data?.image ? `/storage/images/case_study/${data.image}` : '';
        imageRef.current.value = null;

        if (backgroundImageRef.current) {
            backgroundImageRef.image.src = data?.background_image ? `/storage/images/case_study/${data.background_image}` : '';
            backgroundImageRef.current.value = null;
        }

        if (featuredRef.current) featuredRef.current.checked = data?.featured ?? false;
        if (visibleRef.current) visibleRef.current.checked = data?.visible ?? true;

        metaTitleRef.current.value = data?.meta_title ?? "";
        metaDescriptionRef.current.value = data?.meta_description ?? "";
        metaKeywordsRef.current.value = data?.meta_keywords ?? "";

        // Parse JSON arrays safely
        try { setCaseStudyIndicators(typeof data?.indicators === 'string' ? JSON.parse(data.indicators) : (data?.indicators || [])); } catch (e) { setCaseStudyIndicators([]); }
        try { setCaseStudyStrengths(typeof data?.strengths === 'string' ? JSON.parse(data.strengths) : (data?.strengths || [])); } catch (e) { setCaseStudyStrengths([]); }
        try { setCaseStudySteps(typeof data?.steps === 'string' ? JSON.parse(data.steps) : (data?.steps || [])); } catch (e) { setCaseStudySteps([]); }
        try { setCaseStudyFaqs(typeof data?.faqs === 'string' ? JSON.parse(data.faqs) : (data?.faqs || [])); } catch (e) { setCaseStudyFaqs([]); }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            project_id: projectRef.current.value || undefined,
            name: nameRef.current.value,
            slug: slugRef.current.value,
            summary: summaryRef.current.value,
            description: descriptionRef.current.value,
            client: clientRef.current.value,
            impact: impactRef.current.value,
            before: beforeRef.current.value,
            after: afterRef.current.value,
            author: authorRef.current.value,
            featured: featuredRef.current?.checked ? 1 : 0,
            visible: visibleRef.current?.checked ? 1 : 0,
            challenge: challengeRef.current?.getValue ? challengeRef.current.getValue() : challengeRef.current?.value || '',
            solution: solutionRef.current?.getValue ? solutionRef.current.getValue() : solutionRef.current?.value || '',
            video_url: videoUrlRef.current.value,
            indicators: JSON.stringify(caseStudyIndicators.filter(i => i.name?.trim() || i.image)),
            strengths: JSON.stringify(caseStudyStrengths.filter(s => s.name?.trim() || s.image)),
            steps: JSON.stringify(caseStudySteps.filter(st => st.name?.trim() || st.image)),
            faqs: JSON.stringify(caseStudyFaqs.filter(f => f.question?.trim() && f.answer?.trim())),
            meta_title: metaTitleRef.current.value,
            meta_description: metaDescriptionRef.current.value,
            meta_keywords: metaKeywordsRef.current.value,
        };

        const formData = new FormData();
        for (const key in request) {
            if (request[key] !== undefined && request[key] !== null) {
                formData.append(key, request[key]);
            }
        }

        const file = imageRef.current.files[0];
        if (file) formData.append('image', file);
        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) formData.append('image_delete', 'DELETE');

        const bgFile = backgroundImageRef.current?.files?.[0];
        if (bgFile) formData.append('background_image', bgFile);
        if (backgroundImageRef.getDeleteFlag && backgroundImageRef.getDeleteFlag()) formData.append('background_image_delete', 'DELETE');

        const result = await caseStudiesRest.save(formData);
        if (!result) return;

        $(modalRef.current).modal("hide");
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async (e, row) => {
        const result = await caseStudiesRest.boolean({
            id: row.id,
            field: "visible",
            value: e.target.checked,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onFeaturedChange = async (e, row) => {
        const result = await caseStudiesRest.boolean({
            id: row.id,
            field: "featured",
            value: e.target.checked,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const res = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!res.isConfirmed) return;

        const result = await caseStudiesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onReorder = async (e) => {
        const instance = $(gridRef.current).dxDataGrid("instance");
        const visibleRows = instance.getVisibleRows();
        const toIndex = visibleRows[e.toIndex].data.order_index;
        const fromIndex = visibleRows[e.fromIndex].data.order_index;

        const result = await caseStudiesRest.reorder({
            from: fromIndex,
            to: toIndex,
        });
        if (!result) return;
        instance.refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Casos de Éxito"
                rest={caseStudiesRest}
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
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                exportable={true}
                exportableName="Casos de Éxito"
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    showDragIcons: true,
                }}
                sorting={{ mode: "single" }}
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
                        dataField: "image",
                        caption: "Portada",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            const src = data.image
                                ? `/storage/images/case_study/${data.image}`
                                : "/assets/images/placeholder.png";
                            container.html(
                                `<img src="${src}" class="rounded object-fit-cover" style="width: 80px; height: 48px; object-fit: cover; object-position: center; border-radius: 4px;" />`
                            );
                        },
                    },
                    {
                        dataField: "name",
                        caption: "Caso de Éxito",
                        minWidth: "250px",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                `<b>${data.name}</b>${data.client ? `<br/><small class="text-muted"><i class="fas fa-building me-1"></i>${data.client}</small>` : ''}`
                            );
                        }
                    },
                    {
                        dataField: "impact",
                        caption: "Métrica / Impacto",
                        width: "180px",
                        cellTemplate: (container, { data }) => {
                            const val = data.impact || '-';
                            container.html(
                                `<span class="badge bg-primary text-wrap">${val}</span>`
                            );
                        }
                    },
                    {
                        dataField: "project.name",
                        caption: "Proyecto",
                        width: "150px",
                        cellTemplate: (container, { data }) => {
                            container.text(data.project?.name || "Sin proyecto");
                        },
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "90px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={(e) => onVisibleChange(e, data)}
                                />
                            );
                        },
                    },
                    {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: "90px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.featured == 1}
                                    onChange={(e) => onFeaturedChange(e, data)}
                                />
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: "120px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            );
                        },
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Caso de Estudio" : "Nuevo Caso de Estudio"}
                size="xl"
                onSubmit={onModalSubmit}
            >
                <input ref={idRef} type="hidden" />

                {/* Tabs Navigation */}
                <ul className="nav nav-pills flex-wrap bg-light rounded mb-3 p-2 gap-1" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="tab" href="#info-tab" role="tab">
                            <i className="fas fa-file-alt me-1"></i> <span>1. Información</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#challenge-tab" role="tab">
                            <i className="fas fa-exchange-alt me-1"></i> <span>2. Desafío & Solución</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#indicators-tab" role="tab">
                            <i className="fas fa-tachometer-alt me-1"></i> <span>3. Indicadores</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#strengths-tab" role="tab">
                            <i className="fas fa-shield-alt me-1"></i> <span>4. Fortalezas</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#steps-tab" role="tab">
                            <i className="fas fa-list-ol me-1"></i> <span>5. Proceso</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#faqs-tab" role="tab">
                            <i className="fas fa-question-circle me-1"></i> <span>6. FAQs</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#media-tab" role="tab">
                            <i className="fas fa-images me-1"></i> <span>7. Multimedia</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#seo-tab" role="tab">
                            <i className="fas fa-search me-1"></i> <span>8. SEO</span>
                        </a>
                    </li>
                </ul>

                {/* Tabs Content */}
                <div className="tab-content" id="principal-container">
                    {/* Tab 1: Información */}
                    <div className="tab-pane fade show active" id="info-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body">
                                <InputFormGroup
                                    eRef={nameRef}
                                    label="Título del Caso de Estudio"
                                    required
                                    placeholder="Ej: Transformación Digital e-Commerce para Corporación Retail"
                                    helpText="Un título descriptivo y enfocado en el resultado del proyecto"
                                    onChange={(e) => {
                                        if (!isEditing && slugRef.current) {
                                            slugRef.current.value = e.target.value
                                                .toLowerCase()
                                                .trim()
                                                .replace(/[^\w\s-]/g, '')
                                                .replace(/[\s_-]+/g, '-')
                                                .replace(/^-+|-+$/g, '');
                                        }
                                    }}
                                />
                                <div className="row">
                                    <div className="col-md-6">
                                        <SelectAPIFormGroup
                                            eRef={projectRef}
                                            searchAPI="/api/admin/projects/paginate"
                                            searchBy="name"
                                            label="Proyecto Asociado (Opcional)"
                                            dropdownParent="#principal-container"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={clientRef}
                                            label="Cliente / Empresa"
                                            placeholder="Ej: Corporación Retail Líder"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InputFormGroup
                                            eRef={impactRef}
                                            label="Métrica de Impacto Principal (Hero Highlight)"
                                            placeholder="Ej: +215% Ventas Digitales | 3.5x ROI"
                                            helpText="Aparecerá en gigante en la cabecera del caso de éxito"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <SwitchFormGroup
                                            eRef={featuredRef}
                                            label="Marcar como Caso Destacado"
                                            helpText="Muestra este caso de éxito en la sección destacada de la página principal"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <SwitchFormGroup
                                            eRef={visibleRef}
                                            label="Visible en la Web"
                                            helpText="Controla la visibilidad pública del caso de éxito"
                                        />
                                    </div>
                                </div>
                                <TextareaFormGroup
                                    eRef={summaryRef}
                                    label="Resumen Ejecutivo"
                                    rows={3}
                                    placeholder="Un breve resumen ejecutivo de 2 a 3 líneas sobre el caso..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab 2: Desafío & Solución */}
                    <div className="tab-pane fade" id="challenge-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={beforeRef}
                                            label="Antes (Problema / Métrica previa)"
                                            placeholder="Ej: 4.2s tiempo de carga | 1.2% conversión"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={afterRef}
                                            label="Después (Resultado alcanzado)"
                                            placeholder="Ej: 0.8s tiempo de carga | 3.8% conversión"
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold"><i className="fas fa-exclamation-triangle text-warning me-1"></i> El Desafío (The Challenge)</label>
                                        <QuillFormGroup eRef={challengeRef} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold"><i className="fas fa-lightbulb text-success me-1"></i> La Solución Implementada (The Solution)</label>
                                        <QuillFormGroup eRef={solutionRef} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={authorRef}
                                            label="Autor / Cargo del Testimonio"
                                            placeholder="Ej: Director de E-commerce & Tecnología"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TextareaFormGroup
                                            eRef={descriptionRef}
                                            label="Cita / Testimonio del Cliente"
                                            rows={3}
                                            placeholder="Testimonio textual del cliente sobre los resultados con Rhino..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab 3: Indicadores (KPIs) (ESTILO PROYECTOS / SERVICIOS) */}
                    <div className="tab-pane fade" id="indicators-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 font-bold text-dark">
                                    <i className="fas fa-tachometer-alt me-2 text-primary"></i> Indicadores y Métricas Rápidas
                                </h6>
                                <button type="button" className="btn btn-sm btn-primary rounded-pill" onClick={addIndicator}>
                                    <i className="fas fa-plus me-1"></i> Agregar Indicador
                                </button>
                            </div>
                            <div className="card-body">
                                {caseStudyIndicators.length === 0 ? (
                                    <p className="text-muted small mb-0 text-center py-3">No hay indicadores agregados. Haz clic en "Agregar Indicador".</p>
                                ) : (
                                    <div className="row g-3">
                                        {caseStudyIndicators.map((item, idx) => (
                                            <div key={idx} className="col-md-6">
                                                <div className="border rounded p-3 bg-light position-relative">
                                                    <button
                                                        type="button"
                                                        className="btn-close position-absolute top-0 end-0 m-2"
                                                        style={{ zIndex: 10 }}
                                                        onClick={() => removeIndicator(idx)}
                                                    ></button>
                                                    <div className="row g-3 align-items-center">
                                                        <div className="col-4">
                                                            <label className="form-label small font-bold d-block mb-1">Imagen / Ícono</label>
                                                            <div
                                                                className="position-relative border rounded overflow-hidden bg-white d-flex align-items-center justify-content-center"
                                                                style={{ aspectRatio: "1/1", minHeight: "90px" }}
                                                            >
                                                                {item.image ? (
                                                                    <img
                                                                        src={item.image.startsWith('data:') || item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/storage/images/case_study/${item.image}`}
                                                                        alt="preview"
                                                                        className="w-100 h-100 object-fit-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="text-center text-muted p-2">
                                                                        <i className="fas fa-cloud-upload-alt fa-2x mb-1 d-block text-primary"></i>
                                                                        <span style={{ fontSize: "10px" }}>Subir Imagen</span>
                                                                    </div>
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                                                    onChange={(e) => handleIndicatorImageChange(idx, e.target.files[0])}
                                                                    title="Seleccionar imagen"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="mb-2">
                                                                <label className="form-label small font-bold mb-1">Título / Métrica</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={item.name || ''}
                                                                    onChange={(e) => updateIndicator(idx, 'name', e.target.value)}
                                                                    placeholder="Ej: +215% Ventas Digitales"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="form-label small font-bold mb-1">Descripción / Detalle</label>
                                                                <textarea
                                                                    className="form-control form-control-sm"
                                                                    rows="3"
                                                                    value={item.description || ''}
                                                                    onChange={(e) => updateIndicator(idx, 'description', e.target.value)}
                                                                    placeholder="Ej: Aumento del volumen de compras..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab 4: Fortalezas (ESTILO PROYECTOS / SERVICIOS) */}
                    <div className="tab-pane fade" id="strengths-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 font-bold text-dark">
                                    <i className="fas fa-shield-alt me-2 text-success"></i> Fortalezas y Diferenciales Clave
                                </h6>
                                <button type="button" className="btn btn-sm btn-success rounded-pill" onClick={addStrength}>
                                    <i className="fas fa-plus me-1"></i> Agregar Fortaleza
                                </button>
                            </div>
                            <div className="card-body">
                                {caseStudyStrengths.length === 0 ? (
                                    <p className="text-muted small mb-0 text-center py-3">No hay fortalezas agregadas. Haz clic en "Agregar Fortaleza".</p>
                                ) : (
                                    <div className="row g-3">
                                        {caseStudyStrengths.map((item, idx) => (
                                            <div key={idx} className="col-md-6">
                                                <div className="border rounded p-3 bg-light position-relative">
                                                    <button
                                                        type="button"
                                                        className="btn-close position-absolute top-0 end-0 m-2"
                                                        style={{ zIndex: 10 }}
                                                        onClick={() => removeStrength(idx)}
                                                    ></button>
                                                    <div className="row g-3 align-items-center">
                                                        <div className="col-4">
                                                            <label className="form-label small font-bold d-block mb-1">Imagen / Ícono</label>
                                                            <div
                                                                className="position-relative border rounded overflow-hidden bg-white d-flex align-items-center justify-content-center"
                                                                style={{ aspectRatio: "1/1", minHeight: "90px" }}
                                                            >
                                                                {item.image ? (
                                                                    <img
                                                                        src={item.image.startsWith('data:') || item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/storage/images/case_study/${item.image}`}
                                                                        alt="preview"
                                                                        className="w-100 h-100 object-fit-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="text-center text-muted p-2">
                                                                        <i className="fas fa-cloud-upload-alt fa-2x mb-1 d-block text-success"></i>
                                                                        <span style={{ fontSize: "10px" }}>Subir Imagen</span>
                                                                    </div>
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                                                    onChange={(e) => handleStrengthImageChange(idx, e.target.files[0])}
                                                                    title="Seleccionar imagen"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="mb-2">
                                                                <label className="form-label small font-bold mb-1">Título / Fortaleza</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={item.name || ''}
                                                                    onChange={(e) => updateStrength(idx, 'name', e.target.value)}
                                                                    placeholder="Ej: Arquitectura Escalable"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="form-label small font-bold mb-1">Descripción</label>
                                                                <textarea
                                                                    className="form-control form-control-sm"
                                                                    rows="3"
                                                                    value={item.description || ''}
                                                                    onChange={(e) => updateStrength(idx, 'description', e.target.value)}
                                                                    placeholder="Explicación detallada..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab 5: Proceso de Trabajo (Steps) (ESTILO PROYECTOS / SERVICIOS) */}
                    <div className="tab-pane fade" id="steps-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 font-bold text-dark">
                                    <i className="fas fa-list-ol me-2 text-info"></i> Proceso de Trabajo (Etapas / Steps)
                                </h6>
                                <button type="button" className="btn btn-sm btn-info text-white rounded-pill" onClick={addStep}>
                                    <i className="fas fa-plus me-1"></i> Agregar Paso
                                </button>
                            </div>
                            <div className="card-body">
                                {caseStudySteps.length === 0 ? (
                                    <p className="text-muted small mb-0 text-center py-3">No hay pasos agregados. Haz clic en "Agregar Paso".</p>
                                ) : (
                                    <div className="row g-3">
                                        {caseStudySteps.map((item, idx) => (
                                            <div key={idx} className="col-md-6">
                                                <div className="border rounded p-3 bg-light position-relative">
                                                    <button
                                                        type="button"
                                                        className="btn-close position-absolute top-0 end-0 m-2"
                                                        style={{ zIndex: 10 }}
                                                        onClick={() => removeStep(idx)}
                                                    ></button>
                                                    <div className="row g-3 align-items-center">
                                                        <div className="col-4">
                                                            <label className="form-label small font-bold d-block mb-1">Imagen Etapa</label>
                                                            <div
                                                                className="position-relative border rounded overflow-hidden bg-white d-flex align-items-center justify-content-center"
                                                                style={{ aspectRatio: "1/1", minHeight: "90px" }}
                                                            >
                                                                {item.image ? (
                                                                    <img
                                                                        src={item.image.startsWith('data:') || item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/storage/images/case_study/${item.image}`}
                                                                        alt="preview"
                                                                        className="w-100 h-100 object-fit-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="text-center text-muted p-2">
                                                                        <i className="fas fa-cloud-upload-alt fa-2x mb-1 d-block text-info"></i>
                                                                        <span style={{ fontSize: "10px" }}>Subir Imagen</span>
                                                                    </div>
                                                                )}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                                                                    onChange={(e) => handleStepImageChange(idx, e.target.files[0])}
                                                                    title="Seleccionar imagen de la etapa"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="row g-2 mb-2">
                                                                <div className="col-4">
                                                                    <label className="form-label small font-bold mb-1">Paso #</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        value={item.step_number || ''}
                                                                        onChange={(e) => updateStep(idx, 'step_number', e.target.value)}
                                                                        placeholder="01"
                                                                    />
                                                                </div>
                                                                <div className="col-8">
                                                                    <label className="form-label small font-bold mb-1">Título Paso</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        value={item.name || ''}
                                                                        onChange={(e) => updateStep(idx, 'name', e.target.value)}
                                                                        placeholder="Ej: Discovery & Strategy"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="form-label small font-bold mb-1">Descripción</label>
                                                                <textarea
                                                                    className="form-control form-control-sm"
                                                                    rows="2"
                                                                    value={item.description || ''}
                                                                    onChange={(e) => updateStep(idx, 'description', e.target.value)}
                                                                    placeholder="Explicación breve..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab 6: FAQs */}
                    <div className="tab-pane fade" id="faqs-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 font-bold"><i className="fas fa-question-circle text-primary me-2"></i> Preguntas Frecuentes (FAQs)</h6>
                                <button type="button" className="btn btn-sm btn-primary rounded-pill" onClick={addFaq}>
                                    <i className="fas fa-plus me-1"></i> Agregar FAQ
                                </button>
                            </div>
                            <div className="card-body">
                                {caseStudyFaqs.length === 0 ? (
                                    <p className="text-muted text-center my-3 font-13">No hay preguntas frecuentes registradas.</p>
                                ) : (
                                    caseStudyFaqs.map((faq, index) => (
                                        <div key={index} className="p-3 border rounded mb-3 bg-light">
                                            <div className="d-flex justify-content-between mb-2">
                                                <strong className="text-primary">FAQ #{index + 1}</strong>
                                                <button type="button" className="btn btn-xs btn-danger" onClick={() => removeFaq(index)}><i className="fas fa-trash"></i></button>
                                            </div>
                                            <input type="text" className="form-control form-control-sm mb-2" placeholder="Pregunta" value={faq.question} onChange={(e) => updateFaq(index, "question", e.target.value)} />
                                            <textarea className="form-control form-control-sm" rows={2} placeholder="Respuesta" value={faq.answer} onChange={(e) => updateFaq(index, "answer", e.target.value)}></textarea>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab 7: Multimedia */}
                    <div className="tab-pane fade" id="media-tab" role="tabpanel">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm mb-3">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0 font-bold"><i className="fas fa-image text-success me-2"></i> Imágenes del Caso</h6>
                                    </div>
                                    <div className="card-body space-y-3">
                                        <ImageFormGroup eRef={imageRef} label="Imagen Principal (Portada)" aspect={16 / 9} />
                                        <hr />
                                        <ImageFormGroup eRef={backgroundImageRef} label="Imagen de Fondo (Hero Banner)" aspect={16 / 9} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm mb-3">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0 font-bold"><i className="fab fa-youtube text-danger me-2"></i> Video Demo</h6>
                                    </div>
                                    <div className="card-body">
                                        <InputFormGroup eRef={videoUrlRef} label="URL del Video (YouTube)" placeholder="https://www.youtube.com/watch?v=..." onChange={(e) => setVideoPreview(getYTVideoId(e.target.value) || '')} />
                                        {videoPreview && (
                                            <div className="mt-2">
                                                <div className="ratio ratio-16x9 rounded overflow-hidden border">
                                                    <iframe src={`https://www.youtube.com/embed/${videoPreview}`} title="Video preview" allowFullScreen />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab 8: SEO y Metadatos (PESTAÑA DEDICADA EXCLUSIVA PARA SEO) */}
                    <div className="tab-pane fade" id="seo-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-light">
                                <h6 className="mb-0 font-bold text-dark"><i className="fas fa-search me-2 text-info"></i> Metadatos SEO y Posicionamiento</h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="fas fa-link me-1 text-primary"></i>
                                        Slug (URL amigable)
                                    </label>
                                    <div className="input-group">
                                        <input
                                            ref={slugRef}
                                            type="text"
                                            className="form-control"
                                            placeholder="ej: transformacion-digital-retail"
                                            style={{ fontFamily: "monospace", fontSize: "13px" }}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                    .toLowerCase()
                                                    .normalize("NFD")
                                                    .replace(/[\u0300-\u036f]/g, "")
                                                    .replace(/[^a-z0-9-]/g, "-")
                                                    .replace(/-+/g, "-");
                                                e.target.value = val;
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            title="Copiar slug"
                                            onClick={() => {
                                                if (slugRef.current?.value) {
                                                    navigator.clipboard.writeText(slugRef.current.value);
                                                }
                                            }}
                                        >
                                            <i className="fas fa-copy"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            title="Re-generar desde el título"
                                            onClick={() => {
                                                if (nameRef.current && slugRef.current) {
                                                    const generated = nameRef.current.value
                                                        .toLowerCase()
                                                        .normalize("NFD")
                                                        .replace(/[\u0300-\u036f]/g, "")
                                                        .replace(/[^a-z0-9\s-]/g, "")
                                                        .trim()
                                                        .replace(/\s+/g, "-");
                                                    slugRef.current.value = generated;
                                                }
                                            }}
                                        >
                                            <i className="fas fa-sync-alt"></i>
                                        </button>
                                    </div>
                                    <small className="text-muted">Utilizado para generar la URL amigable en la vista pública.</small>
                                </div>

                                <InputFormGroup eRef={metaTitleRef} label="Meta Title (Título SEO)" placeholder="Título optimizado para buscadores..." />
                                <TextareaFormGroup eRef={metaDescriptionRef} label="Meta Description (Descripción SEO)" rows={3} placeholder="Descripción de 150-160 caracteres para motores de búsqueda..." />
                                <InputFormGroup eRef={metaKeywordsRef} label="Meta Keywords (Palabras Clave)" placeholder="ej: caso de éxito, ecommerce, retail, transformacion digital" />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Casos de Éxito & Estudios de Caso">
            <CaseStudies {...properties} />
        </BaseAdminto>
    );
});
