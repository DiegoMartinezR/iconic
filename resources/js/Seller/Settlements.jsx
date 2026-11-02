import React from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import SettlementDashboard from "../Components/Settlements/SettlementDashboard";

const Settlements = (props) => {
    return <SettlementDashboard {...props} isSellerView={true} />;
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Mis Liquidaciones Mensuales">
            <Settlements {...properties} />
        </BaseAdminto>
    );
});

export default Settlements;
