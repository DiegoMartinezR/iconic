import React from "react";

const CasesSectionRhino = React.lazy(() => import("./CaseStudies/CasesSectionRhino"));
const CaseStudiesListRhino = React.lazy(() => import("./CaseStudies/CaseStudiesListRhino"));

const CaseStudies = ({ data, items, which, generals }) => {
    switch (which) {
        case "CaseStudiesListRhino":
        case "CaseStudiesList":
        case "CasesListRhino":
        case "CasesList":
            return (
                <CaseStudiesListRhino
                    data={data}
                    items={items}
                    generals={generals}
                />
            );
        case "CasesSectionRhino":
        case "CasesRhino":
        case "CaseStudiesRhino":
        case "CaseStudiesSectionRhino":
        default:
            return (
                <CasesSectionRhino
                    data={data}
                    items={items}
                    generals={generals}
                />
            );
    }
};

export default CaseStudies;
