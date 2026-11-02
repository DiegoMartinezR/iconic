import React from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import SettlementDashboard from "../Components/Settlements/SettlementDashboard";

const Settlements = (props) => {
    return <SettlementDashboard {...props} isSellerView={false} />;
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Liquidación de Vendedores">
            <Settlements {...properties} />
        </BaseAdminto>
    );
});

export default Settlements;
