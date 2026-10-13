import React from "react";
import ProjectsRest from "../../Actions/ProjectsRest";

const ProjectDetailRhino = React.lazy(() => import("./Projects/ProjectDetailRhino"));

const projectsRest = new ProjectsRest();

const ProjectDetail = ({
    data,
    items,
    which,
    currentProject = null,
    generals,
}) => {
    // Centralized function to track project views
    const handleViewUpdate = async (project) => {
        try {
            const request = {
                id: project?.id,
                page_url: window.location.href,
            };
            await projectsRest.updateViews(request);
        } catch (error) {
            console.error('Error tracking project view:', error);
        }
    };

    const getProjectDetail = () => {
        switch (which) {
            case "ProjectDetailRhino":
                return <ProjectDetailRhino data={data} items={items} currentProject={currentProject} onViewUpdate={handleViewUpdate} generals={generals} />;
            default:
                return <div>No hay componente {which} para ProjectDetail</div>;
        }
    };

    return getProjectDetail();
};

export default ProjectDetail;
