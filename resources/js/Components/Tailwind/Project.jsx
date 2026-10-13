import React from "react";

const ProjectsGalleryNgs = React.lazy(() => import("./Projects/ProjectsGalleryNgs"));
const PortfolioSectionRhino = React.lazy(() => import("./Projects/PortfolioSectionRhino"));
const ProjectsListRhino = React.lazy(() => import("./Projects/ProjectsListRhino"));

const Project = ({ data, items, which, generals }) => {
    switch (which) {
        case "ProjectsListRhino":
        case "ProjectListRhino":
        case "ProjectsList":
            return (
                <ProjectsListRhino
                    data={data}
                    items={items}
                    generals={generals}
                />
            );
        case "PortfolioSectionRhino":
            return (
                <PortfolioSectionRhino
                    data={data}
                    items={items}
                    generals={generals}
                />
            );
        case "ProjectsGalleryNgs":
        default:
            return (
                <ProjectsGalleryNgs
                    data={data}
                    items={items}
                    generals={generals}
                />
            );
    }
};

export default Project;
