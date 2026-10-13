import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import React, { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import ProjectsRest from "../Actions/Admin/ProjectsRest";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import SetSelectValue from "../Utils/SetSelectValue";
import Fillable from "../Utils/Fillable";
import TechnologiesRest from '../Actions/Admin/TechnologiesRest';

const projectsRest = new ProjectsRest();

const Projects = ({ project_categories = [], service_categories = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Data for selectors
    const [technologies, setTechnologies] = useState([]);

    // Form refs
    const idRef = useRef();
    const categoryRef = useRef();
    const nameRef = useRef();
    const slugRef = useRef();
    const clientRef = useRef();
    const locationRef = useRef();
    const dateRef = useRef();
    const summaryRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();
    const backgroundImageRef = useRef();

    // SEO refs
    const metaTitleRef = useRef();
    const metaDescriptionRef = useRef();
    const metaKeywordsRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    // Gallery state (matching Items.jsx)
    const [gallery, setGallery] = useState([]);
    const galleryRef = useRef();
    const [draggedIndex, setDraggedIndex] = useState(null);

    // FAQs state
    const [projectFaqs, setProjectFaqs] = useState([]);

    // Advanced JSON arrays state
    const [projectIndicators, setProjectIndicators] = useState([]);
    const [projectStrengths, setProjectStrengths] = useState([]);
    const [projectSteps, setProjectSteps] = useState([]);

    // External links and challenge/solution refs
    const challengeRef = useRef();
    const solutionRef = useRef();
    const websiteUrlRef = useRef();
    const videoUrlRef = useRef();

    // Technologies ref
    const technologiesRef = useRef();
    const [selectedTechnologies, setSelectedTechnologies] = useState([]);

    const fetchTechnologies = async () => {
        const techRest = new TechnologiesRest();
        const result = await techRest.paginate({
            sort: [{ selector: 'name', desc: false }],
            take: 100
        });
        if (result && result.data) {
            setTechnologies(result.data);
        }
    };

    useEffect(() => {
        fetchTechnologies();
    }, []);

    /***************************/
    /* Funciones para Arrays JSON */
    /***************************/
    const addIndicator = () => setProjectIndicators([...projectIndicators, { image: "", name: "", description: "" }]);
    const updateIndicator = (index, field, value) => {
        const newItems = [...projectIndicators];
        newItems[index][field] = value;
        setProjectIndicators(newItems);
    };
    const handleIndicatorImageChange = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateIndicator(index, "image", reader.result);
        reader.readAsDataURL(file);
    };
    const removeIndicator = (index) => setProjectIndicators(projectIndicators.filter((_, i) => i !== index));

    const addStrength = () => setProjectStrengths([...projectStrengths, { image: "", name: "", description: "" }]);
    const updateStrength = (index, field, value) => {
        const newItems = [...projectStrengths];
        newItems[index][field] = value;
        setProjectStrengths(newItems);
    };
    const handleStrengthImageChange = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateStrength(index, "image", reader.result);
        reader.readAsDataURL(file);
    };
    const removeStrength = (index) => setProjectStrengths(projectStrengths.filter((_, i) => i !== index));

    const addStep = () => setProjectSteps([...projectSteps, { step_number: String(projectSteps.length + 1).padStart(2, "0"), image: "", name: "", description: "" }]);
    const updateStep = (index, field, value) => {
        const newItems = [...projectSteps];
        newItems[index][field] = value;
        setProjectSteps(newItems);
    };
    const handleStepImageChange = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            updateStep(index, 'image', e.target.result);
        };
        reader.readAsDataURL(file);
    };
    const removeStep = (index) => setProjectSteps(projectSteps.filter((_, i) => i !== index));

    /***************************/
    /* Funciones para Galería  */
    /***************************/
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeGalleryImage = (e, index) => {
        e.preventDefault();
        const image = gallery[index];
        if (image.id) {
            setGallery((prev) =>
                prev.map((img, i) => (i === index ? { ...img, toDelete: true } : img))
            );
        } else {
            setGallery((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDragOverReorder = (e) => {
        e.preventDefault();
    };

    const handleDropReorder = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newGallery = [...gallery];
        const [draggedItem] = newGallery.splice(draggedIndex, 1);
        newGallery.splice(dropIndex, 0, draggedItem);

        setGallery(newGallery);
        setDraggedIndex(null);
    };

    /***************************/
    /* Funciones para FAQs     */
    /***************************/
    const addFaq = () => {
        setProjectFaqs([...projectFaqs, { question: "", answer: "" }]);
    };

    const updateFaq = (index, field, value) => {
        const newFaqs = [...projectFaqs];
        newFaqs[index][field] = value;
        setProjectFaqs(newFaqs);
    };

    const removeFaq = (index) => {
        setProjectFaqs(projectFaqs.filter((_, i) => i !== index));
    };

    /***************************/
    /* Abrir Modal             */
    /***************************/
    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        if (idRef.current) idRef.current.value = data?.id ?? "";
        if (nameRef.current) nameRef.current.value = data?.name ?? "";
        if (slugRef.current) slugRef.current.value = data?.slug ?? "";
        if (clientRef.current) clientRef.current.value = data?.client ?? "";
        if (locationRef.current) locationRef.current.value = data?.location ?? "";
        if (dateRef.current) dateRef.current.value = data?.date ?? "";
        if (summaryRef.current) summaryRef.current.value = data?.summary ?? "";

        // Quill Editor Description
        setTimeout(() => {
            if (descriptionRef.editor) {
                descriptionRef.editor.root.innerHTML = data?.description ?? "";
            } else if (descriptionRef.current) {
                descriptionRef.current.value = data?.description ?? "";
            }
        }, 100);

        // Select Categoría (Opcional / Nullable)
        if (categoryRef.current) {
            $(categoryRef.current).val(data?.project_category_id ?? data?.service_category_id ?? "").trigger("change");
        }

        // Imágenes principales
        if (imageRef.current && imageRef.image) {
            imageRef.image.src = data?.image ? `/storage/images/project/${data.image}` : "";
            imageRef.current.value = null;
            if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        }

        if (backgroundImageRef.current && backgroundImageRef.image) {
            backgroundImageRef.image.src = data?.background_image ? `/storage/images/project/${data.background_image}` : "";
            backgroundImageRef.current.value = null;
            if (backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();
        }

        // Cargar galería existente
        if (data?.images && Array.isArray(data.images)) {
            setGallery(
                data.images.map((img) => ({
                    id: img.id,
                    url: `/storage/images/project/${img.image}`,
                    order: img.order,
                }))
            );
        } else {
            setGallery([]);
        }

        // Cargar FAQs
        if (data?.faqs && Array.isArray(data.faqs)) {
            setProjectFaqs(data.faqs);
        } else {
            setProjectFaqs([]);
        }

        // SEO
        if (metaTitleRef.current) metaTitleRef.current.value = data?.meta_title ?? "";
        if (metaDescriptionRef.current) metaDescriptionRef.current.value = data?.meta_description ?? "";
        if (metaKeywordsRef.current) metaKeywordsRef.current.value = data?.meta_keywords ?? "";

        // Advanced Fields
        if (challengeRef.current) challengeRef.current.value = data?.challenge ?? "";
        if (solutionRef.current) solutionRef.current.value = data?.solution ?? "";
        if (websiteUrlRef.current) websiteUrlRef.current.value = data?.website_url ?? "";
        if (videoUrlRef.current) videoUrlRef.current.value = data?.video_url ?? "";

        // Json Arrays
        setProjectIndicators(data?.indicators && Array.isArray(data.indicators) ? data.indicators : []);
        setProjectStrengths(data?.strengths && Array.isArray(data.strengths) ? data.strengths : []);
        setProjectSteps(data?.steps && Array.isArray(data.steps) ? data.steps : []);

        // Technologies Select
        if (technologiesRef.current) {
            let techIds = [];
            if (data?.technologies) {
                if (Array.isArray(data.technologies)) {
                    techIds = data.technologies.map(t => typeof t === 'object' ? t.id : t);
                } else if (typeof data.technologies === 'string') {
                    try {
                        const parsed = JSON.parse(data.technologies);
                        if (Array.isArray(parsed)) techIds = parsed.map(t => typeof t === 'object' ? t.id : t);
                    } catch (e) {
                        console.error('Error parsing technologies:', e);
                    }
                }
            }
            setSelectedTechnologies(techIds);
            setTimeout(() => {
                $(technologiesRef.current).val(techIds).trigger("change");
            }, 100);
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const catValue = $(categoryRef.current).val() || categoryRef.current?.value || "";
        const isProjectCategory = project_categories.length > 0;

        const request = {
            id: idRef.current?.value || undefined,
            project_category_id: isProjectCategory ? (catValue || null) : null,
            service_category_id: !isProjectCategory ? (catValue || null) : null,
            name: nameRef.current?.value || "",
            slug: slugRef.current?.value || "",
            client: clientRef.current?.value || "",
            location: locationRef.current?.value || "",
            date: dateRef.current?.value || "",
            summary: summaryRef.current?.value || "",
            description: descriptionRef.editor?.root?.innerHTML || descriptionRef.current?.value || "",
            meta_title: metaTitleRef.current?.value || "",
            meta_description: metaDescriptionRef.current?.value || "",
            meta_keywords: metaKeywordsRef.current?.value || "",
            challenge: challengeRef.current?.value || "",
            solution: solutionRef.current?.value || "",
            website_url: websiteUrlRef.current?.value || "",
            video_url: videoUrlRef.current?.value || "",
        };

        const formData = new FormData();
        for (const key in request) {
            if (request[key] !== undefined && request[key] !== null) {
                formData.append(key, request[key]);
            }
        }

        // Handle technologies
        if (Fillable.has("projects", "technologies")) {
            const selectedTechs = $(technologiesRef.current).val() || [];
            formData.append('technologies', JSON.stringify(selectedTechs));
        }

        // Imagen principal
        if (imageRef.current && Fillable.has("projects", "image")) {
            const file = imageRef.current.files[0];
            if (file) {
                formData.append("image", file);
            }
            if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
                formData.append("image_delete", "DELETE");
            }
        }

        // Background Image
        if (backgroundImageRef.current && Fillable.has("projects", "background_image")) {
            const bgFile = backgroundImageRef.current.files[0];
            if (bgFile) {
                formData.append("background_image", bgFile);
            }
            if (backgroundImageRef.getDeleteFlag && backgroundImageRef.getDeleteFlag()) {
                formData.append("background_image_delete", "DELETE");
            }
        }

        // Galería: eliminar marcadas
        const deletedImageIds = gallery
            .filter((img) => img.id && img.toDelete)
            .map((img) => img.id);

        if (deletedImageIds.length > 0) {
            formData.append("deleted_images", JSON.stringify(deletedImageIds));
        }

        // Galería: agregar nuevas
        gallery
            .filter((img) => !img.toDelete && img.file)
            .forEach((img) => {
                formData.append("gallery[]", img.file);
            });

        // FAQs en JSON
        const validFaqs = projectFaqs.filter((f) => f.question?.trim() && f.answer?.trim());
        formData.append("faqs", JSON.stringify(validFaqs));

        // Json avanzado (Indicadores, Fortalezas, Pasos)
        const validIndicators = projectIndicators.filter((i) => i.name?.trim());
        formData.append("indicators", JSON.stringify(validIndicators));

        const validStrengths = projectStrengths.filter((s) => s.name?.trim());
        formData.append("strengths", JSON.stringify(validStrengths));

        const validSteps = projectSteps.filter((s) => s.name?.trim());
        formData.append("steps", JSON.stringify(validSteps));

        const result = await projectsRest.save(formData);
        if (!result) return;

        // Reset delete flags tras guardar exitosamente
        if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (backgroundImageRef.current && backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onFeaturedChange = async ({ id, value }) => {
        const result = await projectsRest.boolean({
            id,
            field: "featured",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await projectsRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (row) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estás seguro de eliminar este proyecto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await projectsRest.delete(row.id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onReorder = async (e) => {
        const newOrderIndex = e.toIndex;
        try {
            const result = await projectsRest.reorder(e.itemData.id, newOrderIndex);
            if (result) {
                await e.component.refresh();
            }
        } catch (error) {
            console.error('Error reordering project:', error);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Proyectos"
                rest={projectsRest}
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    dropFeedbackMode: 'push'
                }}
                sorting={{
                    mode: 'single'
                }}
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
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: 'order_index',
                        caption: 'Orden',
                        visible: false,
                        sortOrder: 'asc',
                        sortIndex: 0
                    },
                    Fillable.has("projects", "image") && {
                        dataField: "image",
                        caption: "Imagen",
                        width: 90,
                        allowFiltering: false,
                        allowSorting: false,
                        cellTemplate: (container, options) => {
                            const src = options.data.image
                                ? `/storage/images/project/${options.data.image}`
                                : "/api/cover/thumbnail/null";
                            ReactAppend(
                                container,
                                <img
                                    src={src}
                                    alt={options.data.name}
                                    style={{
                                        width: "60px",
                                        height: "45px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                    }}
                                    onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("projects", "name") && {
                        dataField: "name",
                        caption: "Nombre del Proyecto",
                        dataType: "string",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(container, <>
                                {data.name}<br />
                                {data.technologies?.map((tech, index) => <span key={index} className='badge badge-soft-primary me-1'>{tech.name}</span>)}
                            </>);
                        }
                    },
                    Fillable.has("projects", "project_category_id") && {
                        dataField: "project_category_id",
                        caption: "Categoría",
                        lookup: {
                            dataSource: project_categories.length > 0 ? project_categories : service_categories,
                            valueExpr: "id",
                            displayExpr: "name",
                        },
                    },
                    Fillable.has("projects", "client") && {
                        dataField: "client",
                        caption: "Cliente",
                        dataType: "string",
                    },
                    Fillable.has("projects", "location") && {
                        dataField: "location",
                        caption: "Ubicación",
                        dataType: "string",
                    },
                    Fillable.has("projects", "date") && {
                        dataField: "date",
                        caption: "Fecha",
                        dataType: "string",
                    },
                    Fillable.has("projects", "featured") && {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: 100,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.featured == 1}
                                    onChange={() =>
                                        onFeaturedChange({
                                            id: data.id,
                                            value: !data.featured,
                                        })
                                    }
                                />,
                            );
                        },
                    },
                    Fillable.has("projects", "visible") && {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: 90,
                        cellTemplate: (container, { data }) => {
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
                                    onClick: () => onDeleteClicked(data),
                                }),
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ].filter(Boolean)}
            />

            {/* Modal para Crear / Editar Proyecto */}
            <Modal modalRef={modalRef} title={isEditing ? "Editar Proyecto" : "Nuevo Proyecto"} onSubmit={onModalSubmit} size="xl">
                <input ref={idRef} type="hidden" name="id" />

                <div id="principal-container">
                    {/* Tabs de Navegación del Modal */}
                    <ul className="nav nav-tabs nav-bordered mb-3" role="tablist">
                    <li className="nav-item">
                        <button className="nav-link active" id="basic-tab" data-bs-toggle="tab" data-bs-target="#basic" type="button" role="tab" aria-controls="basic" aria-selected="true">
                            <i className="fas fa-info-circle me-1"></i> Información Básica
                        </button>
                    </li>
                    {(Fillable.has("projects", "challenge") || Fillable.has("projects", "solution")) && (
                        <li className="nav-item">
                            <button className="nav-link" id="case-study-tab" data-bs-toggle="tab" data-bs-target="#case-study" type="button" role="tab">
                                <i className="fas fa-bullseye me-1"></i> Reto y Solución
                            </button>
                        </li>
                    )}
                    {(Fillable.has("projects", "technologies") || Fillable.has("projects", "website_url") || Fillable.has("projects", "video_url")) && (
                        <li className="nav-item">
                            <button className="nav-link" id="technologies-link-tab" data-bs-toggle="tab" data-bs-target="#technologies-link" type="button" role="tab">
                                <i className="fas fa-link me-1"></i> Tecnologías y Enlaces
                            </button>
                        </li>
                    )}
                    {(Fillable.has("projects", "image") || Fillable.has("projects", "background_image") || Fillable.has("projects", "gallery") || Fillable.has("projects", "images")) && (
                        <li className="nav-item">
                            <button className="nav-link" id="media-tab" data-bs-toggle="tab" data-bs-target="#media" type="button" role="tab">
                                <i className="fas fa-images me-1"></i> Galería e Imágenes
                            </button>
                        </li>
                    )}
                    {(Fillable.has("projects", "meta_title") || Fillable.has("projects", "meta_description") || Fillable.has("projects", "meta_keywords")) && (
                        <li className="nav-item">
                            <button className="nav-link" id="seo-tab" data-bs-toggle="tab" data-bs-target="#seo" type="button" role="tab">
                                <i className="fas fa-search me-1"></i> SEO y Metadatos
                            </button>
                        </li>
                    )}
                    {Fillable.has("projects", "faqs") && (
                        <li className="nav-item">
                            <button className="nav-link" id="faqs-tab" data-bs-toggle="tab" data-bs-target="#faqs" type="button" role="tab">
                                <i className="fas fa-question-circle me-1"></i> FAQs ({projectFaqs.length})
                            </button>
                        </li>
                    )}
                    {Fillable.has("projects", "indicators") && (
                        <li className="nav-item">
                            <button className="nav-link" id="indicators-tab" data-bs-toggle="tab" data-bs-target="#indicators" type="button" role="tab">
                                <i className="fas fa-chart-line me-1"></i> Indicadores ({projectIndicators.length})
                            </button>
                        </li>
                    )}
                    {Fillable.has("projects", "strengths") && (
                        <li className="nav-item">
                            <button className="nav-link" id="strengths-tab" data-bs-toggle="tab" data-bs-target="#strengths" type="button" role="tab">
                                <i className="fas fa-star me-1"></i> Fortalezas ({projectStrengths.length})
                            </button>
                        </li>
                    )}
                    {Fillable.has("projects", "steps") && (
                        <li className="nav-item">
                            <button className="nav-link" id="steps-tab" data-bs-toggle="tab" data-bs-target="#steps" type="button" role="tab">
                                <i className="fas fa-list-ol me-1"></i> Procesos ({projectSteps.length})
                            </button>
                        </li>
                    )}
                </ul>

                <div className="tab-content">
                    {/* TAB 1: Información Básica */}
                    <div className="tab-pane fade show active" id="basic" role="tabpanel">
                        <div className="row g-3">
                            {/* Card 1: Identificación del Proyecto */}
                            {(Fillable.has("projects", "project_category_id") || Fillable.has("projects", "name") || Fillable.has("projects", "slug")) && (
                                <div className="col-12">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 font-bold">
                                                <i className="fas fa-tag me-2 text-primary"></i>
                                                Identificación del Proyecto
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row g-3">
                                                <div className="col-md-6" hidden={!Fillable.has("projects", "project_category_id")}>
                                                    <SelectFormGroup
                                                        eRef={categoryRef}
                                                        name="project_category_id"
                                                        label="Categoría del Proyecto (Opcional)"
                                                        dropdownParent="#principal-container"
                                                    >
                                                        <option value="">-- Sin Categoría --</option>
                                                        {(project_categories.length > 0 ? project_categories : service_categories).map((cat) => (
                                                            <option key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </SelectFormGroup>
                                                </div>

                                                <div className="col-md-6" hidden={!Fillable.has("projects", "name")}>
                                                    <InputFormGroup
                                                        eRef={nameRef}
                                                        name="name"
                                                        label="Nombre del Proyecto"
                                                        required
                                                        onChange={(e) => {
                                                            if (slugRef.current && !isEditing) {
                                                                const generated = e.target.value
                                                                    .toLowerCase()
                                                                    .normalize("NFD")
                                                                    .replace(/[\u0300-\u036f]/g, "")
                                                                    .replace(/[^a-z0-9\s-]/g, "")
                                                                    .trim()
                                                                    .replace(/\s+/g, "-");
                                                                slugRef.current.value = generated;
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-12" hidden={!Fillable.has("projects", "slug")}>
                                                    <label className="form-label fw-semibold">
                                                        <i className="fas fa-link me-1 text-primary"></i> Slug (URL amigable)
                                                    </label>
                                                    <div className="input-group">
                                                        <input
                                                            ref={slugRef}
                                                            type="text"
                                                            name="slug"
                                                            className="form-control"
                                                            placeholder="ej-nombre-del-proyecto"
                                                            onChange={(e) => {
                                                                const clean = e.target.value
                                                                    .toLowerCase()
                                                                    .normalize("NFD")
                                                                    .replace(/[\u0300-\u036f]/g, "")
                                                                    .replace(/[^a-z0-9\s-]/g, "")
                                                                    .replace(/\s+/g, "-");
                                                                e.target.value = clean;
                                                            }}
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            title="Regenerar slug desde el nombre"
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
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            title="Copiar URL"
                                                            onClick={() => {
                                                                if (slugRef.current?.value) {
                                                                    navigator.clipboard.writeText(`/proyectos/${slugRef.current.value}`);
                                                                    Swal.fire({
                                                                        toast: true,
                                                                        position: "top-end",
                                                                        icon: "success",
                                                                        title: "URL copiada al portapapeles",
                                                                        showConfirmButton: false,
                                                                        timer: 2000,
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            <i className="fas fa-copy"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Card 2: Cliente y Ubicación */}
                            {(Fillable.has("projects", "client") || Fillable.has("projects", "location") || Fillable.has("projects", "date")) && (
                                <div className="col-12">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 font-bold">
                                                <i className="fas fa-briefcase me-2 text-primary"></i>
                                                Cliente y Ubicación
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row g-3">
                                                <div className="col-md-4" hidden={!Fillable.has("projects", "client")}>
                                                    <InputFormGroup
                                                        eRef={clientRef}
                                                        name="client"
                                                        label="Cliente"
                                                        placeholder="Ej. Empresa SAC"
                                                    />
                                                </div>

                                                <div className="col-md-4" hidden={!Fillable.has("projects", "location")}>
                                                    <InputFormGroup
                                                        eRef={locationRef}
                                                        name="location"
                                                        label="Ubicación"
                                                        placeholder="Ej. Lima, Perú"
                                                    />
                                                </div>

                                                <div className="col-md-4" hidden={!Fillable.has("projects", "date")}>
                                                    <InputFormGroup
                                                        eRef={dateRef}
                                                        name="date"
                                                        label="Fecha de Ejecución"
                                                        placeholder="Ej. 2026 u Octubre 2025"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Card 3: Resumen y Descripción */}
                            {(Fillable.has("projects", "summary") || Fillable.has("projects", "description")) && (
                                <div className="col-12">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 font-bold">
                                                <i className="fas fa-align-left me-2 text-primary"></i>
                                                Descripción y Resumen
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row g-3">
                                                <div className="col-12" hidden={!Fillable.has("projects", "summary")}>
                                                    <TextareaFormGroup
                                                        eRef={summaryRef}
                                                        name="summary"
                                                        label="Resumen Ejecutivo / Breve Descripción"
                                                        rows={2}
                                                        placeholder="Resumen corto para listas y tarjetas del proyecto..."
                                                    />
                                                </div>

                                                <div className="col-12" hidden={!Fillable.has("projects", "description")}>
                                                    <QuillFormGroup
                                                        eRef={descriptionRef}
                                                        label="Descripción Completa"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TAB: Reto y Solución */}
                    {(Fillable.has("projects", "challenge") || Fillable.has("projects", "solution")) && (
                        <div className="tab-pane fade" id="case-study" role="tabpanel">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0 font-bold">
                                        <i className="fas fa-bullseye me-2 text-primary"></i>
                                        Reto y Solución (Case Study)
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-12" hidden={!Fillable.has("projects", "challenge")}>
                                            <TextareaFormGroup
                                                eRef={challengeRef}
                                                name="challenge"
                                                label="El Reto (Challenge)"
                                                rows={2}
                                                placeholder="Descripción del problema o necesidad del cliente..."
                                            />
                                        </div>
                                        <div className="col-12" hidden={!Fillable.has("projects", "solution")}>
                                            <TextareaFormGroup
                                                eRef={solutionRef}
                                                name="solution"
                                                label="La Solución (Solution)"
                                                rows={2}
                                                placeholder="Cómo se resolvió utilizando tecnología y nuestra metodología..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: Tecnologías y Enlaces */}
                    {(Fillable.has("projects", "technologies") || Fillable.has("projects", "website_url") || Fillable.has("projects", "video_url")) && (
                        <div className="tab-pane fade" id="technologies-link" role="tabpanel">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0 font-bold">
                                        <i className="fas fa-link me-2 text-primary"></i>
                                        Tecnologías y Enlaces
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-12" hidden={!Fillable.has("projects", "technologies")}>
                                            <SelectFormGroup
                                                eRef={technologiesRef}
                                                name="technologies"
                                                label="Stack Tecnológico"
                                                dropdownParent="#principal-container"
                                                multiple
                                            >
                                                {technologies.map((tech) => (
                                                    <option key={tech.id} value={tech.id}>
                                                        {tech.name}
                                                    </option>
                                                ))}
                                            </SelectFormGroup>
                                        </div>
                                        <div className="col-md-6" hidden={!Fillable.has("projects", "website_url")}>
                                            <InputFormGroup
                                                eRef={websiteUrlRef}
                                                name="website_url"
                                                label="URL del Proyecto en Vivo"
                                                placeholder="https://www.ejemplo.com"
                                            />
                                        </div>
                                        <div className="col-md-6" hidden={!Fillable.has("projects", "video_url")}>
                                            <InputFormGroup
                                                eRef={videoUrlRef}
                                                name="video_url"
                                                label="URL de Video (YouTube/Vimeo)"
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Galería e Imágenes */}
                    {(Fillable.has("projects", "image") || Fillable.has("projects", "background_image") || Fillable.has("projects", "gallery") || Fillable.has("projects", "images")) && (
                        <div className="tab-pane fade" id="media" role="tabpanel">
                            <div className="row g-3">
                                <div className="col-md-6" hidden={!Fillable.has("projects", "image")}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 font-bold">
                                                <i className="fas fa-image me-2 text-primary"></i>
                                                Imagen Principal (Portada)
                                            </h6>
                                        </div>
                                        <div className="card-body text-center">
                                            <ImageFormGroup eRef={imageRef} name="image" label="Seleccionar portada del proyecto" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6" hidden={!Fillable.has("projects", "background_image")}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-light">
                                            <h6 className="mb-0 font-bold">
                                                <i className="fas fa-photo-video me-2 text-primary"></i>
                                                Imagen de Fondo (Banner Superior)
                                            </h6>
                                        </div>
                                        <div className="card-body text-center">
                                            <ImageFormGroup eRef={backgroundImageRef} name="background_image" label="Seleccionar banner de fondo" />
                                        </div>
                                    </div>
                                </div>

                                {/* Galería Secundarios */}
                                <div className="col-12" hidden={!Fillable.has("projects", "gallery") && !Fillable.has("projects", "images")}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <label htmlFor="input-item-gallery" className="form-label font-bold mb-2">
                                                Galería de Imágenes
                                                {gallery.filter((img) => !img.toDelete).length > 0 && (
                                                    <span className="badge bg-primary ms-2">
                                                        {gallery.filter((img) => !img.toDelete).length}
                                                    </span>
                                                )}
                                            </label>

                                            <input
                                                id="input-item-gallery"
                                                ref={galleryRef}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="d-none"
                                                onChange={handleGalleryChange}
                                            />

                                            <div
                                                className="gallery-container"
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                                                    gap: "16px",
                                                    padding: "16px",
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "12px",
                                                    border: "2px dashed #dee2e6",
                                                    minHeight: "160px",
                                                }}
                                            >
                                                {gallery
                                                    .filter((image) => !image.toDelete)
                                                    .map((image, index) => {
                                                        const originalIndex = gallery.findIndex((img) => img === image);
                                                        const displayIndex = index + 1;
                                                        return (
                                                            <div
                                                                key={originalIndex}
                                                                className="gallery-item position-relative"
                                                                draggable
                                                                onDragStart={(e) => handleDragStart(e, originalIndex)}
                                                                onDragEnd={handleDragEnd}
                                                                onDragOver={handleDragOverReorder}
                                                                onDrop={(e) => handleDropReorder(e, originalIndex)}
                                                                style={{
                                                                    aspectRatio: "1",
                                                                    borderRadius: "12px",
                                                                    overflow: "hidden",
                                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                                    transition: "all 0.3s ease",
                                                                    cursor: "grab",
                                                                    transform: draggedIndex === originalIndex ? "scale(1.05)" : "scale(1)",
                                                                    opacity: draggedIndex === originalIndex ? 0.8 : 1,
                                                                    border: "3px solid transparent",
                                                                    background: "white",
                                                                }}
                                                            >
                                                                <div className="position-absolute top-0 start-0 m-2">
                                                                    <span
                                                                        className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                                                        style={{
                                                                            width: "24px",
                                                                            height: "24px",
                                                                            fontSize: "11px",
                                                                            fontWeight: "bold",
                                                                        }}
                                                                    >
                                                                        {displayIndex}
                                                                    </span>
                                                                </div>

                                                                <img
                                                                    src={image.url}
                                                                    alt={`Imagen ${displayIndex}`}
                                                                    className="w-100 h-100"
                                                                    style={{
                                                                        objectFit: "cover",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                />

                                                                <div
                                                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        background: "rgba(0,0,0,0.7)",
                                                                        opacity: 0,
                                                                        transition: "opacity 0.3s ease",
                                                                    }}
                                                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                                                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                                                                >
                                                                    <div className="d-flex gap-2">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-center"
                                                                            style={{
                                                                                width: "32px",
                                                                                height: "32px",
                                                                            }}
                                                                            title="Mover imagen"
                                                                        >
                                                                            <i className="fas fa-arrows-alt text-dark"></i>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-center"
                                                                            style={{
                                                                                width: "32px",
                                                                                height: "32px",
                                                                            }}
                                                                            onClick={(e) => removeGalleryImage(e, originalIndex)}
                                                                            title="Eliminar imagen"
                                                                        >
                                                                            <i className="fas fa-trash text-white"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                {/* Botón agregar imagen */}
                                                <div
                                                    className="gallery-add-button d-flex flex-column align-items-center justify-content-center"
                                                    style={{
                                                        aspectRatio: "1",
                                                        border: "3px dashed #71b6f9",
                                                        borderRadius: "12px",
                                                        backgroundColor: "rgba(13, 110, 253, 0.05)",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        minHeight: "120px",
                                                    }}
                                                    onClick={() => galleryRef.current?.click()}
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                >
                                                    <i className="fas fa-plus text-primary mb-1" style={{ fontSize: "20px" }}></i>
                                                    <span className="text-primary fw-semibold small text-center px-1">
                                                        Agregar Imágenes
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SEO y Metadatos */}
                    {(Fillable.has("projects", "meta_title") || Fillable.has("projects", "meta_description") || Fillable.has("projects", "meta_keywords")) && (
                        <div className="tab-pane fade" id="seo" role="tabpanel">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0 font-bold">
                                        <i className="fas fa-search me-2 text-primary"></i>
                                        Configuración SEO & Meta Etiquetas
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <InputFormGroup
                                        eRef={metaTitleRef}
                                        name="meta_title"
                                        label="Meta Título (SEO)"
                                        placeholder="Título optimizado para motores de búsqueda..."
                                        hidden={!Fillable.has("projects", "meta_title")}
                                    />
                                    <TextareaFormGroup
                                        eRef={metaDescriptionRef}
                                        name="meta_description"
                                        label="Meta Descripción (SEO)"
                                        rows={3}
                                        placeholder="Resumen para Google y redes sociales..."
                                        hidden={!Fillable.has("projects", "meta_description")}
                                    />
                                    <InputFormGroup
                                        eRef={metaKeywordsRef}
                                        name="meta_keywords"
                                        label="Palabras Clave (Meta Keywords)"
                                        placeholder="proyecto, ingeniería, automatización, peru..."
                                        hidden={!Fillable.has("projects", "meta_keywords")}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: FAQs */}
                    {Fillable.has("projects", "faqs") && (
                        <div className="tab-pane fade" id="faqs" role="tabpanel">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 font-bold">
                                        <i className="fas fa-question-circle me-2 text-primary"></i>
                                        Preguntas Frecuentes del Proyecto
                                    </h6>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={addFaq}
                                    >
                                        <i className="fas fa-plus me-1"></i> Agregar Pregunta
                                    </button>
                                </div>
                                <div className="card-body">
                                    {projectFaqs.length === 0 ? (
                                        <div className="text-center text-muted py-4">
                                            <i className="fas fa-info-circle me-1"></i> No hay preguntas frecuentes agregadas a este proyecto.
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {projectFaqs.map((faq, index) => (
                                                <div key={index} className="card border p-3 shadow-none bg-light position-relative mb-0">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="badge bg-primary">Pregunta #{index + 1}</span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => removeFaq(index)}
                                                        >
                                                            <i className="fas fa-trash me-1"></i> Eliminar
                                                        </button>
                                                    </div>
                                                    <div className="mb-2">
                                                        <InputFormGroup
                                                            label="Pregunta"
                                                            value={faq.question}
                                                            onChange={(e) => updateFaq(index, "question", e.target.value)}
                                                            placeholder="Ej. ¿Cuál fue el tiempo de ejecución de este proyecto?"
                                                        />
                                                    </div>
                                                    <div>
                                                        <TextareaFormGroup
                                                            label="Respuesta"
                                                            rows={2}
                                                            value={faq.answer}
                                                            onChange={(e) => updateFaq(index, "answer", e.target.value)}
                                                            placeholder="Ej. El proyecto se ejecutó en 45 días calendario."
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: Indicadores */}
                    {Fillable.has("projects", "indicators") && (
                        <div className="tab-pane fade" id="indicators" role="tabpanel">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 font-bold">
                                        <i className="fas fa-chart-line me-2 text-primary"></i>
                                        Indicadores Clave de Desempeño
                                    </h6>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={addIndicator}>
                                        <i className="fas fa-plus me-1"></i> Agregar Indicador
                                    </button>
                                </div>
                                <div className="card-body">
                                    {projectIndicators.length === 0 ? (
                                        <div className="text-center text-muted py-4">No hay indicadores.</div>
                                    ) : (
                                        <div className="row g-3">
                                            {projectIndicators.map((item, index) => (
                                                <div key={index} className="col-md-6">
                                                    <div className="border rounded p-3 bg-light position-relative h-100">
                                                        <button type="button" className="btn-close position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }} onClick={() => removeIndicator(index)}></button>
                                                        <div className="row g-3 align-items-center">
                                                            <div className="col-4">
                                                                <label className="form-label small font-bold d-block mb-1">Imagen</label>
                                                                <div className="position-relative border rounded overflow-hidden bg-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1", minHeight: "90px" }}>
                                                                    {item.image ? (
                                                                        <img src={item.image.startsWith('data:') || item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/storage/images/projects/${item.image}`} alt="preview" className="w-100 h-100 object-fit-cover" />
                                                                    ) : (
                                                                        <div className="text-center text-muted p-2">
                                                                            <i className="fas fa-cloud-upload-alt fa-2x mb-1 d-block text-primary"></i>
                                                                            <span style={{ fontSize: "10px" }}>Subir Imagen</span>
                                                                        </div>
                                                                    )}
                                                                    <input type="file" accept="image/*" className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" onChange={(e) => handleIndicatorImageChange(index, e.target.files[0])} title="Seleccionar imagen" />
                                                                </div>
                                                            </div>
                                                            <div className="col-8">
                                                                <div className="mb-2">
                                                                    <label className="form-label small font-bold mb-1">Título / Nombre</label>
                                                                    <input type="text" className="form-control form-control-sm" value={item.name || ''} onChange={(e) => updateIndicator(index, "name", e.target.value)} placeholder="Ej: +85% Leads" />
                                                                </div>
                                                                <div>
                                                                    <label className="form-label small font-bold mb-1">Descripción</label>
                                                                    <textarea className="form-control form-control-sm" rows="3" value={item.description || ''} onChange={(e) => updateIndicator(index, "description", e.target.value)} placeholder="Descripción del indicador..." />
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
                    )}

                    {/* TAB: Fortalezas */}
                    {Fillable.has("projects", "strengths") && (
                        <div className="tab-pane fade" id="strengths" role="tabpanel">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 font-bold">
                                        <i className="fas fa-star me-2 text-primary"></i>
                                        Puntos Fuertes / Beneficios Logrados
                                    </h6>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={addStrength}>
                                        <i className="fas fa-plus me-1"></i> Agregar Fortaleza
                                    </button>
                                </div>
                                <div className="card-body">
                                    {projectStrengths.length === 0 ? (
                                        <div className="text-center text-muted py-4">No hay fortalezas.</div>
                                    ) : (
                                        <div className="row g-3">
                                            {projectStrengths.map((item, index) => (
                                                <div key={index} className="col-md-6">
                                                    <div className="border rounded p-3 bg-light position-relative h-100">
                                                        <button type="button" className="btn-close position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }} onClick={() => removeStrength(index)}></button>
                                                        <div className="row g-3 align-items-center">
                                                            <div className="col-4">
                                                                <label className="form-label small font-bold d-block mb-1">Imagen</label>
                                                                <div className="position-relative border rounded overflow-hidden bg-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1", minHeight: "90px" }}>
                                                                    {item.image ? (
                                                                        <img src={item.image.startsWith('data:') || item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/storage/images/projects/${item.image}`} alt="preview" className="w-100 h-100 object-fit-cover" />
                                                                    ) : (
                                                                        <div className="text-center text-muted p-2">
                                                                            <i className="fas fa-cloud-upload-alt fa-2x mb-1 d-block text-primary"></i>
                                                                            <span style={{ fontSize: "10px" }}>Subir Imagen</span>
                                                                        </div>
                                                                    )}
                                                                    <input type="file" accept="image/*" className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" onChange={(e) => handleStrengthImageChange(index, e.target.files[0])} title="Seleccionar imagen" />
                                                                </div>
                                                            </div>
                                                            <div className="col-8">
                                                                <div className="mb-2">
                                                                    <label className="form-label small font-bold mb-1">Título / Nombre</label>
                                                                    <input type="text" className="form-control form-control-sm" value={item.name || ''} onChange={(e) => updateStrength(index, "name", e.target.value)} placeholder="Ej: Escalabilidad" />
                                                                </div>
                                                                <div>
                                                                    <label className="form-label small font-bold mb-1">Descripción</label>
                                                                    <textarea className="form-control form-control-sm" rows="3" value={item.description || ''} onChange={(e) => updateStrength(index, "description", e.target.value)} placeholder="Descripción de la fortaleza..." />
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
                    )}

                    {/* TAB: Pasos */}
                    {Fillable.has("projects", "steps") && (
                        <div className="tab-pane fade" id="steps" role="tabpanel">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 font-bold">
                                        <i className="fas fa-list-ol me-2 text-primary"></i>
                                        Metodología / Fases del Proyecto
                                    </h6>
                                    <button type="button" className="btn btn-sm btn-primary" onClick={addStep}>
                                        <i className="fas fa-plus me-1"></i> Agregar Fase
                                    </button>
                                </div>
                                <div className="card-body">
                                    {projectSteps.length === 0 ? (
                                        <div className="text-center text-muted py-4">No hay fases.</div>
                                    ) : (
                                        <div className="row g-3">
                                            {projectSteps.map((item, index) => (
                                                <div key={index} className="col-md-6">
                                                    <div className="border rounded p-3 bg-light position-relative h-100">
                                                        <button type="button" className="btn-close position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }} onClick={() => removeStep(index)}></button>
                                                        <div className="row g-3 align-items-center">
                                                            <div className="col-4">
                                                                <label className="form-label small font-bold d-block mb-1">Imagen</label>
                                                                <div className="position-relative border rounded overflow-hidden bg-white d-flex align-items-center justify-content-center" style={{ aspectRatio: "1/1", minHeight: "90px" }}>
                                                                    {item.image ? (
                                                                        <img src={item.image.startsWith('data:') || item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/storage/images/projects/${item.image}`} alt="preview" className="w-100 h-100 object-fit-cover" />
                                                                    ) : (
                                                                        <div className="text-center text-muted p-2">
                                                                            <i className="fas fa-cloud-upload-alt fa-2x mb-1 d-block text-primary"></i>
                                                                            <span style={{ fontSize: "10px" }}>Subir Imagen</span>
                                                                        </div>
                                                                    )}
                                                                    <input type="file" accept="image/*" className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" onChange={(e) => handleStepImageChange(index, e.target.files[0])} title="Seleccionar imagen" />
                                                                </div>
                                                            </div>
                                                            <div className="col-8">
                                                                <div className="row g-2 mb-2">
                                                                    <div className="col-4">
                                                                        <label className="form-label small font-bold d-block mb-1">Nro</label>
                                                                        <input type="text" className="form-control form-control-sm text-center font-bold" value={item.step_number || ""} onChange={(e) => updateStep(index, "step_number", e.target.value)} placeholder="01" />
                                                                    </div>
                                                                    <div className="col-8">
                                                                        <label className="form-label small font-bold mb-1">Nombre de la fase</label>
                                                                        <input type="text" className="form-control form-control-sm" value={item.name || ''} onChange={(e) => updateStep(index, "name", e.target.value)} placeholder="Ej: Fase de Descubrimiento" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="form-label small font-bold mb-1">Descripción</label>
                                                                    <textarea className="form-control form-control-sm" rows="3" value={item.description || ''} onChange={(e) => updateStep(index, "description", e.target.value)} placeholder="Descripción de la fase..." />
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
                    )}
                </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Proyectos">
            <Projects {...properties} />
        </BaseAdminto>,
    );
});

export default Projects;
