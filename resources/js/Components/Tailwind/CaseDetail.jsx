import React from "react";
import CaseStudiesRest from "../../Actions/CaseStudiesRest";

const CaseStudyDetailRhino = React.lazy(() => import("./CaseStudies/CaseStudyDetailRhino"));

const caseStudiesRest = new CaseStudiesRest();

const CaseDetail = ({
    data,
    items,
    which,
    currentCaseStudy = null,
    generals,
}) => {
    // Función centralizada para registrar la vista del caso de estudio
    const handleViewUpdate = async (caseStudy) => {
        try {
            if (caseStudiesRest.updateViews && caseStudy?.id) {
                await caseStudiesRest.updateViews({
                    id: caseStudy.id,
                    page_url: window.location.href,
                });
            }
        } catch (error) {
            console.error('Error tracking case study view:', error);
        }
    };

    const resolvedCaseStudy = currentCaseStudy ||
        data?.CaseStudy ||
        data?.Case ||
        data?.slug ||
        (Array.isArray(items) && items.length > 0 ? items[0] : null);

    return (
        <CaseStudyDetailRhino
            data={data}
            items={items}
            currentCaseStudy={resolvedCaseStudy}
            onViewUpdate={handleViewUpdate}
            generals={generals}
        />
    );
};

export default CaseDetail;
